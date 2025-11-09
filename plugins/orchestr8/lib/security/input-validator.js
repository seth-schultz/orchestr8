/**
 * Input Validation Layer for Orchestr8 Security
 *
 * Provides comprehensive input sanitization and validation to prevent:
 * - Command injection attacks
 * - Path traversal vulnerabilities
 * - SQL injection (via parameter validation)
 * - XSS (via string sanitization)
 *
 * @module input-validator
 */

const path = require('path');
const fs = require('fs');

class InputValidator {
  /**
   * Dangerous patterns that should be blocked in all inputs
   * These patterns indicate potential command injection or exploitation attempts
   */
  static DANGEROUS_PATTERNS = [
    // Command substitution
    /`/g,                    // Backticks
    /\$\(/g,                 // $() substitution
    /<\(/g,                  // <() process substitution

    // Command chaining
    /;/g,                    // Semicolon separator
    /\|\|/g,                 // OR operator
    /&&/g,                   // AND operator
    /\|(?!\|)/g,             // Pipe (but not ||)

    // Redirection tricks
    />\s*&/g,                // Output redirection to descriptor
    /&>\s*/g,                // Combined stdout/stderr redirection

    // Variable expansion tricks
    /\$\{[^}]*\}/g,          // ${var} expansion
    /\$[A-Z_][A-Z0-9_]*/gi,  // $VAR expansion (allow in strings, validate usage)

    // Null byte injection
    /\x00/g,                 // Null byte
    /\\x00/g,                // Escaped null byte
    /\\0/g,                  // Octal null byte

    // Encoding tricks (base64, hex) in command context
    /\|\s*base64\s+-d/gi,    // Pipe to base64 decode
    /\|\s*xxd\s+-r/gi,       // Pipe to hex decode
    /eval\s*\(/gi,           // eval() calls

    // Dangerous environment variables
    /LD_PRELOAD\s*=/gi,      // Library preload
    /LD_LIBRARY_PATH\s*=/gi, // Library path manipulation
  ];

  /**
   * Path traversal patterns to block
   */
  static PATH_TRAVERSAL_PATTERNS = [
    /\.\.\//g,               // Parent directory
    /\.\.\\/g,               // Parent directory (Windows)
    /\.\.%2[fF]/g,           // URL-encoded ../
    /\.\.%5[cC]/g,           // URL-encoded ..\
  ];

  /**
   * Maximum string length to prevent DoS
   */
  static MAX_STRING_LENGTH = 10000;

  /**
   * Maximum path length
   */
  static MAX_PATH_LENGTH = 4096;

  /**
   * Validate a string input with optional length limit and pattern blocking
   *
   * @param {string} input - The input to validate
   * @param {number} [maxLength] - Maximum allowed length (default: 10000)
   * @param {boolean} [allowVariables=false] - Allow environment variables in string
   * @returns {string} - The validated input
   * @throws {Error} - If validation fails
   */
  static validateString(input, maxLength, allowVariables = false) {
    if (typeof input !== 'string') {
      throw new Error(`Input must be a string, got ${typeof input}`);
    }

    const limit = maxLength || this.MAX_STRING_LENGTH;

    if (input.length > limit) {
      throw new Error(`Input exceeds maximum length of ${limit} characters`);
    }

    // Check for dangerous patterns
    for (const pattern of this.DANGEROUS_PATTERNS) {
      // Skip variable patterns if allowed
      if (allowVariables && pattern.toString().includes('$')) {
        continue;
      }

      if (pattern.test(input)) {
        throw new Error(`Dangerous pattern detected: ${pattern.source}`);
      }
    }

    return input;
  }

  /**
   * Validate a file path to prevent traversal attacks
   *
   * @param {string} inputPath - The path to validate
   * @param {string} workspaceRoot - The workspace root (allowed base path)
   * @param {boolean} [mustExist=false] - Whether the path must exist
   * @returns {string} - The validated absolute path
   * @throws {Error} - If validation fails
   */
  static validatePath(inputPath, workspaceRoot, mustExist = false) {
    if (typeof inputPath !== 'string') {
      throw new Error(`Path must be a string, got ${typeof inputPath}`);
    }

    if (typeof workspaceRoot !== 'string') {
      throw new Error(`Workspace root must be a string, got ${typeof workspaceRoot}`);
    }

    if (inputPath.length > this.MAX_PATH_LENGTH) {
      throw new Error(`Path exceeds maximum length of ${this.MAX_PATH_LENGTH} characters`);
    }

    // Check for path traversal patterns
    for (const pattern of this.PATH_TRAVERSAL_PATTERNS) {
      if (pattern.test(inputPath)) {
        throw new Error(`Path traversal pattern detected: ${pattern.source}`);
      }
    }

    // Resolve to absolute path
    const absolutePath = path.resolve(workspaceRoot, inputPath);

    // Verify it's within workspace
    if (!absolutePath.startsWith(workspaceRoot)) {
      throw new Error(
        `Path traversal detected: ${inputPath} resolves outside workspace (${absolutePath} not in ${workspaceRoot})`
      );
    }

    // Check for symlink escape if path exists
    if (fs.existsSync(absolutePath)) {
      try {
        const realPath = fs.realpathSync(absolutePath);
        if (!realPath.startsWith(workspaceRoot)) {
          throw new Error(
            `Symlink escape detected: ${inputPath} points to ${realPath} outside workspace`
          );
        }
      } catch (err) {
        if (err.code !== 'ENOENT') {
          throw err;
        }
      }
    } else if (mustExist) {
      throw new Error(`Path does not exist: ${inputPath}`);
    }

    return absolutePath;
  }

  /**
   * Validate a URL with protocol allowlisting
   *
   * @param {string} input - The URL to validate
   * @param {string[]} [allowedProtocols=['https', 'http']] - Allowed protocols
   * @returns {string} - The validated URL
   * @throws {Error} - If validation fails
   */
  static validateURL(input, allowedProtocols = ['https', 'http']) {
    if (typeof input !== 'string') {
      throw new Error(`URL must be a string, got ${typeof input}`);
    }

    // Parse URL (throws if invalid)
    let url;
    try {
      url = new URL(input);
    } catch (err) {
      throw new Error(`Invalid URL: ${err.message}`);
    }

    // Check protocol
    const protocol = url.protocol.replace(':', '');
    if (!allowedProtocols.includes(protocol)) {
      throw new Error(
        `Protocol ${protocol} not allowed. Allowed protocols: ${allowedProtocols.join(', ')}`
      );
    }

    // Check for data exfiltration attempts
    if (url.username || url.password) {
      throw new Error('URLs with credentials are not allowed');
    }

    return input;
  }

  /**
   * Validate a command against an allowlist
   *
   * @param {string} command - The full command to validate
   * @param {string[]} allowedCommands - List of allowed command names
   * @param {Object} [options] - Additional validation options
   * @param {Object} [options.allowedSubcommands] - Map of command -> allowed subcommands
   * @param {RegExp[]} [options.deniedPatterns] - Additional patterns to deny
   * @param {boolean} [options.pathValidationRequired=false] - Validate all paths in command
   * @param {string} [options.workspaceRoot] - Workspace root for path validation
   * @returns {string} - The validated command
   * @throws {Error} - If validation fails
   */
  static validateCommand(command, allowedCommands, options = {}) {
    if (typeof command !== 'string') {
      throw new Error(`Command must be a string, got ${typeof command}`);
    }

    const {
      allowedSubcommands = {},
      deniedPatterns = [],
      pathValidationRequired = false,
      workspaceRoot = process.cwd()
    } = options;

    // Basic string validation
    this.validateString(command, 5000);

    // Parse command (split on whitespace, respecting quotes)
    const parts = this.parseCommand(command);

    if (parts.length === 0) {
      throw new Error('Empty command');
    }

    const commandName = parts[0];
    const subcommand = parts[1];

    // Check if command is in allowlist
    if (!allowedCommands.includes(commandName)) {
      throw new Error(
        `Command '${commandName}' not in allowlist. Allowed commands: ${allowedCommands.join(', ')}`
      );
    }

    // Check subcommand if specified
    if (allowedSubcommands[commandName]) {
      if (!subcommand) {
        throw new Error(
          `Command '${commandName}' requires a subcommand. Allowed: ${allowedSubcommands[commandName].join(', ')}`
        );
      }

      if (!allowedSubcommands[commandName].includes(subcommand)) {
        throw new Error(
          `Subcommand '${subcommand}' not allowed for '${commandName}'. Allowed: ${allowedSubcommands[commandName].join(', ')}`
        );
      }
    }

    // Check additional denied patterns
    for (const pattern of deniedPatterns) {
      if (pattern.test(command)) {
        throw new Error(`Command matches denied pattern: ${pattern.source}`);
      }
    }

    // Validate paths if required
    if (pathValidationRequired) {
      const paths = this.extractPaths(command);
      for (const p of paths) {
        try {
          this.validatePath(p, workspaceRoot, false);
        } catch (err) {
          throw new Error(`Invalid path in command: ${err.message}`);
        }
      }
    }

    return command;
  }

  /**
   * Parse a command string into parts (basic shell parsing)
   *
   * @param {string} command - The command to parse
   * @returns {string[]} - Array of command parts
   */
  static parseCommand(command) {
    const parts = [];
    let current = '';
    let inQuote = false;
    let quoteChar = null;

    for (let i = 0; i < command.length; i++) {
      const char = command[i];

      if ((char === '"' || char === "'") && command[i - 1] !== '\\') {
        if (!inQuote) {
          inQuote = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          inQuote = false;
          quoteChar = null;
        } else {
          current += char;
        }
      } else if (char === ' ' && !inQuote) {
        if (current) {
          parts.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }

    if (current) {
      parts.push(current);
    }

    return parts;
  }

  /**
   * Extract potential file paths from a command
   *
   * @param {string} command - The command to analyze
   * @returns {string[]} - Array of potential paths
   */
  static extractPaths(command) {
    const parts = this.parseCommand(command);
    const paths = [];

    for (const part of parts) {
      // Skip flags
      if (part.startsWith('-')) {
        continue;
      }

      // Check if it looks like a path
      if (part.includes('/') || part.includes('\\') || part.includes('.')) {
        paths.push(part);
      }
    }

    return paths;
  }

  /**
   * Validate an agent name to prevent injection
   *
   * @param {string} agentName - The agent name to validate
   * @returns {string} - The validated agent name
   * @throws {Error} - If validation fails
   */
  static validateAgentName(agentName) {
    if (typeof agentName !== 'string') {
      throw new Error(`Agent name must be a string, got ${typeof agentName}`);
    }

    // Agent names should only contain alphanumeric, dash, underscore
    const validPattern = /^[a-zA-Z0-9_-]+$/;

    if (!validPattern.test(agentName)) {
      throw new Error(
        `Invalid agent name: ${agentName}. Only alphanumeric characters, dashes, and underscores allowed.`
      );
    }

    if (agentName.length > 100) {
      throw new Error('Agent name too long (max 100 characters)');
    }

    return agentName;
  }

  /**
   * Validate a workflow parameter based on type
   *
   * @param {string} paramName - Parameter name
   * @param {any} paramValue - Parameter value
   * @param {string} paramType - Parameter type (string, path, url, number, boolean)
   * @param {Object} [options] - Type-specific options
   * @returns {any} - The validated parameter value
   * @throws {Error} - If validation fails
   */
  static validateWorkflowParameter(paramName, paramValue, paramType, options = {}) {
    switch (paramType) {
      case 'string':
        return this.validateString(paramValue, options.maxLength, options.allowVariables);

      case 'path':
        return this.validatePath(paramValue, options.workspaceRoot || process.cwd(), options.mustExist);

      case 'url':
        return this.validateURL(paramValue, options.allowedProtocols);

      case 'number':
        const num = Number(paramValue);
        if (isNaN(num)) {
          throw new Error(`Parameter ${paramName} must be a number`);
        }
        if (options.min !== undefined && num < options.min) {
          throw new Error(`Parameter ${paramName} must be >= ${options.min}`);
        }
        if (options.max !== undefined && num > options.max) {
          throw new Error(`Parameter ${paramName} must be <= ${options.max}`);
        }
        return num;

      case 'boolean':
        if (typeof paramValue === 'boolean') {
          return paramValue;
        }
        if (paramValue === 'true' || paramValue === '1') {
          return true;
        }
        if (paramValue === 'false' || paramValue === '0') {
          return false;
        }
        throw new Error(`Parameter ${paramName} must be a boolean`);

      case 'enum':
        if (!options.allowedValues) {
          throw new Error('Enum validation requires allowedValues option');
        }
        if (!options.allowedValues.includes(paramValue)) {
          throw new Error(
            `Parameter ${paramName} must be one of: ${options.allowedValues.join(', ')}`
          );
        }
        return paramValue;

      default:
        throw new Error(`Unknown parameter type: ${paramType}`);
    }
  }
}

module.exports = InputValidator;

/**
 * Command Allowlists for Orchestr8 Agent Security
 *
 * Defines per-agent command allowlists for input validation.
 * Each agent category has specific allowed commands and subcommands.
 *
 * @module command-allowlists
 */

/**
 * Command allowlists organized by agent category
 */
const commandAllowlists = {
  /**
   * Read-only agents: Analysis and documentation only
   * No write operations, no bash execution
   */
  'read-only': {
    allowedCommands: ['cat', 'grep', 'git', 'diff', 'wc', 'head', 'tail', 'find', 'ls'],
    allowedSubcommands: {
      git: ['diff', 'log', 'show', 'status', 'blame', 'ls-files']
    },
    deniedPatterns: [/\$\(/g, /`/g, /<\(/g, /;/g, /\|(?!\|)/g, /&&/g, /\|\|/g],
    pathValidationRequired: true,
    requireApproval: false
  },

  /**
   * Code reviewer: Extended read operations
   */
  'code-reviewer': {
    allowedCommands: ['cat', 'grep', 'git', 'diff', 'wc', 'head', 'tail', 'find', 'ls', 'tree'],
    allowedSubcommands: {
      git: ['diff', 'log', 'show', 'status', 'blame', 'ls-files']
    },
    deniedPatterns: [/\$\(/g, /`/g, /<\(/g, /;/g, /\|(?!\|)/g, /&&/g, /\|\|/g],
    pathValidationRequired: true,
    requireApproval: false
  },

  /**
   * Test engineer: Can run tests and install dependencies
   */
  'test-engineer': {
    allowedCommands: [
      'npm', 'pip', 'cargo', 'go', 'mvn', 'gradle',
      'jest', 'pytest', 'mocha', 'vitest', 'playwright',
      'cat', 'grep', 'ls', 'find'
    ],
    allowedSubcommands: {
      npm: ['test', 'run', 'ci', 'install'],
      pip: ['install', 'freeze', 'list', 'show'],
      cargo: ['test', 'build', 'check'],
      go: ['test', 'build', 'vet'],
      mvn: ['test', 'verify', 'install'],
      gradle: ['test', 'build', 'assemble']
    },
    deniedPatterns: [/\$\(/g, /`/g, /<\(/g],
    pathValidationRequired: true,
    requireApproval: {
      'npm install': true, // New dependencies need review
      'pip install': true
    }
  },

  /**
   * Standard development: Full development toolchain
   */
  'standard-development': {
    allowedCommands: [
      // File operations
      'cat', 'echo', 'grep', 'sed', 'awk', 'find', 'ls', 'tree',
      'mkdir', 'touch', 'cp', 'mv', 'rm',

      // Version control
      'git',

      // Package managers
      'npm', 'pip', 'cargo', 'go', 'mvn', 'gradle', 'gem', 'composer',

      // Language runtimes
      'node', 'python', 'python3', 'rustc', 'go', 'java', 'ruby', 'php',

      // Build tools
      'make', 'cmake', 'ninja',

      // Testing
      'jest', 'pytest', 'mocha', 'vitest'
    ],
    allowedSubcommands: {
      git: ['add', 'commit', 'push', 'pull', 'checkout', 'branch', 'merge', 'status', 'diff', 'log'],
      npm: ['install', 'run', 'test', 'build', 'start', 'dev', 'ci'],
      pip: ['install', 'freeze', 'list', 'show'],
      cargo: ['build', 'test', 'run', 'check', 'clippy', 'fmt'],
      go: ['build', 'test', 'run', 'vet', 'mod'],
      rm: ['-f', '-rf', '-r'] // Allowed but path-validated
    },
    deniedPatterns: [/\$\(/g, /`/g, /<\(/g],
    pathValidationRequired: true,
    requireApproval: false
  },

  /**
   * Fullstack developer: Same as standard development
   */
  'fullstack-developer': {
    allowedCommands: [
      'cat', 'echo', 'grep', 'sed', 'awk', 'find', 'ls', 'tree',
      'mkdir', 'touch', 'cp', 'mv', 'rm',
      'git',
      'npm', 'pip', 'cargo', 'go', 'mvn', 'gradle',
      'node', 'python', 'python3', 'rustc', 'go', 'java',
      'jest', 'pytest', 'mocha', 'vitest', 'playwright'
    ],
    allowedSubcommands: {
      git: ['add', 'commit', 'push', 'pull', 'checkout', 'branch', 'merge', 'status', 'diff', 'log'],
      npm: ['install', 'run', 'test', 'build', 'start', 'dev', 'ci'],
      pip: ['install', 'freeze', 'list'],
      cargo: ['build', 'test', 'run', 'check'],
      go: ['build', 'test', 'run', 'mod'],
      rm: ['-f', '-rf', '-r']
    },
    deniedPatterns: [/\$\(/g, /`/g, /<\(/g],
    pathValidationRequired: true,
    requireApproval: false
  },

  /**
   * Language specialists: Language-specific toolchains
   */
  'python-developer': {
    allowedCommands: [
      'cat', 'echo', 'grep', 'find', 'ls', 'mkdir', 'touch', 'cp', 'mv', 'rm',
      'git', 'python', 'python3', 'pip', 'pytest', 'pylint', 'black', 'mypy'
    ],
    allowedSubcommands: {
      git: ['add', 'commit', 'push', 'pull', 'checkout', 'branch', 'status', 'diff'],
      pip: ['install', 'freeze', 'list', 'show'],
      rm: ['-f', '-rf']
    },
    deniedPatterns: [/\$\(/g, /`/g, /<\(/g],
    pathValidationRequired: true,
    requireApproval: false
  },

  'typescript-developer': {
    allowedCommands: [
      'cat', 'echo', 'grep', 'find', 'ls', 'mkdir', 'touch', 'cp', 'mv', 'rm',
      'git', 'node', 'npm', 'npx', 'tsc', 'jest', 'eslint'
    ],
    allowedSubcommands: {
      git: ['add', 'commit', 'push', 'pull', 'checkout', 'branch', 'status', 'diff'],
      npm: ['install', 'run', 'test', 'build', 'ci'],
      npx: ['tsc', 'jest', 'eslint', 'prettier'],
      rm: ['-f', '-rf']
    },
    deniedPatterns: [/\$\(/g, /`/g, /<\(/g],
    pathValidationRequired: true,
    requireApproval: false
  },

  'rust-developer': {
    allowedCommands: [
      'cat', 'echo', 'grep', 'find', 'ls', 'mkdir', 'touch', 'cp', 'mv', 'rm',
      'git', 'cargo', 'rustc', 'rustup'
    ],
    allowedSubcommands: {
      git: ['add', 'commit', 'push', 'pull', 'checkout', 'branch', 'status', 'diff'],
      cargo: ['build', 'test', 'run', 'check', 'clippy', 'fmt', 'doc'],
      rm: ['-f', '-rf']
    },
    deniedPatterns: [/\$\(/g, /`/g, /<\(/g],
    pathValidationRequired: true,
    requireApproval: false
  },

  'go-developer': {
    allowedCommands: [
      'cat', 'echo', 'grep', 'find', 'ls', 'mkdir', 'touch', 'cp', 'mv', 'rm',
      'git', 'go'
    ],
    allowedSubcommands: {
      git: ['add', 'commit', 'push', 'pull', 'checkout', 'branch', 'status', 'diff'],
      go: ['build', 'test', 'run', 'vet', 'mod', 'fmt', 'get'],
      rm: ['-f', '-rf']
    },
    deniedPatterns: [/\$\(/g, /`/g, /<\(/g],
    pathValidationRequired: true,
    requireApproval: false
  },

  /**
   * Infrastructure agents: Cloud and deployment tools (REQUIRES APPROVAL)
   */
  'infrastructure': {
    allowedCommands: [
      // Basic operations
      'cat', 'echo', 'ls', 'find',

      // Infrastructure tools
      'terraform', 'kubectl', 'aws', 'gcloud', 'az', 'docker', 'docker-compose',

      // Version control
      'git'
    ],
    allowedSubcommands: {
      git: ['pull', 'checkout', 'status', 'diff'],
      terraform: ['init', 'plan', 'apply', 'destroy', 'validate', 'fmt'],
      kubectl: ['get', 'describe', 'logs', 'apply', 'delete', 'exec'],
      aws: ['s3', 'ec2', 'lambda', 'ecs', 'eks', 'cloudformation'],
      docker: ['build', 'run', 'ps', 'images', 'pull', 'push', 'compose']
    },
    deniedPatterns: [/\$\(/g, /`/g, /<\(/g],
    pathValidationRequired: true,
    requireApproval: true, // ALL commands need approval
    approvalMessage: 'This agent will execute infrastructure commands that may affect production. Review carefully.'
  },

  /**
   * AWS specialist
   */
  'aws-specialist': {
    allowedCommands: ['cat', 'echo', 'ls', 'git', 'aws', 'terraform'],
    allowedSubcommands: {
      aws: ['s3', 'ec2', 'lambda', 'ecs', 'eks', 'cloudformation', 'iam', 'rds', 'dynamodb'],
      terraform: ['init', 'plan', 'apply', 'destroy', 'validate'],
      git: ['pull', 'checkout', 'status']
    },
    deniedPatterns: [/\$\(/g, /`/g, /<\(/g],
    requireApproval: true,
    approvalMessage: 'This will execute AWS infrastructure commands.'
  },

  /**
   * Kubernetes specialist
   */
  'kubernetes-expert': {
    allowedCommands: ['cat', 'echo', 'ls', 'git', 'kubectl', 'helm'],
    allowedSubcommands: {
      kubectl: ['get', 'describe', 'logs', 'apply', 'delete', 'exec', 'port-forward'],
      helm: ['install', 'upgrade', 'uninstall', 'list', 'status'],
      git: ['pull', 'checkout', 'status']
    },
    deniedPatterns: [/\$\(/g, /`/g, /<\(/g],
    requireApproval: true,
    approvalMessage: 'This will execute Kubernetes cluster commands.'
  },

  /**
   * Docker specialist
   */
  'docker-specialist': {
    allowedCommands: ['cat', 'echo', 'ls', 'git', 'docker', 'docker-compose'],
    allowedSubcommands: {
      docker: ['build', 'run', 'ps', 'images', 'pull', 'push', 'exec', 'logs', 'compose'],
      git: ['pull', 'checkout', 'status']
    },
    deniedPatterns: [/\$\(/g, /`/g, /<\(/g],
    requireApproval: false, // Docker operations less risky
    escapeHatch: true // Needs host Docker socket
  },

  /**
   * Database specialists: Database operations
   */
  'database-specialist': {
    allowedCommands: [
      'cat', 'echo', 'ls', 'git',
      'psql', 'mysql', 'mongo', 'redis-cli',
      'pg_dump', 'mysqldump', 'mongodump'
    ],
    allowedSubcommands: {
      git: ['pull', 'checkout', 'status', 'add', 'commit']
    },
    deniedPatterns: [/\$\(/g, /`/g, /<\(/g],
    pathValidationRequired: true,
    requireApproval: {
      // Destructive operations need approval
      'DROP': true,
      'DELETE': true,
      'TRUNCATE': true
    }
  },

  /**
   * Default allowlist (most restrictive)
   */
  'default': {
    allowedCommands: ['cat', 'echo', 'ls', 'grep', 'find'],
    allowedSubcommands: {},
    deniedPatterns: [/\$\(/g, /`/g, /<\(/g, /;/g, /\|/g, /&&/g, /\|\|/g],
    pathValidationRequired: true,
    requireApproval: false
  }
};

/**
 * Agent to category mapping
 * Maps specific agent names to their allowlist category
 */
const agentCategoryMap = {
  // Read-only agents
  'architect': 'read-only',
  'requirements-analyzer': 'read-only',
  'code-archaeologist': 'read-only',
  'technical-writer': 'read-only',
  'api-documenter': 'read-only',
  'pattern-learner': 'read-only',

  // Code review
  'code-reviewer': 'code-reviewer',

  // Testing
  'test-engineer': 'test-engineer',
  'playwright-specialist': 'test-engineer',
  'load-testing-specialist': 'test-engineer',
  'mutation-testing-specialist': 'test-engineer',
  'contract-testing-specialist': 'test-engineer',

  // Development
  'fullstack-developer': 'fullstack-developer',
  'frontend-developer': 'standard-development',
  'backend-developer': 'standard-development',
  'debugger': 'standard-development',

  // Language specialists
  'python-developer': 'python-developer',
  'typescript-developer': 'typescript-developer',
  'rust-developer': 'rust-developer',
  'go-developer': 'go-developer',
  'java-developer': 'standard-development',
  'csharp-developer': 'standard-development',
  'php-developer': 'standard-development',
  'ruby-developer': 'standard-development',
  'kotlin-developer': 'standard-development',
  'swift-developer': 'standard-development',
  'cpp-developer': 'standard-development',

  // Infrastructure
  'aws-specialist': 'aws-specialist',
  'azure-specialist': 'infrastructure',
  'gcp-specialist': 'infrastructure',
  'kubernetes-expert': 'kubernetes-expert',
  'terraform-specialist': 'infrastructure',
  'docker-specialist': 'docker-specialist',
  'sre-specialist': 'infrastructure',

  // Database
  'database-specialist': 'database-specialist',
  'postgresql-specialist': 'database-specialist',
  'mysql-specialist': 'database-specialist',
  'mongodb-specialist': 'database-specialist',
  'redis-specialist': 'database-specialist',

  // Framework specialists
  'react-specialist': 'standard-development',
  'vue-specialist': 'standard-development',
  'angular-specialist': 'standard-development',
  'nextjs-specialist': 'standard-development',

  // API specialists
  'graphql-specialist': 'standard-development',
  'grpc-specialist': 'standard-development',
  'openapi-specialist': 'standard-development',

  // Security
  'security-auditor': 'read-only',

  // Research
  'code-researcher': 'read-only',
  'performance-researcher': 'standard-development',
  'assumption-validator': 'standard-development',
  'pattern-experimenter': 'standard-development'
};

/**
 * Get command allowlist for an agent
 *
 * @param {string} agentName - Name of the agent
 * @returns {Object} - Allowlist configuration
 */
function getAllowlistForAgent(agentName) {
  const category = agentCategoryMap[agentName] || 'default';
  return commandAllowlists[category];
}

/**
 * Get category for an agent
 *
 * @param {string} agentName - Name of the agent
 * @returns {string} - Category name
 */
function getCategoryForAgent(agentName) {
  return agentCategoryMap[agentName] || 'default';
}

module.exports = {
  commandAllowlists,
  agentCategoryMap,
  getAllowlistForAgent,
  getCategoryForAgent
};

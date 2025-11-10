/**
 * Comprehensive Test Suite for Command Allowlists
 *
 * Tests command allowlist configuration:
 * - Agent to category mapping
 * - Tier-based command restrictions
 * - Subcommand filtering
 * - Approval requirements
 */

const {
  commandAllowlists,
  agentCategoryMap,
  getAllowlistForAgent,
  getCategoryForAgent
} = require('../../lib/security/command-allowlists');

describe('Command Allowlists', () => {
  describe('Agent Category Mapping', () => {
    test('maps read-only agents correctly', () => {
      expect(getCategoryForAgent('architect')).toBe('read-only');
      expect(getCategoryForAgent('requirements-analyzer')).toBe('read-only');
      expect(getCategoryForAgent('code-archaeologist')).toBe('read-only');
      expect(getCategoryForAgent('technical-writer')).toBe('read-only');
    });

    test('maps code-reviewer agent correctly', () => {
      expect(getCategoryForAgent('code-reviewer')).toBe('code-reviewer');
    });

    test('maps test-engineer agents correctly', () => {
      expect(getCategoryForAgent('test-engineer')).toBe('test-engineer');
      expect(getCategoryForAgent('playwright-specialist')).toBe('test-engineer');
      expect(getCategoryForAgent('load-testing-specialist')).toBe('test-engineer');
    });

    test('maps development agents correctly', () => {
      expect(getCategoryForAgent('fullstack-developer')).toBe('fullstack-developer');
      expect(getCategoryForAgent('frontend-developer')).toBe('standard-development');
      expect(getCategoryForAgent('backend-developer')).toBe('standard-development');
    });

    test('maps language specialists correctly', () => {
      expect(getCategoryForAgent('python-developer')).toBe('python-developer');
      expect(getCategoryForAgent('typescript-developer')).toBe('typescript-developer');
      expect(getCategoryForAgent('rust-developer')).toBe('rust-developer');
      expect(getCategoryForAgent('go-developer')).toBe('go-developer');
    });

    test('maps infrastructure agents correctly', () => {
      expect(getCategoryForAgent('aws-specialist')).toBe('aws-specialist');
      expect(getCategoryForAgent('kubernetes-expert')).toBe('kubernetes-expert');
      expect(getCategoryForAgent('docker-specialist')).toBe('docker-specialist');
      expect(getCategoryForAgent('terraform-specialist')).toBe('infrastructure');
    });

    test('maps database specialists correctly', () => {
      expect(getCategoryForAgent('database-specialist')).toBe('database-specialist');
      expect(getCategoryForAgent('postgresql-specialist')).toBe('database-specialist');
      expect(getCategoryForAgent('mongodb-specialist')).toBe('database-specialist');
    });

    test('defaults to default category for unknown agents', () => {
      expect(getCategoryForAgent('unknown-agent')).toBe('default');
      expect(getCategoryForAgent('custom-agent-123')).toBe('default');
    });
  });

  describe('Read-Only Agent Allowlist', () => {
    let allowlist;

    beforeEach(() => {
      allowlist = getAllowlistForAgent('architect');
    });

    test('includes only read commands', () => {
      const allowedCommands = allowlist.allowedCommands;

      expect(allowedCommands).toContain('cat');
      expect(allowedCommands).toContain('grep');
      expect(allowedCommands).toContain('git');
      expect(allowedCommands).toContain('diff');
      expect(allowedCommands).toContain('ls');
    });

    test('does not include write commands', () => {
      const allowedCommands = allowlist.allowedCommands;

      expect(allowedCommands).not.toContain('rm');
      expect(allowedCommands).not.toContain('mv');
      expect(allowedCommands).not.toContain('cp');
      expect(allowedCommands).not.toContain('mkdir');
    });

    test('restricts git to read-only subcommands', () => {
      const gitSubcommands = allowlist.allowedSubcommands.git;

      expect(gitSubcommands).toContain('diff');
      expect(gitSubcommands).toContain('log');
      expect(gitSubcommands).toContain('show');
      expect(gitSubcommands).toContain('status');
      expect(gitSubcommands).not.toContain('push');
      expect(gitSubcommands).not.toContain('commit');
    });

    test('requires path validation', () => {
      expect(allowlist.pathValidationRequired).toBe(true);
    });

    test('does not require approval', () => {
      expect(allowlist.requireApproval).toBe(false);
    });

    test('includes dangerous pattern blocking', () => {
      expect(allowlist.deniedPatterns.length).toBeGreaterThan(0);
    });
  });

  describe('Test Engineer Allowlist', () => {
    let allowlist;

    beforeEach(() => {
      allowlist = getAllowlistForAgent('test-engineer');
    });

    test('includes test frameworks', () => {
      const allowedCommands = allowlist.allowedCommands;

      expect(allowedCommands).toContain('jest');
      expect(allowedCommands).toContain('pytest');
      expect(allowedCommands).toContain('mocha');
      expect(allowedCommands).toContain('playwright');
    });

    test('includes package managers', () => {
      const allowedCommands = allowlist.allowedCommands;

      expect(allowedCommands).toContain('npm');
      expect(allowedCommands).toContain('pip');
      expect(allowedCommands).toContain('cargo');
    });

    test('restricts npm to safe subcommands', () => {
      const npmSubcommands = allowlist.allowedSubcommands.npm;

      expect(npmSubcommands).toContain('test');
      expect(npmSubcommands).toContain('run');
      expect(npmSubcommands).toContain('ci');
      expect(npmSubcommands).toContain('install');
    });

    test('restricts pip to safe subcommands', () => {
      const pipSubcommands = allowlist.allowedSubcommands.pip;

      expect(pipSubcommands).toContain('install');
      expect(pipSubcommands).toContain('list');
      expect(pipSubcommands).not.toContain('uninstall');
    });

    test('requires approval for dependency installation', () => {
      expect(allowlist.requireApproval).toBeDefined();
      expect(allowlist.requireApproval['npm install']).toBe(true);
      expect(allowlist.requireApproval['pip install']).toBe(true);
    });
  });

  describe('Standard Development Allowlist', () => {
    let allowlist;

    beforeEach(() => {
      allowlist = getAllowlistForAgent('fullstack-developer');
    });

    test('includes file operations', () => {
      const allowedCommands = allowlist.allowedCommands;

      expect(allowedCommands).toContain('mkdir');
      expect(allowedCommands).toContain('touch');
      expect(allowedCommands).toContain('cp');
      expect(allowedCommands).toContain('mv');
      expect(allowedCommands).toContain('rm');
    });

    test('includes version control', () => {
      const allowedCommands = allowlist.allowedCommands;

      expect(allowedCommands).toContain('git');
    });

    test('includes development tools', () => {
      const allowedCommands = allowlist.allowedCommands;

      expect(allowedCommands).toContain('npm');
      expect(allowedCommands).toContain('node');
      expect(allowedCommands).toContain('python');
    });

    test('includes git write operations', () => {
      const gitSubcommands = allowlist.allowedSubcommands.git;

      expect(gitSubcommands).toContain('add');
      expect(gitSubcommands).toContain('commit');
      expect(gitSubcommands).toContain('push');
      expect(gitSubcommands).toContain('pull');
    });

    test('allows rm with flags', () => {
      const rmSubcommands = allowlist.allowedSubcommands.rm;

      expect(rmSubcommands).toContain('-f');
      expect(rmSubcommands).toContain('-rf');
    });

    test('requires path validation', () => {
      expect(allowlist.pathValidationRequired).toBe(true);
    });
  });

  describe('Language Specialist Allowlists', () => {
    test('Python developer has Python tools', () => {
      const allowlist = getAllowlistForAgent('python-developer');

      expect(allowlist.allowedCommands).toContain('python');
      expect(allowlist.allowedCommands).toContain('python3');
      expect(allowlist.allowedCommands).toContain('pip');
      expect(allowlist.allowedCommands).toContain('pytest');
    });

    test('TypeScript developer has Node tools', () => {
      const allowlist = getAllowlistForAgent('typescript-developer');

      expect(allowlist.allowedCommands).toContain('node');
      expect(allowlist.allowedCommands).toContain('npm');
      expect(allowlist.allowedCommands).toContain('npx');
      expect(allowlist.allowedCommands).toContain('tsc');
    });

    test('Rust developer has Cargo tools', () => {
      const allowlist = getAllowlistForAgent('rust-developer');

      expect(allowlist.allowedCommands).toContain('cargo');
      expect(allowlist.allowedCommands).toContain('rustc');
      expect(allowlist.allowedSubcommands.cargo).toContain('build');
      expect(allowlist.allowedSubcommands.cargo).toContain('test');
      expect(allowlist.allowedSubcommands.cargo).toContain('clippy');
    });

    test('Go developer has Go tools', () => {
      const allowlist = getAllowlistForAgent('go-developer');

      expect(allowlist.allowedCommands).toContain('go');
      expect(allowlist.allowedSubcommands.go).toContain('build');
      expect(allowlist.allowedSubcommands.go).toContain('test');
      expect(allowlist.allowedSubcommands.go).toContain('mod');
    });
  });

  describe('Infrastructure Agent Allowlists', () => {
    test('AWS specialist has AWS CLI', () => {
      const allowlist = getAllowlistForAgent('aws-specialist');

      expect(allowlist.allowedCommands).toContain('aws');
      expect(allowlist.allowedSubcommands.aws).toContain('s3');
      expect(allowlist.allowedSubcommands.aws).toContain('ec2');
      expect(allowlist.allowedSubcommands.aws).toContain('lambda');
    });

    test('Kubernetes expert has kubectl', () => {
      const allowlist = getAllowlistForAgent('kubernetes-expert');

      expect(allowlist.allowedCommands).toContain('kubectl');
      expect(allowlist.allowedSubcommands.kubectl).toContain('get');
      expect(allowlist.allowedSubcommands.kubectl).toContain('apply');
      expect(allowlist.allowedSubcommands.kubectl).toContain('delete');
    });

    test('Docker specialist has Docker commands', () => {
      const allowlist = getAllowlistForAgent('docker-specialist');

      expect(allowlist.allowedCommands).toContain('docker');
      expect(allowlist.allowedSubcommands.docker).toContain('build');
      expect(allowlist.allowedSubcommands.docker).toContain('run');
      expect(allowlist.allowedSubcommands.docker).toContain('ps');
    });

    test('Infrastructure agents require approval', () => {
      expect(getAllowlistForAgent('aws-specialist').requireApproval).toBe(true);
      expect(getAllowlistForAgent('kubernetes-expert').requireApproval).toBe(true);
    });

    test('Infrastructure agents have approval messages', () => {
      const awsAllowlist = getAllowlistForAgent('aws-specialist');
      expect(awsAllowlist.approvalMessage).toBeDefined();
      expect(awsAllowlist.approvalMessage).toContain('AWS');
    });
  });

  describe('Database Specialist Allowlist', () => {
    let allowlist;

    beforeEach(() => {
      allowlist = getAllowlistForAgent('database-specialist');
    });

    test('includes database CLIs', () => {
      expect(allowlist.allowedCommands).toContain('psql');
      expect(allowlist.allowedCommands).toContain('mysql');
      expect(allowlist.allowedCommands).toContain('mongo');
      expect(allowlist.allowedCommands).toContain('redis-cli');
    });

    test('includes backup tools', () => {
      expect(allowlist.allowedCommands).toContain('pg_dump');
      expect(allowlist.allowedCommands).toContain('mysqldump');
      expect(allowlist.allowedCommands).toContain('mongodump');
    });

    test('requires approval for destructive operations', () => {
      expect(allowlist.requireApproval).toBeDefined();
      expect(allowlist.requireApproval['DROP']).toBe(true);
      expect(allowlist.requireApproval['DELETE']).toBe(true);
      expect(allowlist.requireApproval['TRUNCATE']).toBe(true);
    });
  });

  describe('Default Allowlist (Most Restrictive)', () => {
    let allowlist;

    beforeEach(() => {
      allowlist = getAllowlistForAgent('unknown-agent');
    });

    test('includes only minimal commands', () => {
      const allowedCommands = allowlist.allowedCommands;

      expect(allowedCommands).toContain('cat');
      expect(allowedCommands).toContain('echo');
      expect(allowedCommands).toContain('ls');
      expect(allowedCommands).toContain('grep');
      expect(allowedCommands).toContain('find');
    });

    test('has minimal allowed commands', () => {
      expect(allowlist.allowedCommands.length).toBeLessThan(10);
    });

    test('has no subcommand allowlists', () => {
      expect(Object.keys(allowlist.allowedSubcommands).length).toBe(0);
    });

    test('blocks all dangerous patterns', () => {
      expect(allowlist.deniedPatterns.length).toBeGreaterThan(0);
    });

    test('requires path validation', () => {
      expect(allowlist.pathValidationRequired).toBe(true);
    });
  });

  describe('Allowlist Structure Validation', () => {
    test('all allowlists have required fields', () => {
      Object.entries(commandAllowlists).forEach(([category, allowlist]) => {
        expect(allowlist).toHaveProperty('allowedCommands');
        expect(allowlist).toHaveProperty('allowedSubcommands');
        expect(allowlist).toHaveProperty('deniedPatterns');

        expect(Array.isArray(allowlist.allowedCommands)).toBe(true);
        expect(typeof allowlist.allowedSubcommands).toBe('object');
        expect(Array.isArray(allowlist.deniedPatterns)).toBe(true);
      });
    });

    test('allowedCommands are non-empty arrays', () => {
      Object.entries(commandAllowlists).forEach(([category, allowlist]) => {
        expect(allowlist.allowedCommands.length).toBeGreaterThan(0);
      });
    });

    test('deniedPatterns are RegExp objects', () => {
      Object.entries(commandAllowlists).forEach(([category, allowlist]) => {
        allowlist.deniedPatterns.forEach(pattern => {
          expect(pattern).toBeInstanceOf(RegExp);
        });
      });
    });

    test('allowedSubcommands values are arrays', () => {
      Object.entries(commandAllowlists).forEach(([category, allowlist]) => {
        Object.values(allowlist.allowedSubcommands).forEach(subcommands => {
          expect(Array.isArray(subcommands)).toBe(true);
        });
      });
    });
  });

  describe('Security Tier Hierarchy', () => {
    test('default is most restrictive', () => {
      const defaultAllowlist = commandAllowlists['default'];
      const devAllowlist = commandAllowlists['standard-development'];

      expect(defaultAllowlist.allowedCommands.length).toBeLessThan(
        devAllowlist.allowedCommands.length
      );
    });

    test('read-only has fewer commands than development', () => {
      const readOnlyAllowlist = commandAllowlists['read-only'];
      const devAllowlist = commandAllowlists['standard-development'];

      expect(readOnlyAllowlist.allowedCommands.length).toBeLessThan(
        devAllowlist.allowedCommands.length
      );
    });

    test('read-only does not include write commands', () => {
      const readOnlyAllowlist = commandAllowlists['read-only'];
      const writeCommands = ['rm', 'mv', 'cp', 'mkdir', 'touch'];

      writeCommands.forEach(cmd => {
        expect(readOnlyAllowlist.allowedCommands).not.toContain(cmd);
      });
    });

    test('infrastructure agents have restricted command sets', () => {
      const infraAllowlist = commandAllowlists['infrastructure'];
      const devAllowlist = commandAllowlists['standard-development'];

      // Infrastructure should have fewer general commands
      const generalCommands = ['npm', 'pip', 'node', 'python'];
      const infraHasGeneral = generalCommands.filter(cmd =>
        infraAllowlist.allowedCommands.includes(cmd)
      ).length;

      const devHasGeneral = generalCommands.filter(cmd =>
        devAllowlist.allowedCommands.includes(cmd)
      ).length;

      expect(infraHasGeneral).toBeLessThan(devHasGeneral);
    });
  });

  describe('Common Pattern Blocking', () => {
    test('all allowlists block command substitution', () => {
      Object.entries(commandAllowlists).forEach(([category, allowlist]) => {
        const hasBacktickBlock = allowlist.deniedPatterns.some(p =>
          p.toString().includes('`')
        );
        const hasDollarParenBlock = allowlist.deniedPatterns.some(p =>
          p.toString().includes('$')
        );

        expect(hasBacktickBlock || hasDollarParenBlock).toBe(true);
      });
    });

    test('all allowlists block process substitution', () => {
      Object.entries(commandAllowlists).forEach(([category, allowlist]) => {
        const hasProcessSubBlock = allowlist.deniedPatterns.some(p =>
          p.toString().includes('<(')
        );

        expect(hasProcessSubBlock).toBe(true);
      });
    });
  });

  describe('getAllowlistForAgent Function', () => {
    test('returns correct allowlist for known agent', () => {
      const allowlist = getAllowlistForAgent('python-developer');
      expect(allowlist).toBe(commandAllowlists['python-developer']);
    });

    test('returns default allowlist for unknown agent', () => {
      const allowlist = getAllowlistForAgent('unknown-agent-xyz');
      expect(allowlist).toBe(commandAllowlists['default']);
    });

    test('handles undefined agent name', () => {
      const allowlist = getAllowlistForAgent(undefined);
      expect(allowlist).toBe(commandAllowlists['default']);
    });

    test('handles null agent name', () => {
      const allowlist = getAllowlistForAgent(null);
      expect(allowlist).toBe(commandAllowlists['default']);
    });
  });

  describe('Agent Category Map Completeness', () => {
    test('all mapped categories exist in commandAllowlists', () => {
      const uniqueCategories = new Set(Object.values(agentCategoryMap));

      uniqueCategories.forEach(category => {
        expect(commandAllowlists).toHaveProperty(category);
      });
    });

    test('covers common agent types', () => {
      const commonAgents = [
        'architect',
        'code-reviewer',
        'test-engineer',
        'fullstack-developer',
        'python-developer',
        'aws-specialist',
        'database-specialist'
      ];

      commonAgents.forEach(agent => {
        expect(agentCategoryMap).toHaveProperty(agent);
      });
    });
  });
});

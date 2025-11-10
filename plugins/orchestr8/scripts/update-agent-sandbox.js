#!/usr/bin/env node

/**
 * Automated Sandbox Configuration Updater for Orchestr8 Agents
 *
 * Updates all agent markdown files with appropriate sandbox frontmatter
 * based on their security tier assignment.
 *
 * Usage:
 *   node update-agent-sandbox.js --dry-run        # Preview changes
 *   node update-agent-sandbox.js --tier=1         # Update only Tier 1 agents
 *   node update-agent-sandbox.js --all            # Update all agents
 *   node update-agent-sandbox.js --help           # Show help
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

// ============================================================================
// CONFIGURATION
// ============================================================================

const PROJECT_ROOT = path.resolve(__dirname, "../../..");
const AGENTS_DIR = path.join(PROJECT_ROOT, "plugins/orchestr8/agents");
const SANDBOX_CONFIGS_DIR = path.join(
  PROJECT_ROOT,
  ".orchestr8/sandbox-configs",
);
const BACKUPS_DIR = path.join(PROJECT_ROOT, ".orchestr8/backups");

// Tier to agent mapping (from command-allowlists.js)
const TIER_MAPPINGS = {
  "tier-1": [
    "architect",
    "requirements-analyzer",
    "code-archaeologist",
    "technical-writer",
    "api-documenter",
    "pattern-learner",
    "security-auditor",
    "code-researcher",
  ],
  "tier-2": [
    // Core development agents
    "fullstack-developer",
    "frontend-developer",
    "backend-developer",
    "debugger",

    // Language specialists
    "python-developer",
    "typescript-developer",
    "rust-developer",
    "go-developer",
    "java-developer",
    "csharp-developer",
    "php-developer",
    "ruby-developer",
    "kotlin-developer",
    "swift-developer",
    "cpp-developer",

    // Quality and testing
    "code-reviewer",
    "test-engineer",
    "playwright-specialist",
    "load-testing-specialist",
    "mutation-testing-specialist",
    "contract-testing-specialist",

    // Framework specialists
    "react-specialist",
    "vue-specialist",
    "angular-specialist",
    "nextjs-specialist",

    // API specialists
    "graphql-specialist",
    "grpc-specialist",
    "openapi-specialist",

    // Research agents
    "performance-researcher",
    "assumption-validator",
    "pattern-experimenter",

    // Database specialists
    "postgresql-specialist",
    "mysql-specialist",
    "mongodb-specialist",
    "redis-specialist",
    "database-specialist",
    "sqlserver-specialist",
    "oracle-specialist",
    "cassandra-specialist",
    "neo4j-specialist",
    "dynamodb-specialist",

    // AI/ML agents
    "ml-engineer",
    "mlops-specialist",
    "data-engineer",
    "langchain-specialist",
    "llamaindex-specialist",

    // Mobile specialists
    "compose-specialist",
    "swiftui-specialist",

    // Blockchain specialists
    "solidity-specialist",
    "web3-specialist",

    // Game development
    "unity-specialist",
    "godot-specialist",
    "unreal-specialist",

    // Compliance specialists (read-heavy, but may write reports)
    "gdpr-specialist",
    "soc2-specialist",
    "pci-dss-specialist",
    "iso27001-specialist",
    "fedramp-specialist",

    // Meta agents (create other agents/workflows)
    "agent-architect",
    "workflow-architect",
    "skill-architect",
    "plugin-developer",
    "knowledge-researcher",

    // Orchestration agents
    "feature-orchestrator",
    "project-orchestrator",
  ],
  "tier-3": [
    "aws-specialist",
    "azure-specialist",
    "gcp-specialist",
    "kubernetes-expert",
    "terraform-specialist",
    "docker-specialist",
    "sre-specialist",
    "observability-specialist",
    "prometheus-grafana-specialist",
    "elk-stack-specialist",
    "kafka-specialist",
    "rabbitmq-specialist",
    "elasticsearch-specialist",
    "redis-cache-specialist",
    "algolia-specialist",
    "cdn-specialist",
  ],
};

// Sandbox configurations for each tier
const SANDBOX_CONFIGS = {
  "tier-1": {
    enabled: true,
    readonly_filesystem: true,
    allowed_read_paths: ["{{PROJECT_DIR}}/**"],
    allowed_network_domains: [
      "github.com",
      "api.github.com",
      "docs.anthropic.com",
    ],
    disallowed_tools: ["Bash", "Write", "Edit"],
    allowed_commands: [],
  },
  "tier-2": {
    enabled: true,
    allowed_write_paths: [
      "{{PROJECT_DIR}}/**",
      "{{PROJECT_DIR}}/.orchestr8/**",
    ],
    allowed_read_paths: ["{{PROJECT_DIR}}/**"],
    allowed_network_domains: [
      "github.com",
      "api.github.com",
      "registry.npmjs.org",
      "pypi.org",
      "crates.io",
      "packagist.org",
      "rubygems.org",
      "pkg.go.dev",
      "maven.org",
    ],
    allowed_commands: [
      "npm",
      "git",
      "python",
      "node",
      "cargo",
      "go",
      "pip",
      "pytest",
      "jest",
    ],
    disallowed_commands: ["rm -rf /", "curl * | bash", "wget * | sh"],
  },
  "tier-3": {
    enabled: true,
    require_approval: true,
    approval_message:
      "This agent executes infrastructure commands. Review carefully before approving.",
    allowed_write_paths: ["{{PROJECT_DIR}}/**"],
    allowed_read_paths: ["{{PROJECT_DIR}}/**"],
    allowed_network_domains: ["*"],
    allowed_commands: [
      "aws",
      "terraform",
      "kubectl",
      "docker",
      "gcloud",
      "az",
      "helm",
    ],
    escape_hatches: [
      "Docker operations may escape sandbox",
      "kubectl exec provides shell access",
    ],
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Parse YAML frontmatter from markdown content
 * @param {string} content - Full markdown content
 * @returns {Object} { frontmatter: Object, body: string, originalFrontmatter: string }
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content, originalFrontmatter: "" };
  }

  const frontmatterStr = match[1];
  const body = match[2];

  try {
    const frontmatter = yaml.load(frontmatterStr);
    return { frontmatter, body, originalFrontmatter: frontmatterStr };
  } catch (error) {
    console.error(`Error parsing YAML: ${error.message}`);
    return {
      frontmatter: {},
      body: content,
      originalFrontmatter: frontmatterStr,
    };
  }
}

/**
 * Serialize frontmatter and body back to markdown
 * @param {Object} frontmatter - Frontmatter object
 * @param {string} body - Markdown body
 * @returns {string} - Complete markdown with frontmatter
 */
function serializeFrontmatter(frontmatter, body) {
  const yamlStr = yaml.dump(frontmatter, {
    indent: 2,
    lineWidth: -1, // Don't wrap lines
    noRefs: true,
    sortKeys: false,
  });

  return `---\n${yamlStr}---\n${body}`;
}

/**
 * Get tier for an agent based on its name
 * @param {string} agentName - Agent name from frontmatter
 * @returns {string|null} - Tier name or null if not found
 */
function getTierForAgent(agentName) {
  for (const [tier, agents] of Object.entries(TIER_MAPPINGS)) {
    if (agents.includes(agentName)) {
      return tier;
    }
  }
  return null;
}

/**
 * Recursively find all .md files in a directory
 * @param {string} dir - Directory to search
 * @returns {string[]} - Array of file paths
 */
function findMarkdownFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

/**
 * Create backup of file
 * @param {string} filePath - Path to file to backup
 * @param {string} backupDir - Backup directory
 */
function backupFile(filePath, backupDir) {
  const relativePath = path.relative(AGENTS_DIR, filePath);
  const backupPath = path.join(backupDir, relativePath);
  const backupDirPath = path.dirname(backupPath);

  // Create backup directory if it doesn't exist
  if (!fs.existsSync(backupDirPath)) {
    fs.mkdirSync(backupDirPath, { recursive: true });
  }

  // Copy file
  fs.copyFileSync(filePath, backupPath);
}

/**
 * Validate YAML after modification
 * @param {string} content - Markdown content with frontmatter
 * @returns {boolean} - True if valid
 */
function validateYAML(content) {
  try {
    parseFrontmatter(content);
    return true;
  } catch (error) {
    return false;
  }
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Update a single agent file with sandbox configuration
 * @param {string} filePath - Path to agent file
 * @param {Object} options - Options { dryRun, verbose }
 * @returns {Object} - { success, message, tier, agentName }
 */
function updateAgentFile(filePath, options = {}) {
  const { dryRun = false, verbose = false } = options;

  try {
    // Read file
    const content = fs.readFileSync(filePath, "utf8");
    const { frontmatter, body, originalFrontmatter } =
      parseFrontmatter(content);

    // Get agent name from frontmatter
    const agentName = frontmatter.name;
    if (!agentName) {
      return {
        success: false,
        message: "No agent name found in frontmatter",
        filePath,
      };
    }

    // Determine tier
    const tier = getTierForAgent(agentName);
    if (!tier) {
      return {
        success: false,
        message: `Agent not found in tier mappings: ${agentName}`,
        agentName,
        filePath,
      };
    }

    // Check if sandbox already exists
    const hasSandbox = frontmatter.sandbox !== undefined;

    // Get sandbox config for tier
    const sandboxConfig = SANDBOX_CONFIGS[tier];

    // Update frontmatter with sandbox config
    const updatedFrontmatter = {
      ...frontmatter,
      sandbox: sandboxConfig,
    };

    // Serialize back to markdown
    const updatedContent = serializeFrontmatter(updatedFrontmatter, body);

    // Validate YAML
    if (!validateYAML(updatedContent)) {
      return {
        success: false,
        message: "YAML validation failed after update",
        agentName,
        tier,
        filePath,
      };
    }

    // Write file (if not dry run)
    if (!dryRun) {
      fs.writeFileSync(filePath, updatedContent, "utf8");
    }

    return {
      success: true,
      message: hasSandbox
        ? "Updated existing sandbox config"
        : "Added new sandbox config",
      agentName,
      tier,
      filePath,
      hadSandbox: hasSandbox,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error.message}`,
      filePath,
      error,
    };
  }
}

/**
 * Update all agent files
 * @param {Object} options - Options { dryRun, tier, verbose }
 * @returns {Object} - Summary statistics
 */
function updateAllAgents(options = {}) {
  const { dryRun = false, tier = null, verbose = false } = options;

  // Find all agent files
  const agentFiles = findMarkdownFiles(AGENTS_DIR);

  console.log(`\n${"=".repeat(80)}`);
  console.log(`Orchestr8 Agent Sandbox Configuration Update`);
  console.log(`${"=".repeat(80)}\n`);

  if (dryRun) {
    console.log("🔍 DRY RUN MODE - No files will be modified\n");
  }

  console.log(`Found ${agentFiles.length} agent files in ${AGENTS_DIR}\n`);

  // Create backup directory with timestamp
  const timestamp = new Date().toISOString().split("T")[0];
  const backupDir = path.join(BACKUPS_DIR, `agents-${timestamp}`);

  if (!dryRun) {
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
      console.log(`📦 Created backup directory: ${backupDir}\n`);
    }
  }

  // Statistics
  const stats = {
    total: 0,
    success: 0,
    failed: 0,
    skipped: 0,
    updated: 0,
    added: 0,
    byTier: {
      "tier-1": 0,
      "tier-2": 0,
      "tier-3": 0,
    },
  };

  const results = [];

  // Process each file
  for (const filePath of agentFiles) {
    stats.total++;

    const result = updateAgentFile(filePath, { dryRun, verbose });
    results.push(result);

    if (result.success) {
      // Filter by tier if specified
      if (tier && result.tier !== `tier-${tier}`) {
        stats.skipped++;
        if (verbose) {
          console.log(`⏭️  Skipped: ${result.agentName} (${result.tier})`);
        }
        continue;
      }

      stats.success++;
      stats.byTier[result.tier]++;

      if (result.hadSandbox) {
        stats.updated++;
      } else {
        stats.added++;
      }

      // Backup file (if not dry run)
      if (!dryRun) {
        backupFile(filePath, backupDir);
      }

      // Display result
      const icon = result.hadSandbox ? "🔄" : "✨";
      const action = result.hadSandbox ? "Updated" : "Added";
      const tierBadge = result.tier.toUpperCase();

      console.log(
        `${icon} ${action}: ${result.agentName.padEnd(30)} [${tierBadge}]`,
      );

      if (verbose) {
        console.log(`   📄 ${path.relative(PROJECT_ROOT, filePath)}`);
      }
    } else {
      stats.failed++;
      console.log(`❌ Failed: ${path.basename(filePath)}`);
      console.log(`   Error: ${result.message}`);
      if (verbose && result.error) {
        console.log(`   ${result.error.stack}`);
      }
    }
  }

  // Display summary
  console.log(`\n${"=".repeat(80)}`);
  console.log("Summary");
  console.log(`${"=".repeat(80)}\n`);

  console.log(`Total files processed: ${stats.total}`);
  console.log(`✅ Successful: ${stats.success}`);
  console.log(`   - New sandbox configs added: ${stats.added}`);
  console.log(`   - Existing configs updated: ${stats.updated}`);
  console.log(`❌ Failed: ${stats.failed}`);
  console.log(`⏭️  Skipped: ${stats.skipped}`);

  console.log(`\nBy Tier:`);
  console.log(`  Tier 1 (Read-Only):        ${stats.byTier["tier-1"]}`);
  console.log(`  Tier 2 (Standard Dev):     ${stats.byTier["tier-2"]}`);
  console.log(`  Tier 3 (Infrastructure):   ${stats.byTier["tier-3"]}`);

  if (!dryRun && stats.success > 0) {
    console.log(`\n📦 Backups saved to: ${backupDir}`);
  }

  if (dryRun) {
    console.log(`\n💡 Run without --dry-run to apply these changes`);
  }

  console.log(`\n${"=".repeat(80)}\n`);

  return { stats, results };
}

/**
 * Show detailed preview for a specific tier
 * @param {number} tierNum - Tier number (1, 2, or 3)
 */
function showTierPreview(tierNum) {
  const tier = `tier-${tierNum}`;
  const config = SANDBOX_CONFIGS[tier];
  const agents = TIER_MAPPINGS[tier] || [];

  console.log(`\n${"=".repeat(80)}`);
  console.log(`Tier ${tierNum} Configuration Preview`);
  console.log(`${"=".repeat(80)}\n`);

  console.log(`Agents in this tier (${agents.length}):`);
  agents.forEach((agent, idx) => {
    console.log(`  ${(idx + 1).toString().padStart(2)}. ${agent}`);
  });

  console.log(`\nSandbox Configuration:`);
  console.log(yaml.dump({ sandbox: config }, { indent: 2 }));

  console.log(`${"=".repeat(80)}\n`);
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

function showHelp() {
  console.log(`
Orchestr8 Agent Sandbox Configuration Updater

Automatically updates agent markdown files with appropriate sandbox frontmatter
based on their security tier assignment.

USAGE:
  node update-agent-sandbox.js [OPTIONS]

OPTIONS:
  --dry-run             Preview changes without modifying files
  --all                 Update all agents (default if no tier specified)
  --tier=<1|2|3>        Update only agents in specified tier
  --verbose, -v         Show detailed output
  --preview-tier=<1|2|3> Show configuration preview for a tier
  --help, -h            Show this help message

EXAMPLES:
  # Preview all changes
  node update-agent-sandbox.js --dry-run

  # Update all Tier 1 agents
  node update-agent-sandbox.js --tier=1

  # Update all agents with verbose output
  node update-agent-sandbox.js --all --verbose

  # Show Tier 3 configuration preview
  node update-agent-sandbox.js --preview-tier=3

TIERS:
  Tier 1: Read-only agents (analysis, documentation)
  Tier 2: Standard development agents (most language/framework specialists)
  Tier 3: Infrastructure agents (cloud, K8s, Docker - requires approval)

BACKUPS:
  Backups are automatically created in:
  .orchestr8/backups/agents-YYYY-MM-DD/

For more information, see:
  plugins/orchestr8/scripts/README-SANDBOX-UPDATE.md
`);
}

function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  const options = {
    dryRun: args.includes("--dry-run"),
    verbose: args.includes("--verbose") || args.includes("-v"),
    help: args.includes("--help") || args.includes("-h"),
    all: args.includes("--all"),
  };

  // Check for tier argument
  const tierArg = args.find((arg) => arg.startsWith("--tier="));
  if (tierArg) {
    options.tier = parseInt(tierArg.split("=")[1]);
    if (![1, 2, 3].includes(options.tier)) {
      console.error("Error: --tier must be 1, 2, or 3");
      process.exit(1);
    }
  }

  // Check for preview-tier argument
  const previewTierArg = args.find((arg) => arg.startsWith("--preview-tier="));
  if (previewTierArg) {
    const tierNum = parseInt(previewTierArg.split("=")[1]);
    if (![1, 2, 3].includes(tierNum)) {
      console.error("Error: --preview-tier must be 1, 2, or 3");
      process.exit(1);
    }
    showTierPreview(tierNum);
    process.exit(0);
  }

  // Show help
  if (options.help || args.length === 0) {
    showHelp();
    process.exit(0);
  }

  // Check if js-yaml is installed
  try {
    require.resolve("js-yaml");
  } catch (error) {
    console.error("Error: js-yaml is not installed");
    console.error("Please run: npm install js-yaml");
    process.exit(1);
  }

  // Run update
  const { stats } = updateAllAgents(options);

  // Exit with error code if there were failures
  if (stats.failed > 0) {
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  updateAgentFile,
  updateAllAgents,
  parseFrontmatter,
  serializeFrontmatter,
  getTierForAgent,
  TIER_MAPPINGS,
  SANDBOX_CONFIGS,
};

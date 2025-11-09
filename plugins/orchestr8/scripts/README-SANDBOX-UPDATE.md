# Agent Sandbox Configuration Updater

Automated script to update all Orchestr8 agent markdown files with sandbox frontmatter configuration based on security tier assignments.

## Overview

This script manages sandbox security configurations for 80+ agent files by automatically adding/updating YAML frontmatter with appropriate security policies based on each agent's assigned tier.

## Quick Start

```bash
# Preview changes (dry-run mode)
node plugins/orchestr8/scripts/update-agent-sandbox.js --dry-run

# Update all agents
node plugins/orchestr8/scripts/update-agent-sandbox.js --all

# Update specific tier only
node plugins/orchestr8/scripts/update-agent-sandbox.js --tier=1
```

## Security Tiers

### Tier 1: Read-Only Agents
**Purpose**: Analysis and documentation only  
**Security Level**: Strictest (no write operations)

**Agents**:
- architect
- requirements-analyzer
- code-archaeologist
- technical-writer
- api-documenter
- pattern-learner
- security-auditor
- code-researcher

**Sandbox Configuration**:
```yaml
sandbox:
  enabled: true
  readonly_filesystem: true
  allowed_read_paths:
    - "{{PROJECT_DIR}}/**"
  allowed_network_domains:
    - "github.com"
    - "api.github.com"
    - "docs.anthropic.com"
  disallowed_tools:
    - Bash
    - Write
    - Edit
  allowed_commands: []
```

### Tier 2: Standard Development Agents
**Purpose**: Code development and testing  
**Security Level**: Standard (write access to project directory)

**Agents**:
- All language specialists (Python, TypeScript, Rust, Go, Java, etc.)
- Framework specialists (React, Vue, Angular, Next.js)
- Database specialists (PostgreSQL, MySQL, MongoDB, Redis)
- Testing specialists (Playwright, Jest, Pytest)
- API specialists (GraphQL, gRPC, OpenAPI)
- Development agents (fullstack, frontend, backend, debugger)

**Sandbox Configuration**:
```yaml
sandbox:
  enabled: true
  allowed_write_paths:
    - "{{PROJECT_DIR}}/**"
    - "{{PROJECT_DIR}}/.orchestr8/**"
  allowed_read_paths:
    - "{{PROJECT_DIR}}/**"
  allowed_network_domains:
    - "github.com"
    - "api.github.com"
    - "registry.npmjs.org"
    - "pypi.org"
    - "crates.io"
    - "packagist.org"
    - "rubygems.org"
    - "pkg.go.dev"
    - "maven.org"
  allowed_commands:
    - npm
    - git
    - python
    - node
    - cargo
    - go
    - pip
    - pytest
    - jest
  disallowed_commands:
    - "rm -rf /"
    - "curl * | bash"
    - "wget * | sh"
```

### Tier 3: Infrastructure Agents
**Purpose**: Cloud and deployment operations  
**Security Level**: Requires user approval (potential production impact)

**Agents**:
- aws-specialist
- azure-specialist
- gcp-specialist
- kubernetes-expert
- terraform-specialist
- docker-specialist
- sre-specialist
- observability-specialist
- Infrastructure tools (Kafka, RabbitMQ, Elasticsearch, etc.)

**Sandbox Configuration**:
```yaml
sandbox:
  enabled: true
  require_approval: true
  approval_message: "This agent executes infrastructure commands. Review carefully before approving."
  allowed_write_paths:
    - "{{PROJECT_DIR}}/**"
  allowed_read_paths:
    - "{{PROJECT_DIR}}/**"
  allowed_network_domains:
    - "*"
  allowed_commands:
    - aws
    - terraform
    - kubectl
    - docker
    - gcloud
    - az
    - helm
  escape_hatches:
    - "Docker operations may escape sandbox"
    - "kubectl exec provides shell access"
```

## Usage Examples

### Preview All Changes
```bash
node plugins/orchestr8/scripts/update-agent-sandbox.js --dry-run
```

Output shows what would be changed without modifying files:
```
================================================================================
Orchestr8 Agent Sandbox Configuration Update
================================================================================

🔍 DRY RUN MODE - No files will be modified

Found 83 agent files in /path/to/plugins/orchestr8/agents

✨ Added: architect                     [TIER-1]
✨ Added: python-developer              [TIER-2]
🔄 Updated: aws-specialist              [TIER-3]
...
```

### Update Specific Tier
```bash
# Update only Tier 1 (read-only) agents
node plugins/orchestr8/scripts/update-agent-sandbox.js --tier=1

# Update only Tier 2 (development) agents
node plugins/orchestr8/scripts/update-agent-sandbox.js --tier=2

# Update only Tier 3 (infrastructure) agents
node plugins/orchestr8/scripts/update-agent-sandbox.js --tier=3
```

### Update All Agents
```bash
node plugins/orchestr8/scripts/update-agent-sandbox.js --all
```

### Verbose Output
```bash
node plugins/orchestr8/scripts/update-agent-sandbox.js --all --verbose
```

Shows detailed file paths and processing information:
```
✨ Added: architect                     [TIER-1]
   📄 plugins/orchestr8/agents/development/architect.md
🔄 Updated: python-developer            [TIER-2]
   📄 plugins/orchestr8/agents/languages/python-developer.md
```

### Preview Tier Configuration
```bash
# Show Tier 1 configuration
node plugins/orchestr8/scripts/update-agent-sandbox.js --preview-tier=1

# Show Tier 2 configuration
node plugins/orchestr8/scripts/update-agent-sandbox.js --preview-tier=2

# Show Tier 3 configuration
node plugins/orchestr8/scripts/update-agent-sandbox.js --preview-tier=3
```

Output shows agents and configuration for the tier:
```
================================================================================
Tier 1 Configuration Preview
================================================================================

Agents in this tier (8):
   1. architect
   2. requirements-analyzer
   3. code-archaeologist
   ...

Sandbox Configuration:
sandbox:
  enabled: true
  readonly_filesystem: true
  ...
```

## Command Reference

### Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Preview changes without modifying files |
| `--all` | Update all agents (default if no tier specified) |
| `--tier=<1\|2\|3>` | Update only agents in specified tier |
| `--verbose`, `-v` | Show detailed output with file paths |
| `--preview-tier=<1\|2\|3>` | Show configuration preview for a tier |
| `--help`, `-h` | Show help message |

### Examples

```bash
# Safe preview before making changes
node update-agent-sandbox.js --dry-run

# Update only infrastructure agents
node update-agent-sandbox.js --tier=3

# Update all with detailed logging
node update-agent-sandbox.js --all --verbose

# Check what Tier 2 configuration looks like
node update-agent-sandbox.js --preview-tier=2
```

## How It Works

### 1. Tier Assignment
The script uses tier mappings defined in `plugins/orchestr8/lib/security/command-allowlists.js`:

```javascript
const TIER_MAPPINGS = {
  'tier-1': ['architect', 'code-researcher', ...],
  'tier-2': ['python-developer', 'fullstack-developer', ...],
  'tier-3': ['aws-specialist', 'kubernetes-expert', ...]
};
```

### 2. Frontmatter Parsing
- Reads each agent `.md` file
- Parses YAML frontmatter using `js-yaml`
- Extracts agent name to determine tier

### 3. Sandbox Configuration
- Looks up appropriate sandbox config for agent's tier
- Merges with existing frontmatter (preserves name, description, model)
- Adds or updates `sandbox` section

### 4. Validation
- Validates YAML after modification
- Ensures frontmatter is well-formed
- Reports any parsing errors

### 5. Backup
- Creates timestamped backup directory: `.orchestr8/backups/agents-YYYY-MM-DD/`
- Backs up original files before modification
- Preserves directory structure

### 6. Writing
- Writes updated content back to agent file
- Maintains original formatting where possible
- Skips write in dry-run mode

## File Structure

### Before Update
```markdown
---
name: python-developer
description: Expert Python developer...
model: inherit
---

# Python Developer Agent
...
```

### After Update
```markdown
---
name: python-developer
description: Expert Python developer...
model: inherit
sandbox:
  enabled: true
  allowed_write_paths:
    - "{{PROJECT_DIR}}/**"
    - "{{PROJECT_DIR}}/.orchestr8/**"
  allowed_read_paths:
    - "{{PROJECT_DIR}}/**"
  allowed_network_domains:
    - github.com
    - registry.npmjs.org
    - pypi.org
  allowed_commands:
    - npm
    - git
    - python
  disallowed_commands:
    - "rm -rf /"
    - "curl * | bash"
---

# Python Developer Agent
...
```

## Output Summary

After execution, the script provides a comprehensive summary:

```
================================================================================
Summary
================================================================================

Total files processed: 83
✅ Successful: 82
   - New sandbox configs added: 75
   - Existing configs updated: 7
❌ Failed: 1
⏭️  Skipped: 0

By Tier:
  Tier 1 (Read-Only):        8
  Tier 2 (Standard Dev):     60
  Tier 3 (Infrastructure):   14

📦 Backups saved to: .orchestr8/backups/agents-2025-11-09
```

## Safety Features

### Automatic Backups
- All original files backed up before modification
- Timestamped backup directory for version tracking
- Full directory structure preserved
- Can restore from backups if needed

### Dry-Run Mode
- Preview all changes before applying
- See exactly what will be modified
- Verify tier assignments are correct
- No risk of accidental changes

### YAML Validation
- Validates YAML syntax after modification
- Ensures frontmatter is well-formed
- Reports parsing errors
- Skips files that fail validation

### Error Handling
- Continues processing even if individual files fail
- Reports all errors at end
- Provides error details in verbose mode
- Non-zero exit code if failures occur

## Troubleshooting

### Missing js-yaml Package
```
Error: js-yaml is not installed
```

**Solution**:
```bash
npm install js-yaml
```

### Agent Not Found in Tier Mappings
```
❌ Failed: custom-agent.md
   Error: Agent not found in tier mappings: custom-agent
```

**Solution**: Add the agent to the appropriate tier in `TIER_MAPPINGS` in the script.

### YAML Validation Failed
```
❌ Failed: agent.md
   Error: YAML validation failed after update
```

**Solution**: Check the original frontmatter for syntax errors. The script preserves malformed YAML to avoid data loss.

### Permission Errors
```
Error: EACCES: permission denied
```

**Solution**: Ensure you have write permissions to the agents directory and backup directory.

## Restoring from Backup

If you need to restore the original files:

```bash
# Find the backup directory
ls .orchestr8/backups/

# Restore all files from backup
cp -r .orchestr8/backups/agents-2025-11-09/* plugins/orchestr8/agents/

# Or restore specific agent
cp .orchestr8/backups/agents-2025-11-09/languages/python-developer.md \
   plugins/orchestr8/agents/languages/python-developer.md
```

## Maintenance

### Adding New Agents

When adding new agents to the system:

1. Assign the agent to a tier in `TIER_MAPPINGS` in the script
2. Run the script to add sandbox configuration
3. Verify the sandbox config is appropriate for the agent's purpose

### Updating Sandbox Policies

To update sandbox configurations for all agents:

1. Modify `SANDBOX_CONFIGS` in the script
2. Run with `--dry-run` to preview changes
3. Run without `--dry-run` to apply updates
4. Backups are automatically created

### Updating Tier Assignments

To move agents between tiers:

1. Update `TIER_MAPPINGS` in the script
2. Run the script to apply new sandbox configurations
3. Verify changes in dry-run mode first

## Integration with Orchestr8

The sandbox configurations are enforced by the Orchestr8 agent system:

- **Read-Only Agents**: Cannot execute write operations or bash commands
- **Development Agents**: Can write to project directory, run development tools
- **Infrastructure Agents**: Require explicit user approval before execution

See `.orchestr8/sandbox-configs/` for detailed sandbox policy definitions.

## Related Files

- `plugins/orchestr8/lib/security/command-allowlists.js` - Tier assignments and command policies
- `.orchestr8/sandbox-configs/tier-1-read-only.json` - Tier 1 sandbox policy
- `.orchestr8/sandbox-configs/tier-2-standard-dev.json` - Tier 2 sandbox policy
- `.orchestr8/sandbox-configs/tier-3-infrastructure.json` - Tier 3 sandbox policy

## Best Practices

1. **Always run dry-run first**: Preview changes before applying
2. **Backup before bulk updates**: Backups are automatic but verify they exist
3. **Update one tier at a time**: Use `--tier=N` for incremental rollout
4. **Verify tier assignments**: Use `--preview-tier=N` to check configurations
5. **Test after updates**: Verify agents work correctly with new sandbox configs

## Support

For issues or questions:
1. Check this README for common solutions
2. Review error messages in verbose mode (`--verbose`)
3. Check backup directory for original files
4. Review the script source code for implementation details

## Version History

- **v1.0.0** (2025-11-09): Initial release
  - Support for 3 security tiers
  - Automatic frontmatter parsing and updating
  - Dry-run mode and backups
  - Comprehensive error handling

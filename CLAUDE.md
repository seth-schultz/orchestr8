# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the **Claude Code Enterprise Orchestration System** - a hierarchical multi-agent orchestration framework that transforms Claude Code into an autonomous software engineering organization. The system includes 74 specialized agents, 13 autonomous workflows, and comprehensive enterprise capabilities.

## Project Structure

```
claude-org/
├── .claude/                    # The orchestration system (distributed as plugin)
│   ├── CLAUDE.md              # System instructions (for end users)
│   ├── CHANGELOG.md           # Release history
│   ├── VERSION                # Current version (semantic versioning)
│   ├── plugin.json            # Plugin manifest and metadata
│   ├── agents/                # Agent definitions (74 agents)
│   │   ├── development/       # Language specialists, frameworks, game engines, AI/ML, blockchain
│   │   ├── devops/            # Cloud providers, infrastructure, CI/CD
│   │   ├── quality/           # Code review, testing, security, debugging
│   │   ├── compliance/        # FedRAMP, ISO27001, SOC2, GDPR, PCI-DSS
│   │   ├── infrastructure/    # Databases, messaging, search, caching
│   │   └── orchestration/     # Meta-orchestrators
│   └── commands/              # Workflow slash commands (13 workflows)
├── README.md                  # User-facing documentation
├── ARCHITECTURE.md            # System architecture deep-dive
└── VERSION                    # Top-level version file

Agent Categories:
- development/languages/       # Python, TypeScript, Java, Go, Rust, C#, Swift, Kotlin, Ruby, PHP, C++
- development/frontend/        # React, Next.js, Vue, Angular, SwiftUI, Jetpack Compose
- development/game-engines/    # Unity, Unreal Engine, Godot
- development/ai-ml/           # LangChain, LlamaIndex
- development/blockchain/      # Solidity, Web3
- development/api/             # GraphQL, gRPC, OpenAPI
- development/mobile/          # Mobile development specialists
- devops/cloud/                # AWS, Azure, GCP
- devops/infrastructure/       # Terraform, Kubernetes, Docker
- quality/                     # Code review, testing, mutation testing, contract testing
- compliance/                  # Enterprise compliance frameworks
- infrastructure/databases/    # PostgreSQL, MongoDB, Redis
```

## Development Workflow

### Version Management

**This project uses semantic versioning (MAJOR.MINOR.PATCH):**

1. **Update version in TWO places** (must be synchronized):
   - `.claude/VERSION` - Primary version file
   - `.claude/plugin.json` - Plugin metadata (update `version` field)

2. **When to bump versions:**
   - MAJOR: Breaking changes to agent interfaces or workflow behavior
   - MINOR: New agents, workflows, or backward-compatible features (like v1.1.0 adding game dev agents)
   - PATCH: Bug fixes, documentation updates, agent improvements

### Adding New Agents

**Agent files are in:** `.claude/agents/[category]/[agent-name].md`

**Required frontmatter structure:**
```markdown
---
name: agent-name
description: One-line description. Use when [specific use case]. (subagent_type in Task tool)
model: sonnet
---

# Agent Name

[Agent instructions and capabilities...]
```

**After adding an agent:**
1. Update `.claude/plugin.json` → increment `features.agents` count
2. Update `.claude/CHANGELOG.md` → document the new agent
3. If adding a new category, update README.md agent listings
4. Test the agent with Task tool invocation

### Adding New Workflows

**Workflow files are in:** `.claude/commands/[workflow-name].md`

**Required frontmatter structure:**
```markdown
---
description: Brief description of what this workflow does
argument-hint: "[argument-description]"  # Optional
---

# Workflow Name

[Workflow orchestration instructions...]
```

**After adding a workflow:**
1. Update `.claude/plugin.json` → increment `features.workflows` count
2. Update `.claude/CHANGELOG.md` → document the new workflow
3. Update README.md → add workflow to usage guide
4. Test with `/workflow-name` invocation

### Release Process

**To create a new release (e.g., v1.2.0):**

1. **Update version files using automation script (RECOMMENDED):**
   ```bash
   # Method 1: Use automation script (automatically syncs all files)
   echo "1.2.0" > .claude/VERSION
   ./.claude/scripts/sync-plugin-versions.sh

   # This automatically updates:
   # - .claude/plugin.json (version field)
   # - All plugins/*/.claude-plugin/plugin.json (18 files)
   # - .claude-plugin/marketplace.json (both version fields)
   ```

   **OR manually (legacy method):**
   ```bash
   # Update .claude/VERSION
   echo "1.2.0" > .claude/VERSION

   # Update .claude/plugin.json (edit version field)
   # Update features.agents, features.workflows, etc.

   # Update .claude-plugin/marketplace.json (IMPORTANT!)
   # Update BOTH version fields:
   #   - metadata.version
   #   - plugins[0].version
   # Also update descriptions with accurate agent/workflow counts
   ```

2. **Update CHANGELOG.md:**
   - Add new `## [1.2.0] - YYYY-MM-DD` section
   - Document all new agents, workflows, and features
   - Follow existing format with categories: 🎮 🤖 🧪 ⛓️ 📊 🚀

3. **Update README.md:**
   - Update agent/workflow counts in the tagline (line 7-8)
   - Add any new major features to the description
   - Ensure consistency with CHANGELOG and plugin.json

4. **Create release commit:**
   ```bash
   # IMPORTANT: Include all version files
   git add .claude/VERSION .claude/plugin.json .claude-plugin/marketplace.json .claude/CHANGELOG.md README.md plugins/*/.claude-plugin/plugin.json
   git commit -m "release: v1.2.0 - [Brief description of major features]"
   ```

5. **Create and push tag:**
   ```bash
   git tag -a v1.2.0 -m "Release v1.2.0 - [Description]"
   git push origin v1.2.0
   ```

6. **Create GitHub release:**
   ```bash
   gh release create v1.2.0 \
     --title "v1.2.0 - [Feature Summary]" \
     --notes "[Comprehensive release notes from CHANGELOG]"
   ```

**Version Sync Checklist (verify before tagging):**
- [ ] `.claude/VERSION` = 1.2.0
- [ ] `.claude/plugin.json` version = 1.2.0
- [ ] All 18 plugins have version = 1.2.0 (`.claude/scripts/sync-plugin-versions.sh` handles this)
- [ ] `.claude-plugin/marketplace.json` metadata.version = 1.2.0
- [ ] `.claude-plugin/marketplace.json` all plugins[*].version = 1.2.0
- [ ] README.md agent/workflow counts match plugin.json
- [ ] CHANGELOG.md has 1.2.0 entry with complete details
- [ ] All files committed in single "release: v1.2.0" commit

**Automation Features:**
- **Pre-commit Hook:** `.git/hooks/pre-commit` automatically validates:
  - Version consistency across all files
  - CHANGELOG.md entry for the current version
  - Guides you to fix issues before commit
- **Version Sync Script:** `./.claude/scripts/sync-plugin-versions.sh` synchronizes all 18+ version files automatically
- If mismatches are detected, the pre-commit hook will guide you to run the sync script or add CHANGELOG entries

## Testing

### Testing New Agents

**Manual testing approach:**
```
Use the [new-agent-name] agent to [specific task]
```

**Verify:**
- Agent is discovered and loaded
- Agent has correct tools available
- Agent produces correct outputs
- Agent follows system standards (code quality, security, testing)

### Testing New Workflows

**Test workflow invocation:**
```
/workflow-name [test arguments]
```

**Verify:**
- Workflow orchestrates correct agents
- Quality gates are enforced
- Error handling works correctly
- Documentation is generated

## Key Architecture Principles

### 1. Hierarchical Orchestration
- **Layer 1:** Meta-orchestrators (project-orchestrator, feature-orchestrator)
- **Layer 2:** Specialized agents (74 domain experts)
- **Layer 3:** Skills (auto-activated expertise)
- **Layer 4:** Workflows (slash commands)

### 2. Context Management
- Fork context for specialized agents (avoid token bloat)
- Summarize results, don't paste full outputs
- Reference files instead of pasting content
- Keep orchestrator context compact

### 3. Quality Gates
Every workflow enforces:
- Code Review → Tests → Security → Performance → Accessibility → Deploy
- All gates must pass, no exceptions

### 4. Model Selection Strategy
- **Sonnet:** Strategic orchestrators (4 agents), complex architecture decisions
- **Haiku:** Most specialized agents (70 agents), tactical execution
- **Opus:** Reserved for future ultra-complex reasoning tasks

## Common Development Tasks

### Update Agent Count After Adding Agents

```bash
# Count all agent files
find .claude/agents -name "*.md" -not -path "*/orchestration/*" | wc -l

# Update .claude/plugin.json
# Edit features.agents to match count
```

### Add New Category of Agents

1. Create directory: `.claude/agents/[new-category]/`
2. Add agent files with proper frontmatter
3. Update README.md with new category section
4. Update ARCHITECTURE.md if architectural changes
5. Update .claude/CLAUDE.md if new orchestration patterns

### Test Plugin Installation

```bash
# Simulate plugin installation in a test project
cd /tmp
mkdir test-project && cd test-project
git init
cp -r /path/to/claude-org/.claude .

# Verify plugin loads correctly
# Start Claude Code and check agents are available
```

## Documentation Standards

### Agent Documentation
- **Description:** One concise line + use case
- **Core Competencies:** List key capabilities
- **Examples:** Show code examples for main use cases
- **Best Practices:** DO/DON'T lists
- **Testing:** How to test agents' outputs

### Workflow Documentation
- **Purpose:** What problem it solves
- **Steps:** Clear orchestration steps with % completion
- **Quality Gates:** Validation at each stage
- **Example Usage:** Real-world examples
- **Success Criteria:** Clear completion checklist

### Changelog Entries
Follow existing format:
```markdown
## [X.Y.Z] - YYYY-MM-DD

### 🎮 [Category Name]

**New [Type] (N agents/workflows)**
- **Agent/Workflow Name** - Brief description
  - Key capability 1
  - Key capability 2
  - Technical details
```

## Security and Compliance

- **Never commit secrets or API keys** (already in .gitignore)
- **Agent security:** All agents enforce input validation, parameterized queries, OWASP Top 10
- **Compliance agents:** Maintain FedRAMP, ISO27001, SOC2, GDPR, PCI-DSS standards
- **Dependency audits:** Regular security scanning of dependencies

## Cross-Platform Compatibility

**All agents must work on macOS, Linux, and Windows:**
- Use Docker for infrastructure (PostgreSQL, Redis, etc.)
- Use language package managers (npm, pip, cargo)
- Avoid platform-specific paths or commands
- Use path libraries (path.join(), pathlib) instead of hardcoded paths

**Platform-specific agents are OK if documented:**
- swiftui-specialist (macOS/iOS only)
- Clearly marked in agent description

## Plugin Distribution

**This project is distributed as a Claude Code plugin:**

1. Users install via `.claude/` directory
2. `plugin.json` defines metadata and dependencies
3. `.claude/CLAUDE.md` is the entry point for system instructions
4. Agents and workflows are auto-discovered by Claude Code

**When updating plugin metadata:**
- Update `plugin.json` version, features, keywords
- Ensure consistency with VERSION file
- Update repository URLs if changed
- Test plugin installation flow

## Git Workflow

**Branch naming:**
- `main` - Production releases
- `feature/[name]` - New agents or workflows
- `fix/[name]` - Bug fixes
- `docs/[name]` - Documentation updates

**Commit message format (Conventional Commits):**
```
type: brief description

Optional detailed description

feat: add Unity game development specialist
fix: correct terraform-specialist tool configuration
docs: update agent creation guide
release: v1.1.0 - Game Development, AI/ML, and Blockchain/Web3 Support
```

**Types:** feat, fix, docs, refactor, test, chore, release

## Troubleshooting

### Agent Not Found
- Verify file exists in `.claude/agents/[category]/`
- Check frontmatter `name` field matches filename
- Ensure valid YAML frontmatter
- Restart Claude Code to reload agents

### Workflow Not Working
- Check file exists in `.claude/commands/`
- Verify frontmatter has `description` field
- Ensure no syntax errors in markdown
- Use correct syntax: `/workflow-name` not `/workflow_name`

### Version Mismatch
- Ensure `.claude/VERSION` and `.claude/plugin.json` are synchronized
- Both must have identical version numbers

## Contributing

When contributing:
1. Follow existing patterns and conventions
2. Test new agents/workflows thoroughly
3. Update documentation (README, CHANGELOG, ARCHITECTURE if needed)
4. Maintain cross-platform compatibility
5. One feature per PR
6. Include examples in agent definitions

## Resources

- **README.md** - User-facing documentation and usage guide
- **ARCHITECTURE.md** - Deep dive into system design
- **.claude/CLAUDE.md** - System instructions (for end users)
- **.claude/CHANGELOG.md** - Release history and feature tracking
- **Agent files** - Individual agent capabilities and patterns

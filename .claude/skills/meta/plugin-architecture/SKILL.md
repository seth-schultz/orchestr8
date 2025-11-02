---
name: plugin-architecture
description: Expertise in Claude Code plugin structure, semantic versioning, metadata management, and component synchronization. Activate when creating plugins, updating versions, or managing plugin metadata.
---

# Plugin Architecture Skill

Expert knowledge of Claude Code plugin architecture, covering directory structure, plugin.json configuration, semantic versioning, component tracking, and metadata synchronization for the orchestr8 plugin system.

## Plugin Directory Structure

### Standard Plugin Layout

```
.claude/
├── VERSION                    # Primary version file (single line)
├── plugin.json                # Plugin metadata manifest
├── CLAUDE.md                  # System instructions for end users
├── CHANGELOG.md               # Release history
├── QUICKSTART.md              # Getting started guide
├── RELEASE.md                 # Release process documentation
├── agents/                    # Agent definitions
│   ├── development/
│   │   ├── languages/         # Python, TypeScript, Java, etc.
│   │   ├── frontend/          # React, Vue, Angular, etc.
│   │   ├── api/               # GraphQL, gRPC, OpenAPI
│   │   ├── ai-ml/             # LangChain, LlamaIndex
│   │   ├── blockchain/        # Solidity, Web3
│   │   ├── game-engines/      # Unity, Unreal, Godot
│   │   ├── mobile/
│   │   └── data/
│   ├── quality/
│   │   ├── testing/
│   │   └── debugging/
│   ├── infrastructure/
│   │   ├── databases/
│   │   ├── messaging/
│   │   ├── search/
│   │   ├── caching/
│   │   ├── monitoring/
│   │   ├── sre/
│   │   └── cloud/
│   ├── devops/
│   │   ├── cloud/
│   │   └── infrastructure/
│   ├── compliance/
│   ├── orchestration/
│   └── meta/                  # Meta-system agents
├── commands/                  # Workflow slash commands
│   ├── add-feature.md
│   ├── fix-bug.md
│   ├── deploy.md
│   └── [other-workflows].md
└── skills/                    # Auto-activated skills
    ├── practices/
    ├── patterns/
    ├── meta/
    └── [other-categories]/
```

## plugin.json Structure

### Complete Schema

```json
{
  "name": "plugin-identifier",
  "version": "X.Y.Z",
  "description": "[Comprehensive plugin description]",
  "author": {
    "name": "Author Name",
    "url": "https://github.com/author"
  },
  "license": "MIT",
  "repository": "https://github.com/author/plugin",
  "homepage": "https://github.com/author/plugin",
  "keywords": [
    "keyword1",
    "keyword2"
  ],
  "commands": "commands/**/*.md",
  "agents": "agents/**/*.md"
}
```

### Field Descriptions

**Required Fields:**

- `name` - Plugin identifier (lowercase, no spaces, kebab-case)
- `version` - Semantic version (MAJOR.MINOR.PATCH)
- `description` - Comprehensive capability summary
- `commands` - Glob pattern for workflow files (typically "commands/**/*.md")
- `agents` - Glob pattern for agent files (typically "agents/**/*.md")

**Recommended Fields:**

- `author` - Object with `name` and `url`
- `license` - License type (e.g., "MIT")
- `repository` - GitHub repository URL
- `homepage` - Project homepage URL
- `keywords` - Array of searchable keywords

### Description Formula

```
"Complete [type] with [N] specialized agents, [M] autonomous workflows,
[key features]. Features [capabilities]. Transform Claude Code into [value]."
```

**Example:**

```
"Complete autonomous software engineering organization with 69 specialized agents,
19 autonomous workflows, enterprise compliance, game development, AI/ML,
blockchain/Web3 support, and meta-orchestration capabilities. Features multi-stage
iterative code review system and self-extending plugin architecture. Transform
Claude Code into a full development team that can create its own agents,
workflows, and skills."
```

## Semantic Versioning

### Version Format: MAJOR.MINOR.PATCH

```
1.4.0
│ │ │
│ │ └─ PATCH: Bug fixes, documentation, minor improvements
│ └─── MINOR: New features, agents, workflows, backward-compatible
└───── MAJOR: Breaking changes, incompatible API changes
```

### When to Bump Versions

**MAJOR (e.g., 1.x.x → 2.0.0):**
- Breaking changes to agent interfaces
- Major workflow behavior changes requiring user adaptation
- Incompatible API changes
- Fundamental architecture redesign
- Removal of core features

**MINOR (e.g., 1.3.0 → 1.4.0):**
- ✅ New agents added
- ✅ New workflows added
- ✅ New skills added
- ✅ New categories created
- ✅ Backward-compatible feature additions
- ✅ Significant enhancements

**PATCH (e.g., 1.3.0 → 1.3.1):**
- Bug fixes in existing agents/workflows
- Documentation improvements
- Typo corrections
- Minor agent improvements (no interface changes)
- Performance optimizations (without API changes)

### Version Synchronization

**CRITICAL**: Two files must ALWAYS have identical versions:

1. **`.claude/VERSION`** - Single line text file: `1.4.0`
2. **`.claude/plugin.json`** - JSON field: `"version": "1.4.0"`

**Validation:**

```bash
# Check synchronization
VERSION_FILE=$(cat .claude/VERSION)
VERSION_JSON=$(grep '"version"' .claude/plugin.json | sed 's/.*: "\(.*\)".*/\1/')

if [ "$VERSION_FILE" != "$VERSION_JSON" ]; then
  echo "ERROR: VERSION mismatch!"
fi
```

## Component Counting

### Accurate Component Counts

**Count Agents:**
```bash
find .claude/agents -name "*.md" -type f | wc -l
```

**Count Workflows:**
```bash
find .claude/commands -name "*.md" | wc -l
```

**Count Skills:**
```bash
find .claude/skills -type d -mindepth 2 -maxdepth 2 | wc -l
```

### Update Description with Counts

When counts change, update plugin.json description:

**Before:**
```json
"description": "Complete autonomous software engineering organization with 65 specialized agents, 16 autonomous workflows..."
```

**After adding 4 agents and 3 workflows:**
```json
"description": "Complete autonomous software engineering organization with 69 specialized agents, 19 autonomous workflows..."
```

## Keyword Management

### Keyword Categories

**Core Concepts:**
- agents, orchestration, automation, multi-agent, workflows

**Domains:**
- enterprise, devops, ci-cd, security, compliance, quality-assurance

**Cloud Providers:**
- aws, azure, gcp, kubernetes, docker, terraform

**Languages:**
- python, typescript, javascript, java, go, rust, kotlin, swift, csharp, php, ruby, cpp

**Technologies:**
- react, nextjs, vue, angular, django, fastapi, spring-boot, graphql, grpc

**Specializations:**
- game-development, unity, unreal, godot, ai, ml, langchain, llamaindex, blockchain, web3, solidity, ethereum

**Capabilities:**
- code-review, pull-request, architecture-review, test-automation, performance-optimization, accessibility

### When to Add Keywords

- Adding agents for new technologies → Add technology keyword
- Adding new categories → Add category keywords
- Adding significant features → Add feature keywords
- Expanding into new domains → Add domain keywords

## Changelog Management

### Changelog Structure

```markdown
# Changelog

All notable changes to the [plugin-name] plugin will be documented in this file.

## [X.Y.Z] - YYYY-MM-DD

### 🎯 [Category Name]

**New [Type] (N items)**

- **Item Name** - Brief description
  - Key capability 1
  - Key capability 2
  - Technical details

### 📝 [Another Category]

[More changes...]

## [Previous Version] - YYYY-MM-DD

[Previous release notes...]
```

### Category Emojis

- 🎯 Meta-Orchestration / Core Features
- 🎮 Game Development
- 🤖 AI/ML
- ⛓️ Blockchain/Web3
- 📊 Data & Infrastructure
- 🚀 DevOps & Cloud
- 🔒 Security & Compliance
- 🧪 Testing & Quality
- 📝 Documentation
- 🐛 Bug Fixes

### Changelog Entry Pattern

```markdown
## [1.4.0] - 2025-01-15

### 🎯 Meta-Orchestration

**New Meta Agents (4 agents)**

- **agent-architect** - Expert in designing new Claude Code agents
  - Frontmatter design and validation
  - Tool selection strategy
  - Documentation structure
  - Category placement

- **workflow-architect** - Expert in designing autonomous workflows
  - Multi-phase execution design
  - Quality gate implementation
  - Agent coordination patterns

[... more items ...]

**New Meta Workflows (3 workflows)**

- **/create-agent** - Complete agent creation lifecycle
  - Requirements → Design → Implementation → Validation → Integration

[... more items ...]

**New Meta Skills (3 skills)**

- **agent-design-patterns** - Best practices for agent creation
- **workflow-orchestration-patterns** - Workflow design patterns
- **plugin-architecture** - Plugin structure and conventions

### 📊 Updated Capabilities

- **Total Agents**: 69 (up from 65)
- **Total Workflows**: 19 (up from 16)
- **Total Skills**: 4 (up from 1)
```

## Version Update Workflow

### Complete Update Checklist

When releasing a new version:

1. **Update VERSION file**
   ```bash
   echo "1.4.0" > .claude/VERSION
   ```

2. **Update plugin.json**
   - Update `version` field
   - Update `description` with new counts
   - Add new `keywords` if applicable

3. **Count components**
   ```bash
   echo "Agents: $(find .claude/agents -name "*.md" -type f | wc -l)"
   echo "Workflows: $(find .claude/commands -name "*.md" | wc -l)"
   echo "Skills: $(find .claude/skills -type d -mindepth 2 -maxdepth 2 | wc -l)"
   ```

4. **Update CHANGELOG.md**
   - Add new `## [X.Y.Z] - YYYY-MM-DD` section at top
   - Document all changes with categories
   - Include detailed feature descriptions

5. **Verify synchronization**
   - VERSION matches plugin.json version
   - Component counts accurate in description
   - JSON is valid

6. **Create git commit**
   ```bash
   git add .claude/VERSION .claude/plugin.json .claude/CHANGELOG.md
   git commit -m "release: vX.Y.Z - [Brief description]"
   ```

7. **Create git tag**
   ```bash
   git tag -a vX.Y.Z -m "Release vX.Y.Z - [Description]"
   git push origin vX.Y.Z
   ```

## Best Practices

### DO ✅

**Version Management:**
- Always update VERSION and plugin.json together
- Use semantic versioning correctly
- Count components with find commands (don't guess)
- Verify synchronization before committing
- Create git tags for releases

**Metadata:**
- Keep description accurate and up-to-date
- Add keywords when expanding capabilities
- Maintain valid JSON syntax
- Update counts when adding components
- Document all changes in CHANGELOG

**File Organization:**
- Place agents in correct category directories
- Use kebab-case for all filenames
- Follow glob patterns (commands/**/*.md, agents/**/*.md)
- Organize skills by category
- Keep directory structure consistent

### DON'T ❌

**Version Management:**
- Don't desync VERSION and plugin.json versions
- Don't guess component counts
- Don't skip CHANGELOG updates
- Don't bump major version unnecessarily
- Don't forget git tags
- Don't commit without validation

**Metadata:**
- Don't use outdated counts in description
- Don't forget to add keywords for new domains
- Don't break JSON syntax
- Don't skip description updates
- Don't ignore validation errors

**File Organization:**
- Don't use wrong directory structure
- Don't use underscores (always kebab-case)
- Don't break glob patterns
- Don't create inconsistent hierarchies
- Don't place files in wrong categories

## Validation

### Pre-Commit Validation

```bash
# 1. Verify VERSION and plugin.json match
VERSION_FILE=$(cat .claude/VERSION)
VERSION_JSON=$(grep '"version"' .claude/plugin.json | sed 's/.*: "\(.*\)".*/\1/')
if [ "$VERSION_FILE" != "$VERSION_JSON" ]; then
  echo "ERROR: VERSION mismatch!"
  exit 1
fi

# 2. Verify plugin.json is valid JSON
if ! python3 -m json.tool .claude/plugin.json > /dev/null 2>&1; then
  echo "ERROR: plugin.json is not valid JSON!"
  exit 1
fi

# 3. Verify counts
AGENT_COUNT=$(find .claude/agents -name "*.md" -type f | wc -l)
WORKFLOW_COUNT=$(find .claude/commands -name "*.md" | wc -l)
echo "Agents: $AGENT_COUNT"
echo "Workflows: $WORKFLOW_COUNT"

# 4. Verify CHANGELOG has entry for current version
if ! grep -q "\[$VERSION_FILE\]" .claude/CHANGELOG.md; then
  echo "WARNING: No CHANGELOG entry for version $VERSION_FILE"
fi
```

## Common Pitfalls

1. **VERSION Desync** - VERSION file and plugin.json version don't match
2. **Inaccurate Counts** - Description has wrong agent/workflow counts
3. **Missing CHANGELOG** - New version without changelog entry
4. **Invalid JSON** - Syntax errors in plugin.json
5. **Wrong Version Bump** - Using MAJOR when should be MINOR
6. **Missing Keywords** - Not adding keywords for new capabilities
7. **Broken Glob Patterns** - Files not matching commands/**/*.md or agents/**/*.md
8. **Manual Counts** - Guessing counts instead of using find commands

## Remember

1. **Synchronization**: VERSION and plugin.json must always match
2. **Semantic Versioning**: MAJOR.MINOR.PATCH with correct bump logic
3. **Component Counting**: Always use find commands for accuracy
4. **Changelog**: Document every release with categories and details
5. **Keywords**: Update when adding new capabilities or domains
6. **Validation**: Check sync, JSON validity, and counts before commit
7. **Git Tags**: Tag all releases with semantic version

Well-managed plugin metadata ensures consistency, discoverability, and maintainability, enabling the orchestr8 plugin to evolve reliably over time.

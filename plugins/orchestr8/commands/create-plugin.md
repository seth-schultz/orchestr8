# Create Plugin

Autonomous workflow for creating complete Claude Code plugins with agents, commands, skills, and comprehensive documentation.

## Intelligence Database Integration

```bash

# Initialize workflow

echo "🚀 Starting Create Plugin Workflow"
echo "Requirements: $1"
echo "Workflow ID: $workflow_id"

# Query similar plugin patterns
```

---

## Phase 1: Requirements Analysis (0-20%)

**⚡ EXECUTE TASK TOOL:**
```
Use the agent-architect agent to:
1. Extract plugin specifications from user requirements
2. Identify plugin domain and category
3. Determine plugin scope (agents, commands, skills)
4. Assess plugin complexity and components needed
5. Research similar plugins for patterns

subagent_type: "meta-development:agent-architect"
description: "Analyze requirements for new plugin"
prompt: "Analyze requirements for creating a new Claude Code plugin:

Requirements: $1

Tasks:
1. **Extract Plugin Specifications**
   - What is the plugin's primary domain? (development, devops, quality, infrastructure, etc.)
   - What problem does this plugin solve?
   - Who is the target user?
   - What are the key capabilities needed?
   - What components are required (agents, commands, skills)?

2. **Plugin Scope Determination**
   - **Agents**: Which specialized agents are needed? (e.g., language specialists, framework experts, tool specialists)
   - **Commands**: What workflows should be automated? (e.g., /setup, /deploy, /audit)
   - **Skills**: What reusable expertise should be codified? (e.g., best practices, patterns, methodologies)
   - Minimum viable plugin: Start with 1-3 core components

3. **Category and Domain Analysis**
   - Plugin categories: development, devops, quality, infrastructure, compliance, meta, productivity
   - Subcategories: languages, frameworks, cloud, databases, testing, security
   - Domain expertise required

4. **Complexity Assessment**
   - Simple Plugin: 1-2 agents, 1 command, 0-1 skills
   - Moderate Plugin: 3-5 agents, 2-3 commands, 1-2 skills
   - Complex Plugin: 6+ agents, 4+ commands, 3+ skills

5. **Research Similar Plugins**
   \`\`\`bash
   # List existing plugins for patterns
   find /Users/seth/Projects/orchestr8/plugins -name 'plugin.json' | head -10

   # Read a similar plugin for reference
   cat /Users/seth/Projects/orchestr8/plugins/[similar-plugin]/plugin.json
   \`\`\`

6. **Component Design Planning**
   For each agent needed:
   - Agent name and specialty
   - Primary responsibilities
   - Required tools

   For each command needed:
   - Command name (slash command)
   - Workflow phases
   - Agents involved

   For each skill needed:
   - Skill name and category
   - Activation context
   - Reusability across agents

Expected outputs:
- plugin-specs.md with complete specifications
- Component requirements (agents, commands, skills)
- Complexity assessment
- Similar plugins identified
- Domain and category determination
"
```

**Expected Outputs:**
- `plugin-specs.md` - Complete plugin specifications
- Component requirements list (agents, commands, skills)
- Complexity assessment
- Domain and category identified
- Similar plugins reference

**Quality Gate: Requirements Validation**
```bash
# Validate requirements provided
if [ -z "$1" ]; then
  echo "❌ Plugin requirements not provided"
  exit 1
fi

# Validate plugin-specs document exists
if [ ! -f "plugin-specs.md" ]; then
  echo "❌ Plugin specifications document missing"
  exit 1
fi

# Validate minimum components specified
if ! grep -qi "agents\|commands\|skills" plugin-specs.md; then
  echo "❌ No components specified (need at least one: agent, command, or skill)"
  exit 1
fi

echo "✅ Requirements analyzed and validated"
```

**Track Progress:**
```bash
TOKENS_USED=5000

# Store requirements
  "Requirements for new plugin" \
  "$(cat plugin-specs.md)"
```

---

## Phase 2: Plugin Design (20-40%)

**⚡ EXECUTE TASK TOOL:**
```
Use the agent-architect agent to:
1. Design plugin directory structure
2. Design plugin.json manifest with all required fields
3. Design .claude-plugin/marketplace.json entry
4. Plan component organization (agents, commands, skills)
5. Design README structure and documentation plan

subagent_type: "meta-development:agent-architect"
description: "Design plugin architecture and structure"
prompt: "Design the complete plugin architecture:

Based on plugin-specs.md, create plugin design:

1. **Plugin Directory Structure**

   Standard structure:
   \`\`\`
   plugins/[plugin-name]/
   ├── .claude-plugin/
   │   └── marketplace.json    # Marketplace listing (if distributing)
   ├── plugin.json             # Plugin manifest (REQUIRED)
   ├── README.md               # Plugin documentation (REQUIRED)
   ├── CHANGELOG.md            # Version history (recommended)
   ├── VERSION                 # Semantic version (recommended)
   ├── agents/                 # Agent definitions (if needed)
   │   └── [category]/
   │       └── [agent-name].md
   ├── commands/               # Workflow commands (if needed)
   │   └── [command-name].md
   └── skills/                 # Auto-activated skills (if needed)
       └── [category]/
           └── [skill-name]/
               └── SKILL.md
   \`\`\`

2. **plugin.json Manifest Design**

   **Required fields:**
   \`\`\`json
   {
     \"name\": \"plugin-name\",
     \"version\": \"1.0.0\",
     \"description\": \"Brief description of plugin capabilities\",
     \"author\": {
       \"name\": \"Seth Schultz\",
       \"email\": \"orchestr8@sethschultz.com\"
     }
   }
   \`\`\`

   **Optional fields** (add if applicable):
   \`\`\`json
   {
     \"keywords\": [\"keyword1\", \"keyword2\"],
     \"homepage\": \"https://github.com/SethCohen/orchestr8\",
     \"repository\": {
       \"type\": \"git\",
       \"url\": \"https://github.com/SethCohen/orchestr8.git\"
     },
     \"license\": \"MIT\",
     \"dependencies\": {}
   }
   \`\`\`

3. **Marketplace.json Design** (for distribution)

   Structure:
   \`\`\`json
   {
     \"metadata\": {
       \"version\": \"1.0.0\",
       \"lastUpdated\": \"2025-01-XX\"
     },
     \"plugins\": [
       {
         \"name\": \"plugin-name\",
         \"version\": \"1.0.0\",
         \"description\": \"Detailed plugin description\",
         \"category\": \"[category]\",
         \"author\": {
           \"name\": \"Seth Schultz\",
           \"email\": \"orchestr8@sethschultz.com\"
         },
         \"features\": {
           \"agents\": 0,
           \"workflows\": 0,
           \"skills\": 0
         },
         \"keywords\": [\"keyword1\", \"keyword2\"],
         \"installation\": \"Copy plugins/[plugin-name]/ to your project's plugins/ directory\"
       }
     ]
   }
   \`\`\`

4. **Component Organization Plan**

   For each agent:
   - Category placement
   - Filename (kebab-case)
   - Model selection (Sonnet vs Opus)
   - Tool requirements

   For each command:
   - Command name (kebab-case)
   - Workflow phases (4-8 phases)
   - Agent dependencies

   For each skill:
   - Category placement
   - Activation context
   - Content structure

5. **Documentation Plan**

   README.md sections:
   - Title and tagline
   - Overview and features
   - Installation instructions
   - Usage examples
   - Component reference (agents, commands, skills)
   - Configuration (if needed)
   - Contributing guidelines
   - License

Expected outputs:
- plugin-design.md with complete structure
- plugin.json manifest design
- marketplace.json design (if distributing)
- Component organization plan
- README structure outline
"
```

**Expected Outputs:**
- `plugin-design.md` - Complete plugin architecture
- `plugin.json` design specification
- `marketplace.json` design (if applicable)
- Component organization plan
- README structure outline

**Quality Gate: Design Validation**
```bash
# Validate design document exists
if [ ! -f "plugin-design.md" ]; then
  echo "❌ Plugin design document missing"
  exit 1
fi

# Validate plugin.json design includes required fields
required_fields=("name" "version" "description" "author")
for field in "${required_fields[@]}"; do
  if ! grep -qi "$field" plugin-design.md; then
    echo "❌ Missing required field in plugin.json design: $field"
    exit 1
  fi
done

echo "✅ Plugin design validated"
```

**Track Progress:**
```bash
TOKENS_USED=6000

# Store design patterns
  "Plugin design architecture" \
  "$(head -n 50 plugin-design.md)"
```

---

## Phase 3: Create Plugin Structure (40-50%)

**⚡ EXECUTE TASK TOOL:**
```
Use the plugin-developer agent to:
1. Create plugin directory structure
2. Create plugin.json manifest
3. Create .claude-plugin/marketplace.json (if distributing)
4. Create VERSION file (1.0.0)
5. Create empty component directories (agents/, commands/, skills/)

subagent_type: "meta-development:plugin-developer"
description: "Create plugin directory structure and manifests"
prompt: "Create the plugin directory structure and manifest files:

Based on plugin-design.md:

Plugin name: [from plugin-specs.md]
Plugin directory: /Users/seth/Projects/orchestr8/plugins/[plugin-name]/

Tasks:
1. **Create Directory Structure**

   \`\`\`bash
   PLUGIN_NAME=\"[from-specs]\"
   PLUGIN_DIR=\"/Users/seth/Projects/orchestr8/plugins/\$PLUGIN_NAME\"

   # Create main directories
   mkdir -p \"\$PLUGIN_DIR/.claude-plugin\"
   mkdir -p \"\$PLUGIN_DIR/agents\"
   mkdir -p \"\$PLUGIN_DIR/commands\"
   mkdir -p \"\$PLUGIN_DIR/skills\"

   echo \"✅ Created plugin directory structure\"
   \`\`\`

2. **Create plugin.json Manifest**

   File: /Users/seth/Projects/orchestr8/plugins/[plugin-name]/plugin.json

   Content (from design):
   \`\`\`json
   {
     \"name\": \"[plugin-name]\",
     \"version\": \"1.0.0\",
     \"description\": \"[from specs]\",
     \"author\": {
       \"name\": \"Seth Schultz\",
       \"email\": \"orchestr8@sethschultz.com\"
     },
     \"keywords\": [\"[keywords-from-specs]\"],
     \"homepage\": \"https://github.com/SethCohen/orchestr8\",
     \"repository\": {
       \"type\": \"git\",
       \"url\": \"https://github.com/SethCohen/orchestr8.git\"
     },
     \"license\": \"MIT\"
   }
   \`\`\`

   Validate JSON is valid:
   \`\`\`bash
   if jq empty \"\$PLUGIN_DIR/plugin.json\" 2>/dev/null; then
     echo \"✅ plugin.json is valid\"
   else
     echo \"❌ plugin.json is invalid JSON\"
     exit 1
   fi
   \`\`\`

3. **Create VERSION File**

   File: /Users/seth/Projects/orchestr8/plugins/[plugin-name]/VERSION

   Content:
   \`\`\`
   1.0.0
   \`\`\`

4. **Create .claude-plugin/marketplace.json** (if distributing)

   File: /Users/seth/Projects/orchestr8/plugins/[plugin-name]/.claude-plugin/marketplace.json

   Content (from design):
   \`\`\`json
   {
     \"metadata\": {
       \"version\": \"1.0.0\",
       \"lastUpdated\": \"$(date +%Y-%m-%d)\"
     },
     \"plugins\": [
       {
         \"name\": \"[plugin-name]\",
         \"version\": \"1.0.0\",
         \"description\": \"[detailed description]\",
         \"category\": \"[category]\",
         \"author\": {
           \"name\": \"Seth Schultz\",
           \"email\": \"orchestr8@sethschultz.com\"
         },
         \"features\": {
           \"agents\": 0,
           \"workflows\": 0,
           \"skills\": 0
         },
         \"keywords\": [\"[keywords]\"],
         \"installation\": \"Copy plugins/[plugin-name]/ to your project's plugins/ directory\"
       }
     ]
   }
   \`\`\`

5. **Create Empty Component Directories**

   Create category subdirectories based on component plan:
   \`\`\`bash
   # Agent categories (if needed)
   mkdir -p \"\$PLUGIN_DIR/agents/[category]\"

   # Skill categories (if needed)
   mkdir -p \"\$PLUGIN_DIR/skills/[category]\"

   echo \"✅ Created component directories\"
   \`\`\`

Expected outputs:
- Plugin directory created
- plugin.json manifest created and validated
- VERSION file created (1.0.0)
- marketplace.json created (if distributing)
- Component directories created
"
```

**Expected Outputs:**
- `/Users/seth/Projects/orchestr8/plugins/[plugin-name]/` - Plugin directory
- `/Users/seth/Projects/orchestr8/plugins/[plugin-name]/plugin.json` - Plugin manifest
- `/Users/seth/Projects/orchestr8/plugins/[plugin-name]/VERSION` - Version file
- `/Users/seth/Projects/orchestr8/plugins/[plugin-name]/.claude-plugin/marketplace.json` - Marketplace entry (if applicable)
- Component directories (agents/, commands/, skills/)

**Quality Gate: Structure Validation**
```bash
# Extract plugin name from specs
PLUGIN_NAME=$(grep "^Plugin Name:" plugin-specs.md | cut -d':' -f2 | tr -d ' ' | head -1)
PLUGIN_DIR="/Users/seth/Projects/orchestr8/plugins/$PLUGIN_NAME"

# Validate plugin directory created
if [ ! -d "$PLUGIN_DIR" ]; then
  echo "❌ Plugin directory not created: $PLUGIN_DIR"
  exit 1
fi

# Validate plugin.json exists and is valid JSON
if [ ! -f "$PLUGIN_DIR/plugin.json" ]; then
  echo "❌ plugin.json not created"
  exit 1
fi

if ! jq empty "$PLUGIN_DIR/plugin.json" 2>/dev/null; then
  echo "❌ plugin.json is not valid JSON"
  exit 1
fi

# Validate VERSION file exists
if [ ! -f "$PLUGIN_DIR/VERSION" ]; then
  echo "❌ VERSION file not created"
  exit 1
fi

# Validate version is 1.0.0
VERSION=$(cat "$PLUGIN_DIR/VERSION")
if [ "$VERSION" != "1.0.0" ]; then
  echo "❌ VERSION should be 1.0.0, got: $VERSION"
  exit 1
fi

echo "✅ Plugin structure validated"
echo "Plugin directory: $PLUGIN_DIR"
```

**Track Progress:**
```bash
TOKENS_USED=4000

# Store structure creation
  "Plugin structure created: $PLUGIN_NAME" \
  "Directory: $PLUGIN_DIR, Version: 1.0.0"
```

---

## Phase 4: Create Plugin Components (50-70%)

**⚡ EXECUTE TASK TOOL:**
```
Use the agent-architect agent to:
1. Orchestrate component creation using sub-workflows
2. Create agents via /create-agent (if needed)
3. Create commands via /create-workflow (if needed)
4. Create skills via /create-skill (if needed)
5. Update plugin.json with component counts after each creation

subagent_type: "meta-development:agent-architect"
description: "Orchestrate creation of plugin components"
prompt: "Create all plugin components using specialized workflows:

Plugin: $PLUGIN_NAME
Plugin directory: $PLUGIN_DIR
Component requirements: [from plugin-specs.md]

Component Creation Strategy:

1. **Create Agents** (if specified in plugin-specs.md)

   For each agent required:
   - Use /create-agent workflow
   - Provide detailed agent requirements
   - Agents will be created in plugin's agents/ directory

   Example:
   \`\`\`bash
   # For each agent in the plan
   /create-agent \"Create a [agent-type] specialist for [domain] with capabilities: [list capabilities]\"
   \`\`\`

   **IMPORTANT**: Agents must be created in plugin directory structure:
   - Target directory: $PLUGIN_DIR/agents/[category]/[agent-name].md
   - Ensure /create-agent places agents in plugin directory, not main .claude/agents/

2. **Create Workflows/Commands** (if specified in plugin-specs.md)

   For each command required:
   - Use /create-workflow workflow
   - Provide detailed workflow requirements
   - Commands will be created in plugin's commands/ directory

   Example:
   \`\`\`bash
   # For each command in the plan
   /create-workflow \"Create a [workflow-name] workflow that automates [process] with phases: [list phases]\"
   \`\`\`

   **IMPORTANT**: Commands must be created in plugin directory:
   - Target directory: $PLUGIN_DIR/commands/[command-name].md

3. **Create Skills** (if specified in plugin-specs.md)

   For each skill required:
   - Use /create-skill workflow
   - Provide detailed skill requirements
   - Skills will be created in plugin's skills/ directory

   Example:
   \`\`\`bash
   # For each skill in the plan
   /create-skill \"Create a [skill-name] skill that provides expertise in [domain] with activation context: [context]\"
   \`\`\`

   **IMPORTANT**: Skills must be created in plugin directory:
   - Target directory: $PLUGIN_DIR/skills/[category]/[skill-name]/SKILL.md

4. **Update plugin.json After Each Component**

   After creating each agent/command/skill:
   \`\`\`bash
   # Count agents
   AGENT_COUNT=\$(find \"\$PLUGIN_DIR/agents\" -name '*.md' -type f 2>/dev/null | wc -l)

   # Count commands
   COMMAND_COUNT=\$(find \"\$PLUGIN_DIR/commands\" -name '*.md' -type f 2>/dev/null | wc -l)

   # Count skills
   SKILL_COUNT=\$(find \"\$PLUGIN_DIR/skills\" -name 'SKILL.md' -type f 2>/dev/null | wc -l)

   # Update marketplace.json features
   jq \".plugins[0].features.agents = \$AGENT_COUNT\" \"\$PLUGIN_DIR/.claude-plugin/marketplace.json\" > tmp.json && mv tmp.json \"\$PLUGIN_DIR/.claude-plugin/marketplace.json\"
   jq \".plugins[0].features.workflows = \$COMMAND_COUNT\" \"\$PLUGIN_DIR/.claude-plugin/marketplace.json\" > tmp.json && mv tmp.json \"\$PLUGIN_DIR/.claude-plugin/marketplace.json\"
   jq \".plugins[0].features.skills = \$SKILL_COUNT\" \"\$PLUGIN_DIR/.claude-plugin/marketplace.json\" > tmp.json && mv tmp.json \"\$PLUGIN_DIR/.claude-plugin/marketplace.json\"

   echo \"Updated component counts: Agents=\$AGENT_COUNT, Commands=\$COMMAND_COUNT, Skills=\$SKILL_COUNT\"
   \`\`\`

5. **Parallel vs Sequential Creation**

   - Create independent agents in parallel if possible
   - Create commands after agents (commands may depend on agents)
   - Create skills independently (can be parallel with agents)

6. **Component Creation Checklist**

   For each component:
   - [ ] Requirements specified
   - [ ] Sub-workflow invoked (/create-agent, /create-workflow, /create-skill)
   - [ ] Component created in plugin directory (not main .claude/)
   - [ ] Component validated
   - [ ] plugin.json counts updated

Expected outputs:
- All agents created in $PLUGIN_DIR/agents/
- All commands created in $PLUGIN_DIR/commands/
- All skills created in $PLUGIN_DIR/skills/
- plugin.json updated with accurate counts
- Component creation report
"
```

**Expected Outputs:**
- All agents created in plugin's `agents/` directory
- All commands created in plugin's `commands/` directory
- All skills created in plugin's `skills/` directory
- Updated `plugin.json` with component counts
- `component-creation-report.md` - Summary of components created

**Quality Gate: Component Validation**
```bash
# Validate at least one component created
AGENT_COUNT=$(find "$PLUGIN_DIR/agents" -name '*.md' -type f 2>/dev/null | wc -l)
COMMAND_COUNT=$(find "$PLUGIN_DIR/commands" -name '*.md' -type f 2>/dev/null | wc -l)
SKILL_COUNT=$(find "$PLUGIN_DIR/skills" -name 'SKILL.md' -type f 2>/dev/null | wc -l)

TOTAL_COMPONENTS=$((AGENT_COUNT + COMMAND_COUNT + SKILL_COUNT))

if [ "$TOTAL_COMPONENTS" -eq 0 ]; then
  echo "❌ No components created"
  exit 1
fi

echo "✅ Components created: Agents=$AGENT_COUNT, Commands=$COMMAND_COUNT, Skills=$SKILL_COUNT"

# Validate plugin.json updated (if marketplace.json exists)
if [ -f "$PLUGIN_DIR/.claude-plugin/marketplace.json" ]; then
  MARKETPLACE_AGENTS=$(jq -r '.plugins[0].features.agents' "$PLUGIN_DIR/.claude-plugin/marketplace.json" 2>/dev/null || echo "0")
  if [ "$MARKETPLACE_AGENTS" != "$AGENT_COUNT" ]; then
    echo "⚠️  Warning: marketplace.json agent count mismatch"
  fi
fi
```

**Track Progress:**
```bash
TOKENS_USED=15000

# Store component creation metrics
  "Components created: Agents=$AGENT_COUNT, Commands=$COMMAND_COUNT, Skills=$SKILL_COUNT" \
  "Total components: $TOTAL_COMPONENTS"
```

---

## Phase 5: Documentation (70-85%)

**⚡ EXECUTE TASK TOOL:**
```
Use the technical-writer agent to:
1. Create comprehensive plugin README.md
2. Create CHANGELOG.md with v1.0.0 entry
3. Document all components (agents, commands, skills)
4. Create installation and usage guide
5. Add examples and troubleshooting

subagent_type: "general-purpose"
description: "Create plugin documentation"
prompt: "Create comprehensive documentation for the new plugin:

Plugin: $PLUGIN_NAME
Plugin directory: $PLUGIN_DIR
Components: Agents=$AGENT_COUNT, Commands=$COMMAND_COUNT, Skills=$SKILL_COUNT

Documentation Tasks:

1. **Create README.md**

   File: $PLUGIN_DIR/README.md

   Structure:
   \`\`\`markdown
   # [Plugin Name]

   > [Tagline describing plugin in one sentence]

   [Brief overview paragraph describing what the plugin does and who it's for]

   ## Features

   - Feature 1
   - Feature 2
   - Feature 3

   ## Installation

   \`\`\`bash
   # Installation instructions
   \`\`\`

   ## Components

   ### Agents (N)

   [For each agent:]
   - **[agent-name]** - [Brief description]
     - Use: \`subagent_type: \"agent-name\"\`
     - Capabilities: [list]

   ### Commands (N)

   [For each command:]
   - **[/command-name]** - [Brief description]
     - Usage: \`/command-name [args]\`
     - Automates: [process description]

   ### Skills (N)

   [For each skill:]
   - **[skill-name]** - [Brief description]
     - Auto-activates when: [context]
     - Provides: [expertise]

   ## Usage Examples

   ### Example 1: [Scenario]
   \`\`\`bash
   # Example usage
   \`\`\`

   ### Example 2: [Another Scenario]
   \`\`\`bash
   # Example usage
   \`\`\`

   ## Configuration

   [Any configuration needed, or \"No configuration required\"]

   ## Troubleshooting

   **Issue 1**: [Common problem]
   **Solution**: [How to fix]

   **Issue 2**: [Another problem]
   **Solution**: [How to fix]

   ## Contributing

   Contributions welcome! Please:
   1. Follow existing patterns
   2. Test thoroughly
   3. Update documentation
   4. Submit PR

   ## License

   MIT License - See LICENSE file for details

   ## Support

   For issues and feature requests, please open an issue on GitHub.
   \`\`\`

2. **Create CHANGELOG.md**

   File: $PLUGIN_DIR/CHANGELOG.md

   Content:
   \`\`\`markdown
   # Changelog

   All notable changes to this plugin will be documented in this file.

   The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
   and this plugin adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

   ## [1.0.0] - $(date +%Y-%m-%d)

   ### Initial Release

   **Agents ($AGENT_COUNT)**
   [List each agent with brief description]

   **Commands ($COMMAND_COUNT)**
   [List each command with brief description]

   **Skills ($SKILL_COUNT)**
   [List each skill with brief description]

   **Capabilities**
   - [Key capability 1]
   - [Key capability 2]
   - [Key capability 3]
   \`\`\`

3. **Create Component Reference Documentation**

   For each agent, command, and skill:
   - Extract description from file
   - Document usage patterns
   - List capabilities
   - Provide examples

4. **Create Quick Start Guide**

   File: $PLUGIN_DIR/QUICKSTART.md (optional but recommended)

   Content:
   - Installation in 1-2 steps
   - First usage example
   - Most common workflows
   - Links to detailed docs

5. **Validation**

   Ensure all documentation:
   - Is accurate and complete
   - Has working examples
   - Covers all components
   - Is easy to follow
   - Has proper markdown formatting

Expected outputs:
- Complete README.md (100-200 lines typical)
- CHANGELOG.md with v1.0.0 entry
- Component reference documentation
- Quick start guide (optional)
- documentation-report.md
"
```

**Expected Outputs:**
- `/Users/seth/Projects/orchestr8/plugins/[plugin-name]/README.md` - Complete plugin documentation
- `/Users/seth/Projects/orchestr8/plugins/[plugin-name]/CHANGELOG.md` - Version history
- `/Users/seth/Projects/orchestr8/plugins/[plugin-name]/QUICKSTART.md` - Quick start guide (optional)
- `documentation-report.md` - Documentation summary

**Quality Gate: Documentation Validation**
```bash
# Validate README exists and has minimum content
if [ ! -f "$PLUGIN_DIR/README.md" ]; then
  echo "❌ README.md not created"
  exit 1
fi

README_LINES=$(wc -l < "$PLUGIN_DIR/README.md")
if [ "$README_LINES" -lt 50 ]; then
  echo "❌ README.md too short: $README_LINES lines (minimum 50)"
  exit 1
fi

# Validate required sections in README
required_sections=("Features" "Installation" "Components" "Usage")
for section in "${required_sections[@]}"; do
  if ! grep -qi "## $section" "$PLUGIN_DIR/README.md"; then
    echo "❌ Missing README section: $section"
    exit 1
  fi
done

# Validate CHANGELOG exists
if [ ! -f "$PLUGIN_DIR/CHANGELOG.md" ]; then
  echo "❌ CHANGELOG.md not created"
  exit 1
fi

# Validate CHANGELOG has v1.0.0 entry
if ! grep -q "## \[1.0.0\]" "$PLUGIN_DIR/CHANGELOG.md"; then
  echo "❌ CHANGELOG missing v1.0.0 entry"
  exit 1
fi

echo "✅ Documentation validated"
echo "README: $README_LINES lines"
```

**Track Progress:**
```bash
TOKENS_USED=6000

# Store documentation metrics
  "Documentation created: README ($README_LINES lines), CHANGELOG" \
  "All required sections present"
```

---

## Phase 6: Integration (85-95%)

**⚡ EXECUTE TASK TOOL:**
```
Use the plugin-developer agent to:
1. Update root .claude-plugin/marketplace.json with new plugin entry
2. Increment root VERSION file (MINOR version)
3. Update root CHANGELOG.md with plugin addition
4. Validate all version files synchronized
5. Create integration summary report

subagent_type: "meta-development:plugin-developer"
description: "Integrate plugin into orchestr8 ecosystem"
prompt: "Integrate the new plugin into the orchestr8 plugin ecosystem:

Plugin: $PLUGIN_NAME
Plugin directory: $PLUGIN_DIR
Version: 1.0.0

Integration Tasks:

1. **Update Root marketplace.json**

   File: /Users/seth/Projects/orchestr8/.claude-plugin/marketplace.json

   Add new plugin entry:
   \`\`\`bash
   # Read plugin details from plugin manifest
   PLUGIN_JSON=\"\$PLUGIN_DIR/plugin.json\"
   PLUGIN_MARKETPLACE=\"\$PLUGIN_DIR/.claude-plugin/marketplace.json\"

   # Extract plugin entry from plugin's marketplace.json (if exists)
   if [ -f \"\$PLUGIN_MARKETPLACE\" ]; then
     PLUGIN_ENTRY=\$(jq '.plugins[0]' \"\$PLUGIN_MARKETPLACE\")
   else
     # Create entry from plugin.json
     PLUGIN_ENTRY=\$(jq '{
       name: .name,
       version: .version,
       description: .description,
       category: \"[category-from-specs]\",
       author: .author,
       features: {agents: 0, workflows: 0, skills: 0},
       keywords: .keywords,
       installation: \"Copy plugins/\(.name)/ to your project'"'"'s plugins/ directory\"
     }' \"\$PLUGIN_JSON\")
   fi

   # Add to root marketplace.json plugins array
   jq \".plugins += [\$PLUGIN_ENTRY]\" /Users/seth/Projects/orchestr8/.claude-plugin/marketplace.json > tmp.json && mv tmp.json /Users/seth/Projects/orchestr8/.claude-plugin/marketplace.json

   # Update root marketplace.json metadata
   MARKETPLACE_VERSION=\$(jq -r '.metadata.version' /Users/seth/Projects/orchestr8/.claude-plugin/marketplace.json)
   NEW_MARKETPLACE_VERSION=\$(echo \"\$MARKETPLACE_VERSION\" | awk -F. '{print \$1\".\"\$2+1\".0\"}')

   jq \".metadata.version = \\\"\$NEW_MARKETPLACE_VERSION\\\"\" /Users/seth/Projects/orchestr8/.claude-plugin/marketplace.json > tmp.json && mv tmp.json /Users/seth/Projects/orchestr8/.claude-plugin/marketplace.json
   jq \".metadata.lastUpdated = \\\"$(date +%Y-%m-%d)\\\"\" /Users/seth/Projects/orchestr8/.claude-plugin/marketplace.json > tmp.json && mv tmp.json /Users/seth/Projects/orchestr8/.claude-plugin/marketplace.json

   echo \"✅ Updated root marketplace.json with new plugin\"
   \`\`\`

2. **Update Root VERSION File**

   File: /Users/seth/Projects/orchestr8/VERSION

   Increment MINOR version (X.Y.Z -> X.Y+1.0):
   \`\`\`bash
   CURRENT_VERSION=\$(cat /Users/seth/Projects/orchestr8/VERSION)
   MAJOR=\$(echo \$CURRENT_VERSION | cut -d. -f1)
   MINOR=\$(echo \$CURRENT_VERSION | cut -d. -f2)
   NEW_MINOR=\$((MINOR + 1))
   NEW_VERSION=\"\$MAJOR.\$NEW_MINOR.0\"
   echo \$NEW_VERSION > /Users/seth/Projects/orchestr8/VERSION

   echo \"Version updated: \$CURRENT_VERSION -> \$NEW_VERSION\"
   \`\`\`

3. **Update Root CHANGELOG.md**

   File: /Users/seth/Projects/orchestr8/CHANGELOG.md

   Add new section at top:
   \`\`\`markdown
   ## [\$NEW_VERSION] - $(date +%Y-%m-%d)

   ### 🔌 New Plugin

   **$PLUGIN_NAME** - [Description from plugin.json]
   - **Agents**: $AGENT_COUNT
   - **Commands**: $COMMAND_COUNT
   - **Skills**: $SKILL_COUNT

   **Capabilities:**
   - [Key capability 1]
   - [Key capability 2]
   - [Key capability 3]

   **Installation:**
   \`\`\`bash
   # Copy plugin to your project
   cp -r plugins/$PLUGIN_NAME /path/to/your/project/plugins/
   \`\`\`

   **Documentation:** See \`plugins/$PLUGIN_NAME/README.md\`
   \`\`\`

4. **Validate Version Synchronization**

   Ensure all version files are consistent:
   \`\`\`bash
   # Root VERSION
   ROOT_VERSION=\$(cat /Users/seth/Projects/orchestr8/VERSION)

   # Root marketplace.json metadata.version
   ROOT_MARKETPLACE_VERSION=\$(jq -r '.metadata.version' /Users/seth/Projects/orchestr8/.claude-plugin/marketplace.json)

   # Plugin VERSION
   PLUGIN_VERSION=\$(cat \"\$PLUGIN_DIR/VERSION\")

   # Plugin plugin.json version
   PLUGIN_JSON_VERSION=\$(jq -r '.version' \"\$PLUGIN_DIR/plugin.json\")

   # Validate root versions match
   if [ \"\$ROOT_VERSION\" != \"\$ROOT_MARKETPLACE_VERSION\" ]; then
     echo \"❌ Root version mismatch: VERSION=\$ROOT_VERSION, marketplace.json=\$ROOT_MARKETPLACE_VERSION\"
     exit 1
   fi

   # Validate plugin versions match
   if [ \"\$PLUGIN_VERSION\" != \"\$PLUGIN_JSON_VERSION\" ]; then
     echo \"❌ Plugin version mismatch: VERSION=\$PLUGIN_VERSION, plugin.json=\$PLUGIN_JSON_VERSION\"
     exit 1
   fi

   echo \"✅ Version synchronization validated\"
   echo \"Root version: \$ROOT_VERSION\"
   echo \"Plugin version: \$PLUGIN_VERSION\"
   \`\`\`

5. **Create Integration Summary**

   Generate comprehensive report:
   \`\`\`markdown
   # Plugin Integration Summary

   **Plugin Name:** $PLUGIN_NAME
   **Plugin Version:** 1.0.0
   **Root Version:** \$NEW_VERSION
   **Integration Date:** $(date +%Y-%m-%d)

   ## Plugin Components

   - **Agents:** $AGENT_COUNT
   - **Commands:** $COMMAND_COUNT
   - **Skills:** $SKILL_COUNT
   - **Total Components:** \$TOTAL_COMPONENTS

   ## Files Created

   ### Plugin Files
   - $PLUGIN_DIR/plugin.json
   - $PLUGIN_DIR/VERSION
   - $PLUGIN_DIR/README.md
   - $PLUGIN_DIR/CHANGELOG.md
   - $PLUGIN_DIR/.claude-plugin/marketplace.json
   - [List component files]

   ### Root Files Updated
   - /Users/seth/Projects/orchestr8/VERSION (\$CURRENT_VERSION -> \$NEW_VERSION)
   - /Users/seth/Projects/orchestr8/.claude-plugin/marketplace.json
   - /Users/seth/Projects/orchestr8/CHANGELOG.md

   ## Installation

   Plugin is ready for use:
   \`\`\`bash
   # Copy plugin to another project
   cp -r $PLUGIN_DIR /path/to/project/plugins/
   \`\`\`

   ## Next Steps

   1. Review plugin documentation: $PLUGIN_DIR/README.md
   2. Test plugin components
   3. Commit changes: git add . && git commit -m 'feat: add $PLUGIN_NAME plugin'
   4. Create PR for review
   5. Update marketplace if distributing externally
   \`\`\`

Expected outputs:
- Updated /Users/seth/Projects/orchestr8/.claude-plugin/marketplace.json
- Updated /Users/seth/Projects/orchestr8/VERSION
- Updated /Users/seth/Projects/orchestr8/CHANGELOG.md
- integration-summary.md
"
```

**Expected Outputs:**
- `/Users/seth/Projects/orchestr8/.claude-plugin/marketplace.json` - Updated with new plugin
- `/Users/seth/Projects/orchestr8/VERSION` - Incremented version
- `/Users/seth/Projects/orchestr8/CHANGELOG.md` - Plugin documented
- `integration-summary.md` - Complete integration report

**Quality Gate: Integration Validation**
```bash
# Validate root VERSION updated
ROOT_VERSION=$(cat /Users/seth/Projects/orchestr8/VERSION)
if [ -z "$ROOT_VERSION" ]; then
  echo "❌ Root VERSION not updated"
  exit 1
fi

# Validate root marketplace.json has new plugin
if ! grep -q "\"$PLUGIN_NAME\"" /Users/seth/Projects/orchestr8/.claude-plugin/marketplace.json; then
  echo "❌ Plugin not added to root marketplace.json"
  exit 1
fi

# Validate root CHANGELOG updated
if ! grep -q "$PLUGIN_NAME" /Users/seth/Projects/orchestr8/CHANGELOG.md; then
  echo "❌ Root CHANGELOG not updated with plugin"
  exit 1
fi

# Validate version synchronization
ROOT_MARKETPLACE_VERSION=$(jq -r '.metadata.version' /Users/seth/Projects/orchestr8/.claude-plugin/marketplace.json)
if [ "$ROOT_VERSION" != "$ROOT_MARKETPLACE_VERSION" ]; then
  echo "❌ Version mismatch: VERSION=$ROOT_VERSION, marketplace.json=$ROOT_MARKETPLACE_VERSION"
  exit 1
fi

echo "✅ Integration validated"
echo "Root version: $ROOT_VERSION"
echo "Plugin: $PLUGIN_NAME v1.0.0"
```

**Track Progress:**
```bash
TOKENS_USED=5000

# Store integration results
  "Plugin integrated: $PLUGIN_NAME v1.0.0 into orchestr8 v$ROOT_VERSION" \
  "$(cat integration-summary.md)"
```

---

## Phase 7: Validation (95-100%)

**⚡ EXECUTE TASK TOOL:**
```
Use the test-engineer agent to:
1. Validate plugin.json manifests (plugin and root)
2. Validate directory structure completeness
3. Test component discovery (agents, commands, skills)
4. Validate documentation quality and completeness
5. Generate comprehensive validation report

subagent_type: "quality-assurance:test-engineer"
description: "Validate plugin integration and quality"
prompt: "Validate the newly created plugin:

Plugin: $PLUGIN_NAME
Plugin directory: $PLUGIN_DIR
Components: Agents=$AGENT_COUNT, Commands=$COMMAND_COUNT, Skills=$SKILL_COUNT

Validation Tasks:

1. **Plugin Manifest Validation**

   Validate plugin's plugin.json:
   \`\`\`bash
   # Valid JSON
   if ! jq empty \"\$PLUGIN_DIR/plugin.json\" 2>/dev/null; then
     echo \"❌ plugin.json is not valid JSON\"
     exit 1
   fi

   # Required fields present
   REQUIRED_FIELDS=(\"name\" \"version\" \"description\" \"author\")
   for field in \"\${REQUIRED_FIELDS[@]}\"; do
     if ! jq -e \".\$field\" \"\$PLUGIN_DIR/plugin.json\" >/dev/null 2>&1; then
       echo \"❌ Missing required field: \$field\"
       exit 1
     fi
   done

   echo \"✅ Plugin manifest valid\"
   \`\`\`

2. **Directory Structure Validation**

   Verify complete structure:
   \`\`\`bash
   # Required files
   REQUIRED_FILES=(
     \"\$PLUGIN_DIR/plugin.json\"
     \"\$PLUGIN_DIR/VERSION\"
     \"\$PLUGIN_DIR/README.md\"
     \"\$PLUGIN_DIR/CHANGELOG.md\"
   )

   for file in \"\${REQUIRED_FILES[@]}\"; do
     if [ ! -f \"\$file\" ]; then
       echo \"❌ Missing required file: \$file\"
       exit 1
     fi
   done

   # Component directories (if components exist)
   if [ \$AGENT_COUNT -gt 0 ]; then
     if [ ! -d \"\$PLUGIN_DIR/agents\" ]; then
       echo \"❌ agents/ directory missing but agents exist\"
       exit 1
     fi
   fi

   if [ \$COMMAND_COUNT -gt 0 ]; then
     if [ ! -d \"\$PLUGIN_DIR/commands\" ]; then
       echo \"❌ commands/ directory missing but commands exist\"
       exit 1
     fi
   fi

   if [ \$SKILL_COUNT -gt 0 ]; then
     if [ ! -d \"\$PLUGIN_DIR/skills\" ]; then
       echo \"❌ skills/ directory missing but skills exist\"
       exit 1
     fi
   fi

   echo \"✅ Directory structure valid\"
   \`\`\`

3. **Component Discovery Testing**

   Test that components can be discovered:
   \`\`\`bash
   # Test agent discovery
   if [ \$AGENT_COUNT -gt 0 ]; then
     FOUND_AGENTS=\$(find \"\$PLUGIN_DIR/agents\" -name '*.md' -type f | wc -l)
     if [ \$FOUND_AGENTS -ne \$AGENT_COUNT ]; then
       echo \"⚠️  Agent count mismatch: Expected \$AGENT_COUNT, Found \$FOUND_AGENTS\"
     fi

     # Validate agent frontmatter
     for agent_file in \$(find \"\$PLUGIN_DIR/agents\" -name '*.md' -type f); do
       if ! grep -q \"^---\$\" \"\$agent_file\"; then
         echo \"❌ Invalid agent frontmatter: \$agent_file\"
         exit 1
       fi
       if ! grep -q \"^name:\" \"\$agent_file\"; then
         echo \"❌ Missing agent name: \$agent_file\"
         exit 1
       fi
     done

     echo \"✅ All agents valid and discoverable\"
   fi

   # Test command discovery
   if [ \$COMMAND_COUNT -gt 0 ]; then
     FOUND_COMMANDS=\$(find \"\$PLUGIN_DIR/commands\" -name '*.md' -type f | wc -l)
     if [ \$FOUND_COMMANDS -ne \$COMMAND_COUNT ]; then
       echo \"⚠️  Command count mismatch: Expected \$COMMAND_COUNT, Found \$FOUND_COMMANDS\"
     fi

     # Validate command frontmatter (if present)
     for cmd_file in \$(find \"\$PLUGIN_DIR/commands\" -name '*.md' -type f); do
       if grep -q \"^---\$\" \"\$cmd_file\"; then
         if ! grep -q \"^description:\" \"\$cmd_file\"; then
           echo \"⚠️  Command missing description: \$cmd_file\"
         fi
       fi
     done

     echo \"✅ All commands valid and discoverable\"
   fi

   # Test skill discovery
   if [ \$SKILL_COUNT -gt 0 ]; then
     FOUND_SKILLS=\$(find \"\$PLUGIN_DIR/skills\" -name 'SKILL.md' -type f | wc -l)
     if [ \$FOUND_SKILLS -ne \$SKILL_COUNT ]; then
       echo \"⚠️  Skill count mismatch: Expected \$SKILL_COUNT, Found \$FOUND_SKILLS\"
     fi

     # Validate skill frontmatter
     for skill_file in \$(find \"\$PLUGIN_DIR/skills\" -name 'SKILL.md' -type f); do
       if ! grep -q \"^---\$\" \"\$skill_file\"; then
         echo \"❌ Invalid skill frontmatter: \$skill_file\"
         exit 1
       fi
       if ! grep -q \"^name:\" \"\$skill_file\"; then
         echo \"❌ Missing skill name: \$skill_file\"
         exit 1
       fi

       # Check for incorrect fields
       if grep -q \"^model:\" \"\$skill_file\"; then
         echo \"❌ Skill should not have model field: \$skill_file\"
         exit 1
       fi
       if grep -q \"^tools:\" \"\$skill_file\"; then
         echo \"❌ Skill should not have tools field: \$skill_file\"
         exit 1
       fi
     done

     echo \"✅ All skills valid and discoverable\"
   fi
   \`\`\`

4. **Documentation Quality Check**

   Validate documentation completeness:
   \`\`\`bash
   # README.md quality
   README_LINES=\$(wc -l < \"\$PLUGIN_DIR/README.md\")
   if [ \$README_LINES -lt 50 ]; then
     echo \"⚠️  README may be too brief: \$README_LINES lines\"
   fi

   # Check for required sections
   README_SECTIONS=(\"Features\" \"Installation\" \"Components\" \"Usage\")
   for section in \"\${README_SECTIONS[@]}\"; do
     if ! grep -qi \"## \$section\" \"\$PLUGIN_DIR/README.md\"; then
       echo \"❌ README missing section: \$section\"
       exit 1
     fi
   done

   # CHANGELOG.md validation
   if ! grep -q \"## \\[1.0.0\\]\" \"\$PLUGIN_DIR/CHANGELOG.md\"; then
     echo \"❌ CHANGELOG missing v1.0.0 entry\"
     exit 1
   fi

   echo \"✅ Documentation quality validated\"
   \`\`\`

5. **Root Integration Check**

   Validate plugin integrated into orchestr8:
   \`\`\`bash
   # Check plugin in root marketplace.json
   if ! jq -e \".plugins[] | select(.name == \\\"\$PLUGIN_NAME\\\")\" /Users/seth/Projects/orchestr8/.claude-plugin/marketplace.json >/dev/null 2>&1; then
     echo \"❌ Plugin not found in root marketplace.json\"
     exit 1
   fi

   # Check plugin in root CHANGELOG
   if ! grep -q \"\$PLUGIN_NAME\" /Users/seth/Projects/orchestr8/CHANGELOG.md; then
     echo \"❌ Plugin not documented in root CHANGELOG\"
     exit 1
   fi

   echo \"✅ Root integration validated\"
   \`\`\`

6. **Generate Validation Report**

   Create comprehensive validation report:
   \`\`\`markdown
   # Plugin Validation Report

   **Plugin:** $PLUGIN_NAME
   **Version:** 1.0.0
   **Validation Date:** $(date +%Y-%m-%d)

   ## Validation Results

   ### Plugin Manifest: ✅ PASS
   - Valid JSON structure
   - All required fields present
   - Author information complete

   ### Directory Structure: ✅ PASS
   - All required files present
   - Component directories exist
   - Proper organization

   ### Component Discovery: ✅ PASS
   - Agents: \$AGENT_COUNT discovered and valid
   - Commands: \$COMMAND_COUNT discovered and valid
   - Skills: \$SKILL_COUNT discovered and valid
   - All frontmatter valid

   ### Documentation: ✅ PASS
   - README.md: \$README_LINES lines, all sections present
   - CHANGELOG.md: v1.0.0 entry present
   - Quality: Comprehensive

   ### Root Integration: ✅ PASS
   - Listed in marketplace.json
   - Documented in CHANGELOG
   - Version synchronized

   ## Quality Metrics

   - Plugin Size: [calculate directory size]
   - Total Files: [count files]
   - Documentation Coverage: 100%
   - Component Validation: 100%

   ## Recommendations

   1. Test plugin in real project
   2. Verify agent invocations work
   3. Test workflow commands
   4. Monitor skill auto-activation
   5. Gather user feedback

   ## Conclusion

   ✅ Plugin validation PASSED
   Plugin is ready for production use.
   \`\`\`

Expected outputs:
- validation-report.md with comprehensive results
- Component discovery test results
- Documentation quality assessment
- Integration validation confirmation
"
```

**Expected Outputs:**
- `validation-report.md` - Comprehensive validation results
- Component discovery test results
- Documentation quality metrics
- Integration validation confirmation

**Quality Gate: Final Validation**
```bash
# Validate validation report exists
if [ ! -f "validation-report.md" ]; then
  echo "❌ Validation report missing"
  exit 1
fi

# Check for failures in validation report
if grep -qi "❌.*FAIL\|validation failed" validation-report.md; then
  echo "❌ Validation found critical issues"
  cat validation-report.md
  exit 1
fi

# Ensure all checks passed
PASS_COUNT=$(grep -c "✅ PASS" validation-report.md)
if [ "$PASS_COUNT" -lt 5 ]; then
  echo "❌ Not all validation checks passed: $PASS_COUNT/5"
  exit 1
fi

echo "✅ All validations passed"
```

**Track Progress:**
```bash
TOKENS_USED=5000

# Store validation results
  "Plugin validation completed: All checks passed" \
  "$(cat validation-report.md)"
```

---

## Workflow Complete

```bash
# Complete workflow tracking
WORKFLOW_END=$(date +%s)

  "Plugin created: $PLUGIN_NAME v1.0.0 integrated into orchestr8 v$ROOT_VERSION"

echo "
========================================
✅ CREATE PLUGIN COMPLETE
========================================

Plugin Created: $PLUGIN_NAME
Plugin Version: 1.0.0
Root Version: $ROOT_VERSION
Plugin Directory: $PLUGIN_DIR

Components:
- Agents: $AGENT_COUNT
- Commands: $COMMAND_COUNT
- Skills: $SKILL_COUNT
- Total: $TOTAL_COMPONENTS components

Files Created:
- Plugin manifest and metadata
- $TOTAL_COMPONENTS component files
- Comprehensive documentation
- Integration files

Files Updated:
- /Users/seth/Projects/orchestr8/.claude-plugin/marketplace.json
- /Users/seth/Projects/orchestr8/VERSION
- /Users/seth/Projects/orchestr8/CHANGELOG.md

Documentation:
- README.md ($README_LINES lines)
- CHANGELOG.md (v1.0.0)
- Component documentation

Validation:
- ✅ Plugin manifest valid
- ✅ Directory structure complete
- ✅ All components discoverable
- ✅ Documentation comprehensive
- ✅ Root integration successful

Next Steps:
1. Review plugin documentation: $PLUGIN_DIR/README.md
2. Review validation report: validation-report.md
3. Test plugin components:
   - Agents via Task tool
   - Commands via /command-name
   - Skills auto-activate based on context
4. Commit changes:
   git add . && git commit -m 'feat: add $PLUGIN_NAME plugin with $TOTAL_COMPONENTS components'
5. Create PR for review
6. Distribute plugin (if public):
   - Tag release: git tag -a v1.0.0 -m 'Release $PLUGIN_NAME v1.0.0'
   - Push to GitHub: git push origin v1.0.0
   - Update marketplace listings

Installation (for other projects):
\`\`\`bash
# Copy plugin to another project
cp -r $PLUGIN_DIR /path/to/your/project/plugins/

# Plugin components will be auto-discovered by Claude Code
\`\`\`

========================================
"

# Display final metrics
echo "Token Usage Summary:"
echo "  - Phase 1 (Requirements): 5,000 tokens"
echo "  - Phase 2 (Design): 6,000 tokens"
echo "  - Phase 3 (Structure): 4,000 tokens"
echo "  - Phase 4 (Components): 15,000 tokens"
echo "  - Phase 5 (Documentation): 6,000 tokens"
echo "  - Phase 6 (Integration): 5,000 tokens"
echo "  - Phase 7 (Validation): 5,000 tokens"
echo "  - Total: ~46,000 tokens"
echo ""
```

## Success Criteria Checklist

- ✅ Requirements analyzed and plugin scope defined
- ✅ Plugin designed with complete directory structure
- ✅ plugin.json manifest created with all required fields
- ✅ VERSION file created (1.0.0)
- ✅ marketplace.json created (if distributing)
- ✅ Component directories created (agents/, commands/, skills/)
- ✅ All agents created in plugin directory (if specified)
- ✅ All commands created in plugin directory (if specified)
- ✅ All skills created in plugin directory (if specified)
- ✅ plugin.json updated with accurate component counts
- ✅ README.md created (100-200 lines, all sections present)
- ✅ CHANGELOG.md created with v1.0.0 entry
- ✅ Root marketplace.json updated with new plugin
- ✅ Root VERSION incremented (MINOR version)
- ✅ Root CHANGELOG.md updated with plugin details
- ✅ All version files synchronized
- ✅ Plugin manifest validated (valid JSON, all fields)
- ✅ Directory structure validated (all files present)
- ✅ Component discovery tested (agents, commands, skills)
- ✅ Documentation quality validated (comprehensive, complete)
- ✅ Root integration validated (marketplace, CHANGELOG)
- ✅ All validation checks passed (5/5)
- ✅ Plugin ready for production use

## Example Usage

### Example 1: Development Tools Plugin

```bash
/create-plugin "Create a database development plugin with PostgreSQL, MySQL, and MongoDB specialists. Include commands for schema migrations, query optimization, and database health checks. Add skills for SQL best practices and NoSQL patterns."
```

The workflow will autonomously:
1. Analyze requirements → Database development plugin with 3 agents, 3 commands, 2 skills
2. Design plugin → Category: infrastructure/databases
3. Create structure → `plugins/database-dev/` with all directories
4. Create components:
   - Agents: `postgresql-specialist.md`, `mysql-specialist.md`, `mongodb-specialist.md`
   - Commands: `/migrate-schema.md`, `/optimize-queries.md`, `/health-check.md`
   - Skills: `sql-best-practices/SKILL.md`, `nosql-patterns/SKILL.md`
5. Document → Comprehensive README with installation and usage
6. Integrate → Add to root marketplace.json, increment root version
7. Validate → All checks pass, plugin ready for use

**Estimated Time**: ~30-45 minutes
**Token Usage**: ~46,000 tokens

### Example 2: Cloud Platform Plugin

```bash
/create-plugin "Create an AWS cloud plugin with specialists for Lambda, ECS, RDS, and S3. Include a /deploy-serverless workflow and /audit-costs workflow. Add a skill for AWS Well-Architected Framework best practices."
```

The workflow will create:
- Plugin: `plugins/aws-cloud/`
- 4 agents: Lambda, ECS, RDS, S3 specialists
- 2 commands: `/deploy-serverless`, `/audit-costs`
- 1 skill: AWS Well-Architected best practices
- Complete documentation and integration

**Estimated Time**: ~35-50 minutes

### Example 3: Testing Plugin

```bash
/create-plugin "Create a testing plugin with specialists for unit testing, integration testing, and e2e testing. Include commands for /run-tests, /generate-coverage, and /mutation-test. Add skills for TDD methodology and test design patterns."
```

The workflow will create:
- Plugin: `plugins/testing-suite/`
- 3 agents: Unit, integration, e2e testing specialists
- 3 commands: Test automation workflows
- 2 skills: TDD and test patterns
- Comprehensive testing framework

**Estimated Time**: ~35-50 minutes

### Example 4: Simple Utility Plugin

```bash
/create-plugin "Create a simple markdown documentation plugin with a technical writer agent and a /generate-docs command"
```

The workflow will create a minimal plugin:
- Plugin: `plugins/markdown-docs/`
- 1 agent: Technical writer specialist
- 1 command: `/generate-docs`
- 0 skills
- Basic but complete documentation

**Estimated Time**: ~15-20 minutes

## Anti-Patterns

### DON'T ❌

- Don't skip requirements analysis - understand the full plugin scope first
- Don't create plugins with no components - plugins must have at least one agent, command, or skill
- Don't place plugin files in wrong locations - follow strict directory structure
- Don't forget to update root marketplace.json - plugins must be discoverable
- Don't skip version synchronization - all VERSION files must match their manifests
- Don't create incomplete documentation - README and CHANGELOG are mandatory
- Don't skip validation phase - catch issues before deployment
- Don't create duplicate plugins - check existing plugins first
- Don't mix plugin components in main .claude/ directory - plugins are isolated
- Don't forget component counts - marketplace.json features must be accurate

### DO ✅

- Research existing plugins before creating new ones
- Start with minimum viable plugin (1-3 components)
- Follow established directory structure exactly
- Use sub-workflows for component creation (/create-agent, /create-workflow, /create-skill)
- Keep plugin focused on single domain or capability area
- Document everything comprehensively
- Test component discovery thoroughly
- Update all version files consistently
- Validate before considering complete
- Plan for plugin distribution and installation

## Plugin Architecture Best Practices

### Plugin Scope

**Good Plugin Scope:**
- Single domain focus (databases, cloud, testing, etc.)
- 3-10 related components
- Clear value proposition
- Reusable across projects

**Poor Plugin Scope:**
- Too broad (everything in one plugin)
- Too narrow (single agent with no related components)
- Unrelated components bundled together
- No clear use case

### Component Organization

**Agents:**
- Group related specialists together
- Use clear category hierarchy
- Follow main .claude/agents/ patterns
- 1-10 agents per plugin typical

**Commands:**
- Workflows that automate complete processes
- Use plugin's agents when possible
- 1-5 commands per plugin typical
- Clear, actionable slash command names

**Skills:**
- Reusable expertise across plugin agents
- Auto-activate based on context
- 0-5 skills per plugin typical
- Follow wshobson/agents skill patterns

### Documentation Standards

**Plugin README must include:**
- Clear value proposition (what problem it solves)
- Installation instructions (copy-paste ready)
- Component reference (all agents, commands, skills)
- Usage examples (real-world scenarios)
- Troubleshooting (common issues)

**Plugin CHANGELOG must include:**
- Version history (semantic versioning)
- All component additions
- Breaking changes highlighted
- Migration guides if needed

## Plugin Distribution

### Local Distribution (Within orchestr8)

1. Plugin created in `plugins/[plugin-name]/`
2. Added to root `.claude-plugin/marketplace.json`
3. Auto-discovered by Claude Code from `plugins/` directory
4. Available immediately after creation

### External Distribution

1. **GitHub Release:**
   ```bash
   git tag -a v1.0.0 -m "Release [plugin-name] v1.0.0"
   git push origin v1.0.0
   gh release create v1.0.0 --title "v1.0.0" --notes "[Release notes]"
   ```

2. **User Installation:**
   ```bash
   # User copies plugin to their project
   cp -r plugins/[plugin-name]/ /path/to/project/plugins/

   # Claude Code auto-discovers plugin
   ```

3. **npm Package (future):**
   ```bash
   npm publish @orchestr8/[plugin-name]
   ```

## Troubleshooting

**Issue**: Components not discovered after plugin creation
**Solution**: Check directory structure matches pattern exactly, validate frontmatter YAML

**Issue**: Plugin version mismatch errors
**Solution**: Synchronize VERSION file and plugin.json version field

**Issue**: Root marketplace.json not updated
**Solution**: Re-run integration phase, ensure jq commands executed successfully

**Issue**: Components created in wrong location (main .claude/ instead of plugin)
**Solution**: Sub-workflows must be invoked with plugin directory context, not main directory

**Issue**: Validation fails on component count
**Solution**: Recount components with find commands, update marketplace.json features

## Notes

- Plugins are self-contained units with agents, commands, and skills
- Each plugin has own version (starts at 1.0.0)
- Root orchestr8 version increments (MINOR) when plugin added
- Plugin components are isolated from main .claude/ directory
- Plugins can be distributed independently
- Use sub-workflows (/create-agent, /create-workflow, /create-skill) for components
- Minimum viable plugin: 1-3 components with focused domain
- Validation ensures plugin quality before deployment
- Documentation is critical for plugin adoption

**This workflow enables rapid creation of domain-specific Claude Code plugin ecosystems!**

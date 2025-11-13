# Prompts and Resources Guide

This guide explains how to create, use, and extend prompts and resources in the Orchestr8 MCP server. It covers both static and dynamic resource patterns, argument substitution, and best practices.

## Table of Contents

- [Prompts](#prompts)
  - [Prompt Structure](#prompt-structure)
  - [Creating Prompts](#creating-prompts)
  - [Argument Substitution](#argument-substitution)
  - [Slash Commands](#slash-commands)
- [Static Resources](#static-resources)
  - [File Organization](#file-organization)
  - [Resource URIs](#resource-uris)
  - [Frontmatter Metadata](#frontmatter-metadata)
- [Dynamic Resources](#dynamic-resources)
  - [Template URIs](#template-uris)
  - [Query Parameters](#query-parameters)
  - [Fuzzy Matching](#fuzzy-matching)
  - [Token Budgets](#token-budgets)
- [Resource Resolution](#resource-resolution)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Prompts

Prompts are templates that become slash commands in Claude Code. They can load dynamic expertise and guide workflows.

### Prompt Structure

A prompt file consists of:

1. **Frontmatter** (YAML): Metadata and arguments
2. **Content** (Markdown): The prompt template with placeholders

```markdown
---
name: command-name
title: Human-Readable Title
description: What this prompt does
version: 1.0.0
arguments:
  - name: arg1
    required: true
    description: Description of arg1
  - name: arg2
    required: false
    description: Description of arg2
tags:
  - category1
  - category2
estimatedTokens: 500
---

# Prompt Content

Your task: {{arg1}}

Optional parameter: {{arg2}}

Load expertise:
orchestr8://match?query={{arg1}}&maxTokens=2000
```

### Creating Prompts

**Step 1**: Choose a category directory:
- `./prompts/workflows/` - Multi-step procedures
- `./prompts/agents/` - Agent role definitions
- `./prompts/skills/` - Specific skill invocations

**Step 2**: Create a markdown file:

```bash
touch ./prompts/workflows/build-api.md
```

**Step 3**: Add frontmatter and content:

```markdown
---
name: build-api
title: Build API Workflow
description: Guided workflow for building a REST API
version: 1.0.0
arguments:
  - name: tech_stack
    required: true
    description: Technology stack (e.g., "Node.js + Express", "Python + FastAPI")
  - name: features
    required: false
    description: Comma-separated features to implement
tags:
  - api
  - workflow
  - backend
estimatedTokens: 800
---

# Build API Workflow

You will build a REST API using: {{tech_stack}}

{{#if features}}
Required features: {{features}}
{{/if}}

## Step 1: Load Relevant Expertise

First, load expertise about the chosen tech stack:
orchestr8://match?query={{tech_stack}}+api+best+practices&maxTokens=2000

## Step 2: Design the API

...
```

**Step 4**: Test the prompt:

```bash
# Rebuild the server
npm run build

# Test via MCP client
# The prompt will appear as /orchestr8:build-api
```

### Argument Substitution

Arguments are substituted using `{{argument_name}}` syntax.

#### Required Arguments

```yaml
arguments:
  - name: task
    required: true
    description: The task to accomplish
```

```markdown
Your task: {{task}}
```

If the argument is missing, MCP returns a validation error.

#### Optional Arguments

```yaml
arguments:
  - name: max_tokens
    required: false
    description: Maximum token budget
```

```markdown
Token budget: {{max_tokens}}
```

If the argument is not provided, the placeholder remains as-is or can be conditionally rendered.

#### Multiple Arguments

```markdown
---
arguments:
  - name: language
    required: true
  - name: framework
    required: true
  - name: database
    required: false
---

Build a {{language}} application using {{framework}}.

{{#if database}}
Connect to {{database}} database.
{{/if}}
```

#### Special Characters

Arguments are URL-encoded when used in URIs:

```markdown
# In prompt content:
orchestr8://match?query={{task}}&maxTokens=2000

# User provides: task="build REST API"
# Becomes: orchestr8://match?query=build+REST+API&maxTokens=2000
```

### Slash Commands

Prompts are automatically converted to slash commands in Claude Code:

```
Prompt File:     ./prompts/workflows/now.md
Prompt Name:     now
Slash Command:   /orchestr8:now
```

**Usage in Claude Code**:

```
/orchestr8:now task="Build a TypeScript API"
```

**Claude Code UI**:
- Type `/` to see all slash commands
- Start typing `/orchestr8` to filter
- Select command → Enter arguments → Execute

## Static Resources

Static resources are direct file mappings. They provide fixed content like agent definitions, skill descriptions, and code examples.

### File Organization

Resources are organized by category:

```
resources/
├── agents/
│   └── 
│       ├── typescript-core.md
│       ├── python-core.md
│       └── database-architect-sql.md
├── skills/
│   └── 
│       ├── api-design-rest.md
│       ├── error-handling-validation.md
│       └── testing-unit.md
├── examples/
│   └── 
│       ├── express-jwt-auth.md
│       ├── fastapi-async-crud.md
│       └── typescript-rest-api-complete.md
├── patterns/
│   └── 
│       ├── architecture-microservices.md
│       ├── event-driven-cqrs.md
│       └── autonomous-organization.md
├── guides/
│   └── 
│       ├── ci-cd-github-actions.md
│       ├── aws-eks-cluster.md
│       └── prometheus-monitoring-setup.md
└── workflows/
    └── 
        ├── workflow-add-feature.md
        ├── workflow-fix-bug.md
        └── workflow-research-tech.md
```

### Resource URIs

URIs follow this pattern:

```
orchestr8://<category>/<path>/<filename>
```

**Examples**:

```
File:  resources/agents/typescript-core.md
URI:   orchestr8://agents/typescript-core

File:  resources/skills/api-design-rest.md
URI:   orchestr8://skills/api-design-rest

File:  resources/examples/express-jwt-auth.md
URI:   orchestr8://examples/express-jwt-auth
```

**Note**: File extensions (`.md`, `.json`, `.yaml`) are omitted from URIs.

### Frontmatter Metadata

Resources should include frontmatter for fuzzy matching:

```markdown
---
title: TypeScript Core Expert
description: Core TypeScript language expertise and best practices
tags:
  - typescript
  - javascript
  - types
  - generics
capabilities:
  - TypeScript type system design
  - Generic programming patterns
  - Async/await patterns
  - Module system configuration
useWhen:
  - Building TypeScript applications
  - Designing type-safe APIs
  - Implementing complex type constraints
estimatedTokens: 1200
---

# TypeScript Core Expert

## Core Capabilities

...
```

**Metadata Fields**:

- **tags**: Keywords for fuzzy matching (lowercase)
- **capabilities**: What this resource can help with
- **useWhen**: Scenarios where this resource applies
- **estimatedTokens**: Rough token count for budgeting

These fields enable dynamic discovery through fuzzy matching.

## Dynamic Resources

Dynamic resources use fuzzy matching to assemble content based on queries. This is the core of Orchestr8's just-in-time expertise loading.

### Template URIs

Dynamic resources use template URIs with wildcards:

```
Template:  orchestr8://agents/match{+rest}
Matches:   orchestr8://agents/match?query=...
           orchestr8://agents/match?query=...&maxTokens=2000

Template:  orchestr8://match{+rest}
Matches:   orchestr8://match?query=...
           orchestr8://match?query=...&categories=agent,skill
```

**Wildcard `{+rest}`**:
- Captures everything after the prefix
- Includes query parameters
- Enables flexible parameter passing

### Query Parameters

Dynamic URIs support these parameters:

#### `query` (required)

The search query for fuzzy matching.

```
orchestr8://agents/match?query=typescript+api+design
orchestr8://match?query=error+handling+validation
```

**Query Encoding**:
- Spaces: `+` or `%20`
- Special chars: URL-encoded

#### `maxTokens` (optional)

Maximum token budget for assembled content.

```
orchestr8://agents/match?query=typescript&maxTokens=2000
```

**Default**: No limit (assembles all matches)

**Behavior**:
- Fuzzy matcher selects fragments until budget is exhausted
- Higher-scoring fragments are prioritized
- Last fragment may be truncated to fit budget

#### `tags` (optional)

Comma-separated required tags for filtering.

```
orchestr8://agents/match?query=api&tags=typescript,rest
```

**Behavior**:
- Only fragments with ALL specified tags are included
- Case-insensitive matching
- Use for precise filtering

#### `categories` (optional)

Comma-separated categories to search.

```
orchestr8://match?query=testing&categories=agent,skill
```

**Valid Categories**:
- `agent` → `./resources/agents/`
- `skill` → `./resources/skills/`
- `example` → `./resources/examples/`
- `pattern` → `./resources/patterns/`
- `guide` → `./resources/guides/`
- `workflow` → `./resources/workflows/`

**Behavior**:
- Only specified categories are searched
- Useful for cross-category queries
- Default: Search category from URI path (or all if using global template)

#### `mode` (optional)

Matching mode: `index` (default), `minimal`, `catalog`, or `full`.

```
orchestr8://agents/match?query=typescript&mode=index
```

**Modes**:
- `index` (default): Returns ultra-compact useWhen scenarios (~200-500 tokens, fastest)
- `minimal`: Returns compact JSON with URIs and scores (~300-500 tokens)
- `catalog`: Returns full metadata with capabilities (~1,500-2,000 tokens)
- `full`: Returns complete resource content (~5,000-10,000+ tokens)

#### `maxResults` (optional)

Maximum number of fragments to return (index/minimal/catalog modes).

```
orchestr8://agents/match?query=api&mode=index&maxResults=5
orchestr8://agents/match?query=api&mode=catalog&maxResults=10
```

**Default**: 5 for index/minimal modes, 10 for catalog mode

#### `minScore` (optional)

Minimum relevance score threshold (0-100).

```
orchestr8://agents/match?query=api&minScore=50
```

**Default**: No minimum (includes all matches)

**Behavior**:
- Fragments with score < threshold are excluded
- Use to filter low-relevance results

### Fuzzy Matching

The fuzzy matching engine scores fragments based on:

#### 1. Keyword Matching

Query keywords are matched against:
- Fragment ID (file path)
- Tags
- Capabilities
- Use-when scenarios

**Scoring**:
- Exact match: +10 points
- Partial match: +5 points
- Case-insensitive

**Example**:

```
Query: "typescript api design"

Fragment A:
  tags: [typescript, api, rest]
  capabilities: ["API design", "REST endpoints"]
  Score: 10 (typescript) + 10 (api) + 5 (design) = 25

Fragment B:
  tags: [typescript, types]
  capabilities: ["Type system"]
  Score: 10 (typescript) = 10

Fragment A wins (higher score)
```

#### 2. Category Matching

Fragments in the queried category receive a bonus:

```
orchestr8://agents/match?query=api
  → Agents receive +5 bonus
  → Skills receive 0 bonus
```

#### 3. Tag Filtering

Required tags must ALL be present:

```
orchestr8://agents/match?query=api&tags=typescript,async
  → Fragment MUST have both "typescript" AND "async" tags
  → Fragments without both are excluded
```

#### 4. Content Assembly

Once fragments are scored and filtered:

1. **Sort by score** (descending)
2. **Apply token budget** (if specified)
3. **Assemble content**:
   ```markdown
   # Assembled Expertise

   ## Fragment 1: typescript-core (Score: 95)
   Tags: typescript, types, generics

   [Full content of fragment...]

   ---

   ## Fragment 2: api-design-rest (Score: 85)
   Tags: api, rest, design

   [Full content of fragment...]
   ```

### Token Budgets

Token budgets enable progressive loading strategies.

#### Phase-Based Loading

```markdown
## Phase 1: Overview (500 tokens)
orchestr8://agents/match?query={{task}}&maxTokens=500&mode=catalog

## Phase 2: Core Expertise (2000 tokens)
orchestr8://agents/match?query={{task}}&maxTokens=2000

## Phase 3: Deep Dive (5000 tokens)
orchestr8://agents/match?query={{task}}&maxTokens=5000
```

#### Adaptive Budgets

Adjust based on task complexity:

```markdown
Simple task: maxTokens=1000
Medium task: maxTokens=3000
Complex task: maxTokens=7000
```

#### Budget Estimation

Each resource has `estimatedTokens` in frontmatter:

```yaml
estimatedTokens: 1200
```

Fuzzy matcher uses this to stay within budget:

```
Budget: 3000 tokens
Fragment A: 1200 tokens (fits)
Fragment B: 1500 tokens (fits, total 2700)
Fragment C: 800 tokens (would exceed, skip)
```

## Resource Resolution

The complete resolution flow:

```
1. Parse URI
   ├─ Static? (orchestr8://agents/typescript-core)
   │  └─> Load file directly
   └─ Dynamic? (orchestr8://agents/match?query=...)
      └─> Continue to step 2

2. Parse Query Parameters
   ├─ query: "typescript api"
   ├─ maxTokens: 2000
   ├─ tags: ["rest", "async"]
   └─ categories: ["agent", "skill"]

3. Load Resource Index (if not cached)
   ├─ Scan ./resources/**/*.md
   ├─ Parse frontmatter
   └─ Build in-memory index

4. Fuzzy Match
   ├─ Score each fragment
   ├─ Filter by tags
   ├─ Filter by categories
   └─ Sort by score

5. Assemble Content
   ├─ Select top-scoring fragments
   ├─ Respect token budget
   └─ Format as markdown

6. Cache Result
   └─ Store in LRU cache (4 hour TTL)

7. Return Content
   └─ MCP response with assembled text
```

## Examples

### Example 1: Simple Static Resource

**File**: `resources/skills/testing-unit.md`

```markdown
---
title: Unit Testing Best Practices
description: Comprehensive guide to unit testing
tags:
  - testing
  - unit
  - jest
  - mocha
capabilities:
  - Writing effective unit tests
  - Test organization and structure
  - Mocking and stubbing
estimatedTokens: 800
---

# Unit Testing Best Practices

## Core Principles

...
```

**Usage**:

```typescript
ReadMcpResourceTool({
  server: "plugin:orchestr8:orchestr8-resources",
  uri: "orchestr8://skills/testing-unit"
})
```

### Example 2: Dynamic Resource with Budget

**Query**: Find TypeScript API design expertise within 2000 tokens

```typescript
ReadMcpResourceTool({
  server: "plugin:orchestr8:orchestr8-resources",
  uri: "orchestr8://agents/match?query=typescript+api+design&maxTokens=2000"
})
```

**Result**: Assembles top-scoring agent fragments about TypeScript and API design, up to 2000 tokens.

### Example 3: Cross-Category Query

**Query**: Find error handling expertise across agents and skills

```typescript
ReadMcpResourceTool({
  server: "plugin:orchestr8:orchestr8-resources",
  uri: "orchestr8://match?query=error+handling&categories=agent,skill"
})
```

**Result**: Searches both agents and skills directories, returns combined matches.

### Example 4: Filtered by Tags

**Query**: Find async TypeScript patterns

```typescript
ReadMcpResourceTool({
  server: "plugin:orchestr8:orchestr8-resources",
  uri: "orchestr8://patterns/match?query=async&tags=typescript,concurrency"
})
```

**Result**: Only patterns tagged with BOTH "typescript" AND "concurrency".

### Example 5: Catalog Mode

**Query**: List available API design resources

```typescript
ReadMcpResourceTool({
  server: "plugin:orchestr8:orchestr8-resources",
  uri: "orchestr8://agents/match?query=api+design&mode=catalog&maxResults=5"
})
```

**Result**: Returns summaries of top 5 matching fragments (not full content).

### Example 6: Prompt with Dynamic Loading

**File**: `prompts/workflows/learn-tech.md`

```markdown
---
name: learn-tech
title: Learn Technology
description: Guided learning workflow
arguments:
  - name: technology
    required: true
    description: Technology to learn
---

# Learn {{technology}}

## Step 1: Load Overview

orchestr8://match?query={{technology}}+overview&maxTokens=1000&mode=catalog

## Step 2: Load Core Concepts

orchestr8://match?query={{technology}}+core+concepts&maxTokens=3000

## Step 3: Load Examples

orchestr8://examples/match?query={{technology}}&maxTokens=2000

## Step 4: Practice

...
```

**Usage**: `/orchestr8:learn-tech technology="FastAPI"`

## Best Practices

### For Prompt Authors

1. **Clear Arguments**: Document all arguments with descriptions
2. **Required vs Optional**: Mark appropriately
3. **Dynamic Loading**: Use progressive token budgets
4. **Error Handling**: Provide fallback content if dynamic queries fail
5. **Testing**: Test prompts with various argument combinations

### For Resource Authors

1. **Rich Frontmatter**: Include comprehensive tags, capabilities, useWhen
2. **Token Estimates**: Provide realistic estimatedTokens values
3. **Self-Contained**: Each resource should be independently useful
4. **Cross-References**: Link to related resources
5. **Examples**: Include code examples where applicable

### For Query Authors

1. **Specific Queries**: Use precise keywords for better matches
2. **Token Budgets**: Start small, increase if needed
3. **Tag Filtering**: Use tags for precision
4. **Mode Selection**: Use catalog mode for exploration
5. **Category Filtering**: Narrow search scope with categories parameter

### General Guidelines

1. **Naming Conventions**:
   - Prompts: kebab-case (e.g., `build-api.md`)
   - Resources: kebab-case (e.g., `typescript-core.md`)
   - URIs: kebab-case (e.g., `orchestr8://agents/typescript-core`)

2. **File Organization**:
   - Use `` subdirectories for composable resources
   - Group related resources together
   - Keep files focused and single-purpose

3. **Versioning**:
   - Include `version` in frontmatter
   - Update version on breaking changes
   - Document changes in git commit messages

4. **Testing**:
   - Test static resources: Direct URI access
   - Test dynamic resources: Various query combinations
   - Test prompts: Different argument values

5. **Documentation**:
   - Document complex prompts inline
   - Explain expected behavior
   - Provide usage examples

## Troubleshooting

### Prompt Not Appearing as Slash Command

**Issue**: Created a prompt but it doesn't show up in Claude Code.

**Solutions**:
1. Rebuild server: `npm run build`
2. Restart Claude Code
3. Check frontmatter syntax (valid YAML)
4. Verify file is in `./prompts/**/*.md`

### Resource Not Found

**Issue**: Static resource URI returns error.

**Solutions**:
1. Check URI matches file path exactly
2. Verify file extension is `.md`, `.json`, or `.yaml`
3. Check file exists: `ls resources/path/to/file.md`
4. Review URI format: `orchestr8://category/path/name` (no extension)

### Fuzzy Match Returns No Results

**Issue**: Dynamic query returns empty or irrelevant results.

**Solutions**:
1. Broaden query keywords
2. Remove or reduce tag filters
3. Check resource index loaded: Look for "Resource index loaded" in logs
4. Verify resources have tags in frontmatter
5. Try global template: `orchestr8://match?query=...`

### Token Budget Exceeded

**Issue**: Assembled content is larger than expected.

**Solutions**:
1. Reduce `maxTokens` parameter
2. Add tag filters to narrow results
3. Check `estimatedTokens` in resource frontmatter
4. Use catalog mode for summaries

### Argument Substitution Not Working

**Issue**: `{{argument}}` placeholders not replaced.

**Solutions**:
1. Verify argument name matches exactly (case-sensitive)
2. Check argument passed in request
3. Ensure proper double-brace syntax: `{{arg}}` not `{arg}`
4. Review logs for substitution errors

## Next Steps

- Read [Protocol Implementation](./protocol-implementation.md) for technical details
- Read [Transport Layer](./transport.md) for stdio protocol
- Review existing prompts in `./prompts/` for examples
- Review existing resources in `./resources/` for patterns
- Run integration tests: `npm test`

---

**Related Docs**:
- [MCP Overview](./README.md)
- [Protocol Implementation](./protocol-implementation.md)
- [Transport Layer](./transport.md)

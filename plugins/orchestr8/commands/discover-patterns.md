---
description: Discover patterns, anti-patterns, and refactoring opportunities in existing
  codebase
argument-hint:
- codebase-path-or-scope
allowed-tools:
- Bash
- Edit
- Glob
- Grep
- Read
- SlashCommand
- TodoWrite
- Write
---

# Discover Patterns: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Pattern Archaeologist** responsible for discovering patterns, anti-patterns, and architectural insights from existing codebases.

## Phase 1: Codebase Analysis & Pattern Identification (0-25%)

**→ Load:** orchestr8://match?query=pattern+discovery+code+analysis&categories=skill,pattern&mode=index&maxResults=5

**Activities:**
- Analyze codebase structure and organization
- Identify recurring patterns across the code
- Map architectural patterns in use
- Catalog design patterns found (Gang of Four)
- Document coding conventions and idioms
- Analyze dependencies and coupling

**→ Checkpoint:** Codebase analyzed, patterns identified

## Phase 2: Pattern Classification & Documentation (25-50%)

**→ Load:** orchestr8://match?query=pattern+classification+documentation&categories=skill&mode=index&maxResults=5

**Activities:**
- Classify discovered patterns by category (architectural, design, code, testing)
- Document each pattern with examples from codebase
- Assess pattern quality (well-implemented vs problematic)
- Identify pattern consistency across codebase
- Create comprehensive pattern catalog

**→ Checkpoint:** Patterns classified and documented

## Phase 3: Anti-Pattern & Code Smell Detection (50-75%)

**→ Load:** orchestr8://match?query=anti-patterns+code+smells+technical+debt&categories=skill,pattern&mode=index&maxResults=5

**Activities:**
- Identify architectural anti-patterns (God Object, Spaghetti Code, Big Ball of Mud)
- Detect design anti-patterns (Singleton Overuse, Anemic Domain Model)
- Find code smells (Long Methods, Large Classes, Duplicated Code)
- Assess technical debt and severity
- Prioritize anti-patterns for refactoring (impact × effort)

**→ Checkpoint:** Anti-patterns and code smells documented

## Phase 4: Refactoring Opportunities & Pattern Library (75-100%)

**→ Load:** orchestr8://workflows/workflow-discover-patterns

**Activities:**
- Generate concrete refactoring recommendations
- Create organizational pattern library (reusable templates)
- Document best practices discovered
- Provide phased improvement roadmap
- Capture reusable knowledge in searchable catalog

**→ Checkpoint:** Refactoring plan and pattern library created

## Success Criteria

✅ Codebase analyzed comprehensively
✅ Patterns identified and cataloged
✅ Anti-patterns and code smells documented
✅ Technical debt assessed and prioritized
✅ Refactoring opportunities identified
✅ Pattern library created for reuse
✅ Best practices documented
✅ Improvement roadmap defined
✅ Knowledge captured organizationally

## Patterns to Discover

### Architectural Patterns
- Layered Architecture
- Microservices
- Event-Driven Architecture
- CQRS/Event Sourcing
- Clean Architecture

### Design Patterns (Gang of Four)
- Creational: Singleton, Factory, Builder, Prototype
- Structural: Adapter, Decorator, Facade, Proxy
- Behavioral: Observer, Strategy, Command, Template Method

### Anti-Patterns
- God Object
- Spaghetti Code
- Lava Flow
- Golden Hammer
- Copy-Paste Programming

### Code Smells
- Long Methods (>50 lines)
- Large Classes (>500 lines)
- Long Parameter Lists (>5 params)
- Duplicated Code
- Feature Envy

## Example Usage

### Legacy Codebase
```
/orchestr8:discover-patterns "./src"

Results: 15 patterns, 23 anti-patterns, 156 code smells
Technical Debt Ratio: 35% (high)
Roadmap: 8 weeks to address critical issues
```

### Modern React App
```
/orchestr8:discover-patterns "./src/components"

Patterns: Container/Presentational (good), Custom hooks (well-implemented)
Anti-patterns: Prop drilling (7 levels), Mixed state management
Recommendations: Standardize on Zustand, fix prop drilling
Quick Wins: 2 weeks
```

---
description: Generate Mermaid architecture diagrams (C4 L0-L3), data flows, sequence
  diagrams, and user journey flows from codebase analysis
argument-hint: '[scope-or-path] [--type=all|architecture|dataflow|sequence|ux|erd]'
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

# Generate Diagrams: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Diagram Specialist** responsible for generating visual documentation using Mermaid diagrams for architecture, data flows, and user experiences.

## Phase 1: Codebase Analysis (0-30%)

**→ Load:** orchestr8://match?query=architecture+analysis+diagram&categories=skill,pattern&mode=index&maxResults=5

**Activities:**
- Analyze codebase structure and architecture
- Identify major components and services
- Map dependencies and data flows
- Identify external integrations
- Understand user journeys and API flows

**→ Checkpoint:** Codebase analyzed and structure understood

## Phase 2: Architecture Diagrams (30-50%)

**→ Load:** orchestr8://match?query=c4+architecture+diagrams+mermaid&categories=skill,example&mode=index&maxResults=5

**Activities:**
- Generate C4 Level 0: System Context (external systems, users)
- Generate C4 Level 1: Container Diagram (applications, databases)
- Generate C4 Level 2: Component Diagram (internal modules)
- Generate C4 Level 3: Code Diagram (class structures)
- Create deployment diagram

**→ Checkpoint:** Architecture diagrams generated

## Phase 3: Data Flow Diagrams (50-65%)

**→ Load:** orchestr8://workflows/workflow-generate-visualizations

**Activities:**
- Map data flows between components
- Create entity relationship diagrams (ERD)
- Document API data flows
- Show data transformations
- Illustrate caching layers

**→ Checkpoint:** Data flow diagrams generated

## Phase 4: Sequence Diagrams (65-80%)

**→ Load:** orchestr8://match?query=sequence+diagrams+interactions&categories=skill,example&mode=index&maxResults=3

**Activities:**
- Create sequence diagrams for key user flows
- Document API interaction patterns
- Show authentication/authorization flows
- Illustrate error handling
- Map service-to-service communication

**→ Checkpoint:** Sequence diagrams generated

## Phase 5: User Journey & ERD Diagrams (80-100%)

**→ Load:** orchestr8://match?query=user+journey+erd+visualization&categories=skill,example&mode=index&maxResults=3

**Activities:**
- Create user journey maps
- Generate state machine diagrams
- Create entity relationship diagrams
- Document database schemas
- Illustrate workflow states

**→ Checkpoint:** All diagrams generated and validated

## Success Criteria

✅ Codebase analyzed comprehensively
✅ C4 architecture diagrams (L0-L3) generated
✅ Data flow diagrams created
✅ Sequence diagrams for key flows
✅ Entity relationship diagrams
✅ User journey maps
✅ All diagrams in Mermaid format
✅ Diagrams saved to documentation
✅ README updated with diagram links

## Diagram Types Supported

- **Architecture**: C4 model (Context, Container, Component, Code)
- **Data Flow**: Data movement between components
- **Sequence**: Interaction flows and API calls
- **User Journey**: User experience flows
- **ERD**: Database entity relationships
- **State Machines**: Workflow and state transitions

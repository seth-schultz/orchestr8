---
id: mermaid-diagram-generation
category: skill
tags: [mermaid, diagrams, visualization, architecture, c4-model, flowcharts, sequence-diagrams, documentation]
capabilities:
  - Generate C4 model architecture diagrams (Levels 0-3)
  - Create data flow and process flow diagrams
  - Produce sequence diagrams for API and system interactions
  - Design state machines and workflow diagrams
  - Build entity-relationship diagrams for data models
  - Create deployment and infrastructure topology diagrams
useWhen:
  - Documenting system architecture and design decisions
  - Creating technical documentation for codebases
  - Visualizing data flows and business processes
  - Explaining API interactions and async workflows
  - Illustrating database schemas and relationships
  - Adding professional diagrams to Medium technical articles
  - Generating visual documentation for code review
estimatedTokens: 380
---

# Mermaid Diagram Generation

Master the art of creating professional, clear Mermaid diagrams for technical documentation, architecture visualization, and Medium articles.

## Overview

Mermaid is a JavaScript-based diagramming tool that uses markdown-like syntax to generate diagrams. It renders natively in:
- GitHub markdown
- GitLab
- VS Code (with extensions)
- Medium (with code blocks)
- Confluence
- Notion

**Benefits:**
- Version control friendly (text-based)
- Easy to maintain and update
- No external tools required
- Renders consistently across platforms
- Fast to create and iterate

**→ See comprehensive examples:** orchestr8://examples/diagrams/mermaid-c4-architecture, orchestr8://examples/diagrams/mermaid-sequence-flow

## C4 Model Architecture Diagrams

The C4 model provides a hierarchical approach to documenting software architecture.

### Level 0: System Context

**Purpose:** Show the system and its relationships with users and external systems

**When to use:**
- Initial architecture documentation
- Explaining system boundaries
- Stakeholder communication

**Basic template:**
```mermaid
C4Context
    title System Context for [Your System]

    Person(user, "User", "Primary user description")
    System(system, "[Your System]", "Core system being documented")
    System_Ext(external, "External API", "Third-party service")

    Rel(user, system, "Uses", "HTTPS")
    Rel(system, external, "Calls", "REST/JSON")
```

### Level 1: Container Diagram

**Purpose:** Show major technology containers (applications, databases, file systems)

**When to use:**
- Showing technical architecture
- Deployment planning
- Technology stack explanation

### Level 2: Component Diagram

**Purpose:** Show components within a container and their relationships

**When to use:**
- Detailed technical documentation
- Code review preparation
- Onboarding new developers

### Level 3: Code Diagram

**Purpose:** Show classes, interfaces, and their relationships

**When to use:**
- Detailed implementation documentation
- Design pattern explanation
- Code refactoring planning

**→ See complete C4 examples:** orchestr8://examples/diagrams/mermaid-c4-architecture

## Sequence Diagrams

**Purpose:** Show interactions between components over time

**Common use cases:**
- API authentication flows
- Async job processing
- Distributed transactions (Saga pattern)
- Request/response cycles

**Basic template:**
```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Database

    Client->>API: Request
    activate API
    API->>Database: Query
    Database-->>API: Result
    API-->>Client: Response
    deactivate API
```

**→ See detailed sequence examples:** orchestr8://examples/diagrams/mermaid-sequence-flow

## Flowcharts and Data Flows

**Purpose:** Show how data moves through a system or process logic

**Common patterns:**
- Request processing with caching
- Decision trees
- Processing pipelines with swimlanes
- Error handling flows

**Basic template:**
```mermaid
flowchart LR
    Start[Input] --> Process{Decision?}
    Process -->|Yes| Action1[Do A]
    Process -->|No| Action2[Do B]
    Action1 --> End[Output]
    Action2 --> End
```

**→ See complex flow examples:** orchestr8://examples/diagrams/mermaid-sequence-flow

## State Machines

**Purpose:** Show states and transitions in a system or workflow

**Common use cases:**
- Order lifecycle
- File upload processing
- User session states
- Circuit breaker patterns

**Basic template:**
```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Start
    Processing --> Success: Complete
    Processing --> Error: Fail
    Error --> Idle: Retry
    Success --> [*]
```

**→ See state machine examples:** orchestr8://examples/diagrams/mermaid-sequence-flow

## Entity Relationship Diagrams

**Purpose:** Show database schema and relationships

**When to use:**
- Database design documentation
- Schema migration planning
- Data model explanation

**Basic template:**
```mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER {
        int id PK
        string email UK
        string name
    }
    ORDER {
        int id PK
        int user_id FK
        decimal total
    }
```

**→ See ER diagram examples:** orchestr8://examples/diagrams/mermaid-sequence-flow

## Best Practices

### 1. Keep It Simple
- Start with high-level, add detail only when necessary
- Limit diagrams to 7-12 main elements
- Use subgraphs to organize complexity
- Break complex diagrams into multiple simpler ones

### 2. Use Consistent Colors

```
Blue (#1168bd)       - Internal systems
Gray (#999999)       - External systems
Green (#2d7a3e)      - Databases
Red (#d9534f)        - Caches
Orange (#f0ad4e)     - Queues/async
Light Blue (#5bc0de) - User interfaces
```

### 3. Clear Labels
- No abbreviations unless universally understood
- Use descriptive names
- Add technology stack in parentheses
- Include brief descriptions

### 4. Direction Matters
- Top-to-bottom (TB) or Left-to-right (LR) for flows
- Consistent direction within a diagram
- Use arrows to show data/control flow direction

### 5. Add Context

```markdown
# Diagram Title

**Purpose**: What this diagram shows
**Context**: When to reference this diagram

[mermaid diagram code]

**Key Points:**
- Important aspect 1
- Important aspect 2

**Related Diagrams:**
- [Link to related diagram]
```

### 6. Test Rendering
- Preview in Mermaid Live Editor: https://mermaid.live
- Verify in target platform (GitHub, VS Code, Medium)
- Check on mobile if target audience uses mobile

### 7. Version Control
- Keep diagrams in markdown files
- Track changes in Git
- Add comments for complex logic
- Document diagram purpose in commit messages

## Common Diagram Patterns

### API Request Flow
Simple sequence showing client → API → service → database flow

### Caching Strategy
Flowchart with cache hit/miss logic and database fallback

### Microservices Architecture
C4 container diagram showing services, databases, and message broker

### Deployment Topology
Flowchart showing load balancers, app servers, databases across availability zones

**→ See all common patterns:** orchestr8://examples/diagrams/mermaid-c4-architecture, orchestr8://examples/diagrams/mermaid-sequence-flow

## Troubleshooting

### Diagram Not Rendering
- Check syntax at https://mermaid.live
- Verify proper indentation
- Ensure closing tags/brackets
- Check for special characters in labels (escape if needed)

### Diagram Too Complex
- Break into multiple diagrams
- Use subgraphs to organize
- Increase level of abstraction
- Focus on one aspect at a time

### Labels Overlapping
- Adjust direction (TB vs LR)
- Shorten label text
- Use line breaks in labels (`<br/>`)
- Increase spacing with empty nodes

## Resources

- **Mermaid Live Editor**: https://mermaid.live (test diagrams)
- **Official Docs**: https://mermaid.js.org
- **C4 Model**: https://c4model.com
- **VS Code Extension**: Mermaid Preview
- **GitHub**: Native rendering support

---

**Master these patterns and you'll create professional diagrams that clarify complex systems!**

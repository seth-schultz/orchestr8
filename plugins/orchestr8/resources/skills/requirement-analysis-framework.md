---
id: requirement-analysis-framework
category: skill
tags: [requirements, analysis, planning, user-needs, scope-definition, meta]
capabilities:
  - Core objective identification from vague requests
  - Technology constraint analysis and extraction
  - Quality requirement discovery (NFRs)
  - MVP vs full-featured scope definition
useWhen:
  - Analyzing ambiguous requirements extracting functional specifications, technical constraints, and success criteria
  - Breaking down complex feature requests into actionable user stories with acceptance criteria and priority levels
  - Creating requirements clarification framework identifying missing information and stakeholder assumptions
  - Designing requirement validation process ensuring testability, feasibility, and alignment with business goals
  - Implementing structured requirement gathering with domain-driven design principles and bounded context identification
estimatedTokens: 800
---

# Requirement Analysis Framework

Systematic approach to extracting clear, actionable requirements from user requests, especially vague or high-level ones.

## Core Objective Identification

**Ask:** What is the user ultimately trying to achieve?

```markdown
User says: "Build me a web app"
Core objective: Create web application for ${purpose}

User says: "Add authentication"
Core objective: Secure application with ${auth-method} authentication

User says: "Make it faster"
Core objective: Improve ${specific-metric} performance from ${current} to ${target}
```

**Extract:**
- Primary goal (what success looks like)
- User's context (why they need this)
- Success criteria (how to measure completion)

## Technology Constraint Analysis

**Identify mentioned or implied constraints:**
```markdown
Explicit constraints:
"Use TypeScript" → Language: TypeScript
"Deploy to AWS" → Platform: AWS
"Works with PostgreSQL" → Database: PostgreSQL

Implicit constraints:
Existing codebase → Match current stack
Team familiarity → Prefer known technologies
Performance requirements → Choose fast runtime
Budget limits → Prefer free/open-source tools
```

**Technology stack extraction:**
```markdown
From request, identify:
- Language (TypeScript, Python, Rust, Go...)
- Framework (Express, FastAPI, Actix, Gin...)
- Database (PostgreSQL, MongoDB, Redis...)
- Platform (AWS, GCP, Azure, on-premise...)
- Tools (Docker, Kubernetes, GitHub Actions...)
```

## Quality Requirement Discovery

**Non-functional requirements:**
```markdown
Performance:
- Response time targets (< 100ms, < 1s)
- Throughput needs (requests/second)
- Concurrent users

Security:
- Authentication method (JWT, OAuth, session)
- Authorization model (RBAC, ABAC)
- Data protection (encryption, PII handling)
- Compliance (GDPR, HIPAA, SOC2)

Scalability:
- Expected load (users, data volume)
- Growth projections
- Horizontal vs vertical scaling

Reliability:
- Uptime requirements (99%, 99.9%, 99.99%)
- Disaster recovery needs
- Backup strategies

Maintainability:
- Testing requirements (coverage %)
- Documentation level
- Code style standards
```

## Scope Definition

**MVP vs Full-Featured:**
```markdown
When scope unclear, identify:

MVP (Minimum Viable Product):
□ Core functionality only
□ Basic error handling
□ Minimal UI/UX
□ Essential tests
□ Basic documentation

Full-Featured:
□ All requested features
□ Comprehensive error handling
□ Polished UI/UX
□ >80% test coverage
□ Complete documentation
□ Performance optimization
□ Security hardening

Ask user if unsure: Use AskUserQuestion tool
```

## Requirement Document Template

**After analysis, create:**
```markdown
## Project Requirements

### Core Objective
${clear-statement-of-what-needs-to-be-built}

### Technology Stack
- Language: ${language} (${version})
- Framework: ${framework} (${version})
- Database: ${database}
- Platform: ${deployment-platform}
- Tools: ${ci-cd}, ${containerization}, etc.

### Functional Requirements
1. ${requirement-1}
2. ${requirement-2}
3. ${requirement-3}

### Quality Requirements

**Performance:**
- Metric 1: ${target}
- Metric 2: ${target}

**Security:**
- Authentication: ${method}
- Authorization: ${model}
- Data protection: ${approach}

**Testing:**
- Coverage target: ${percentage}
- Test types: ${unit, integration, e2e}

**Documentation:**
- Level: ${basic, comprehensive}
- Format: ${markdown, api-docs, etc}

### Success Criteria
✅ Criterion 1 (measurable)
✅ Criterion 2 (measurable)
✅ Criterion 3 (measurable)

### Scope Boundaries

**In Scope:**
- Feature/aspect 1
- Feature/aspect 2

**Out of Scope:**
- Feature/aspect 3
- Feature/aspect 4

### Recommended Approach
${architectural-pattern} with ${technology-stack} because:
- Reason 1
- Reason 2
- Reason 3

### Execution Strategy
Use ${workflow-pattern} with these phases:
1. Phase 1: ${description} (0-X%)
2. Phase 2: ${description} (X-Y%)
3. Phase 3: ${description} (Y-100%)

### Resource Requirements
- Agents: orchestr8://agents/match?query=${requirements}
- Skills: orchestr8://skills/match?query=${techniques}
- Patterns: orchestr8://patterns/match?query=${architecture}
```

## Best Practices

✅ **Extract core objective first** - What is user trying to achieve?
✅ **Identify implicit requirements** - Security, testing, docs always needed
✅ **Document findings** - Create clear requirement document
✅ **Define success criteria** - Measurable outcomes
✅ **Set scope boundaries** - In/out of scope clarity
✅ **Recommend approach** - Don't just list options, suggest best path
✅ **Plan execution** - Workflow pattern and phases

❌ **Don't assume too much** - Ask when critical decisions unclear
❌ **Don't skip implicit requirements** - Always include testing, security, etc.
❌ **Don't leave scope vague** - Clarify MVP vs full-featured

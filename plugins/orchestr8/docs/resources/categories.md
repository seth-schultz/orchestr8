# Resource Categories

The Orchestr8 resource system organizes knowledge into seven primary categories, each serving a distinct purpose in the AI agent ecosystem. This document provides comprehensive guidance on what belongs in each category, when to use them, and how they relate to each other.

## Category Overview

| Category | Purpose | Fragment Count | Avg Tokens | Example URI |
|----------|---------|----------------|------------|-------------|
| **agents** | AI agent expertise and specializations | 95 | 720 | `orchestr8://agents/typescript-core` |
| **skills** | Reusable techniques and best practices | 48 | 680 | `orchestr8://skills/error-handling-resilience` |
| **patterns** | Design and architectural patterns | 34 | 850 | `orchestr8://patterns/autonomous-organization` |
| **examples** | Code examples and implementations | 15 | 620 | `orchestr8://examples/express-jwt-auth` |
| **guides** | Setup and configuration guides | 10 | 780 | `orchestr8://guides/aws-eks-cluster` |
| **best-practices** | Code standards and quality guidelines | 6 | 740 | `orchestr8://best-practices/api-design-rest` |
| **workflows** | Execution strategies and processes | 13 | 640 | `orchestr8://workflows/workflow-new-project` |

---

## agents/

**Purpose:** AI agent definitions containing specialized expertise, skills, and domain knowledge.

### What Belongs Here

**Agent fragments define:**
- Programming language expertise (TypeScript, Python, Rust, Go)
- Framework knowledge (React, FastAPI, Express, Actix)
- Domain specializations (security, performance, testing, infrastructure)
- Technology expertise (databases, cloud platforms, DevOps tools)
- Role-based capabilities (frontend developer, backend developer, DevOps engineer)

**Characteristics:**
- Contains deep expertise in a specific area
- Provides detailed "how-to" knowledge
- Includes code patterns and examples
- Focuses on implementation details
- Larger token count (typically 600-1200 tokens)

### When to Use

**Create agent fragments when:**
- You need to define expertise in a programming language or framework
- You're documenting specialized domain knowledge (e.g., security, ML, blockchain)
- You want to create role-based agent capabilities (developer, QA, SRE)
- The knowledge is deep and comprehensive

**Don't create agent fragments for:**
- Single techniques (use skills/)
- Architectural patterns (use patterns/)
- Step-by-step processes (use workflows/)
- Code examples only (use examples/)

### Structure Patterns

#### Language Expert Pattern

```
{language}-core.md              - Core language fundamentals
{language}-{specialization}.md  - Specialized knowledge

Examples:
- typescript-core.md
- typescript-async-patterns.md
- typescript-api-development.md
- typescript-testing.md
```

#### Domain Expert Pattern

```
{domain}-{technology}.md

Examples:
- frontend-react-expert.md
- frontend-vue-expert.md
- database-architect-sql.md
- database-architect-nosql.md
```

#### Role-Based Pattern

```
{role}-{specialization}.md

Examples:
- worker-developer.md
- worker-qa.md
- worker-sre.md
- project-manager.md
```

### Examples

#### typescript-core.md

```yaml
---
id: typescript-core
category: agent
tags: [typescript, types, generics, type-inference, advanced-types]
capabilities:
  - Complex type system design
  - Generic type constraints and inference
  - Conditional and mapped types
  - Type-level programming
useWhen:
  - Designing type-safe APIs using generic constraints
  - Solving complex type transformations with utility types
  - Implementing discriminated unions for type-safe state machines
estimatedTokens: 650
---

# TypeScript Core Expertise

## Generic Constraints & Inference
[Deep expertise content...]
```

**Why this is an agent fragment:**
- Comprehensive language expertise
- Deep technical knowledge
- Implementation-focused
- Reusable across many tasks

#### python-fastapi-validation.md

```yaml
---
id: python-fastapi-validation
category: agent
tags: [python, fastapi, pydantic, validation, rest-api]
capabilities:
  - Request validation with Pydantic models
  - Custom validators and constraints
  - Error response formatting
useWhen:
  - Building FastAPI endpoints with request validation
  - Defining Pydantic models with complex constraints
  - Handling validation errors in REST APIs
estimatedTokens: 680
---

# FastAPI Request Validation Expertise

## Pydantic Models
[Framework-specific expertise...]
```

**Why this is an agent fragment:**
- Framework-specific knowledge
- Implementation patterns
- Reusable expertise component

---

## skills/

**Purpose:** Reusable techniques, best practices, and focused skills that can be applied across domains.

### What Belongs Here

**Skill fragments define:**
- Specific techniques (retry logic, circuit breakers, caching)
- Best practices (error handling, logging, testing)
- Cross-cutting concerns (security, performance, observability)
- Reusable patterns (authentication, validation, deployment)
- Tool-specific knowledge (Git workflows, Docker best practices)

**Characteristics:**
- Focused on a single technique or practice
- Applicable across multiple technologies
- Emphasizes "how" over "what"
- Smaller token count (typically 500-800 tokens)
- Action-oriented

### When to Use

**Create skill fragments when:**
- You're documenting a specific technique applicable across technologies
- You want to capture a best practice or standard
- The knowledge is tool or technique focused (not domain-specific)
- The skill can be combined with agent expertise

**Don't create skill fragments for:**
- Language-specific expertise (use agents/)
- High-level architectural patterns (use patterns/)
- Complete workflows (use workflows/)
- Technology setup guides (use guides/)

### Structure Patterns

#### Technique Pattern

```
{category}-{technique}.md

Examples:
- error-handling-resilience.md
- error-handling-logging.md
- testing-integration-patterns.md
- performance-caching.md
```

#### Tool-Specific Pattern

```
{tool}-{best-practice}.md

Examples:
- docker-best-practices.md
- git-workflow.md
- kubernetes-deployment-patterns.md
```

#### Cross-Cutting Pattern

```
{concern}-{technique}.md

Examples:
- security-authentication-jwt.md
- security-input-validation.md
- observability-distributed-tracing.md
- observability-structured-logging.md
```

### Examples

#### error-handling-resilience.md

```yaml
---
id: error-handling-resilience
category: skill
tags: [error-handling, resilience, retry, circuit-breaker, timeout]
capabilities:
  - Implement exponential backoff retry logic
  - Design circuit breaker patterns
  - Handle transient failures
useWhen:
  - Implementing retry logic with exponential backoff for API calls
  - Building circuit breaker pattern for third-party services
  - Designing fault-tolerant microservices
estimatedTokens: 710
---

# Error Handling & Resilience

## Retry Patterns
[Technique-focused content...]
```

**Why this is a skill fragment:**
- Specific technique (resilience)
- Applicable across languages
- Reusable pattern
- Complements agent expertise

#### security-authentication-jwt.md

```yaml
---
id: security-authentication-jwt
category: skill
tags: [security, authentication, jwt, token, rest-api]
capabilities:
  - JWT token generation and validation
  - Secure token storage strategies
  - Refresh token rotation
useWhen:
  - Implementing JWT authentication for REST APIs
  - Securing API endpoints with bearer tokens
  - Handling token refresh and rotation
estimatedTokens: 680
---

# JWT Authentication

## Token Structure
[Security technique content...]
```

**Why this is a skill fragment:**
- Focused technique (JWT auth)
- Cross-language pattern
- Reusable security practice

---

## patterns/

**Purpose:** Design patterns, architectural approaches, and structural solutions to common problems.

### What Belongs Here

**Pattern fragments define:**
- Architectural patterns (microservices, event-driven, layered)
- Design patterns (CQRS, saga, circuit breaker at architecture level)
- Organizational patterns (autonomous organization, phased delivery)
- Technology selection frameworks
- Trade-off analysis approaches

**Characteristics:**
- High-level architectural or design thinking
- Focuses on structure and organization
- Language/framework agnostic
- Larger token count (typically 800-1800 tokens)
- Conceptual and strategic

### When to Use

**Create pattern fragments when:**
- You're documenting an architectural approach or design pattern
- You need to describe system-level structure
- The pattern is technology-agnostic or spans multiple technologies
- You're capturing strategic decision-making frameworks

**Don't create pattern fragments for:**
- Language-specific implementations (use agents/)
- Specific techniques (use skills/)
- Step-by-step processes (use workflows/)
- Code examples (use examples/)

### Structure Patterns

#### Architecture Pattern

```
architecture-{pattern-name}.md

Examples:
- architecture-microservices.md
- architecture-layered.md
- architecture-event-driven.md
```

#### Design Pattern

```
{category}-{pattern-name}.md

Examples:
- event-driven-cqrs.md
- event-driven-saga.md
- database-indexing-strategies.md
```

#### Organizational Pattern

```
{pattern-name}.md

Examples:
- autonomous-organization.md
- phased-delivery.md
- research-then-execute.md
```

### Examples

#### autonomous-organization.md

```yaml
---
id: autonomous-organization
category: pattern
tags: [workflow, autonomous, organization, parallel, coordination]
capabilities:
  - Multi-tier autonomous organization
  - File conflict prevention
  - Parallel task coordination
  - Role-based specialization
useWhen:
  - Large-scale projects with 50+ files requiring hierarchical organization
  - True parallel development scenarios needing file conflict prevention
  - Multi-domain implementations requiring specialized roles
estimatedTokens: 1800
---

# Autonomous Organization Workflow

## Overview
[Architectural pattern content...]
```

**Why this is a pattern fragment:**
- Architectural approach
- System-level organization
- Technology-agnostic
- Strategic thinking

#### event-driven-cqrs.md

```yaml
---
id: event-driven-cqrs
category: pattern
tags: [architecture, cqrs, event-driven, event-sourcing, domain-driven]
capabilities:
  - Command Query Responsibility Segregation
  - Event-sourced architectures
  - Read/write model separation
useWhen:
  - Designing systems with high read/write scalability requirements
  - Implementing event-sourced architectures
  - Building complex domain models with CQRS
estimatedTokens: 920
---

# CQRS Pattern

## Command vs Query
[Design pattern content...]
```

**Why this is a pattern fragment:**
- Design pattern (CQRS)
- Architectural concept
- Language-agnostic

---

## examples/

**Purpose:** Concrete code examples and reference implementations.

### What Belongs Here

**Example fragments contain:**
- Complete code examples (working implementations)
- Code snippets demonstrating specific techniques
- Configuration examples (Docker, Kubernetes, Terraform)
- Integration examples (API clients, authentication flows)
- Technology-specific implementations

**Characteristics:**
- Primarily code (80%+ code, 20% explanation)
- Working, runnable examples
- Focused on a single use case
- Smaller token count (typically 500-700 tokens)
- Practical and concrete

### When to Use

**Create example fragments when:**
- You have working code demonstrating a technique
- You want to provide reference implementations
- The value is in the code itself (not the explanation)
- You're showing technology-specific implementation

**Don't create example fragments for:**
- Explanations without code (use skills/ or agents/)
- Architectural discussions (use patterns/)
- Step-by-step guides (use guides/)
- Processes (use workflows/)

### Structure Patterns

#### Technology Example Pattern

```
{technology}-{example-type}.md

Examples:
- express-jwt-auth.md
- react-hooks-context.md
- kubernetes-deployment-basic.md
```

#### Integration Example Pattern

```
{tech1}-{tech2}-integration.md

Examples:
- fastapi-postgres-sqlalchemy.md
- react-express-auth.md
- terraform-aws-vpc.md
```

### Examples

#### express-jwt-auth.md

```yaml
---
id: express-jwt-auth
category: example
tags: [express, jwt, authentication, nodejs, middleware]
capabilities:
  - JWT authentication middleware
  - Token generation and validation
  - Protected route examples
useWhen:
  - Implementing JWT authentication in Express.js applications
  - Setting up protected API routes with bearer tokens
  - Building authentication middleware for REST APIs
estimatedTokens: 680
---

# Express.js JWT Authentication Example

## Authentication Middleware

```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // [Complete working code...]
};
```

[More code examples...]
```

**Why this is an example fragment:**
- Primarily code
- Working implementation
- Concrete and runnable

#### kubernetes-deployment-basic.md

```yaml
---
id: k8s-deployment-basic
category: example
tags: [kubernetes, deployment, yaml, container, orchestration]
capabilities:
  - Basic Kubernetes deployment configuration
  - Service and pod definitions
  - Health check configuration
useWhen:
  - Deploying containerized applications to Kubernetes
  - Creating basic deployment manifests
  - Setting up services and load balancing
estimatedTokens: 620
---

# Basic Kubernetes Deployment

## Deployment Manifest

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  # [Complete working YAML...]
```

[More configuration examples...]
```

**Why this is an example fragment:**
- Configuration code
- Working manifest
- Copy-paste ready

---

## guides/

**Purpose:** Setup guides, configuration instructions, and step-by-step tutorials.

### What Belongs Here

**Guide fragments contain:**
- Setup and installation instructions
- Configuration guides
- Infrastructure provisioning steps
- Tool setup and initialization
- Environment preparation

**Characteristics:**
- Step-by-step instructions
- Tool or platform specific
- Sequential and prescriptive
- Medium token count (typically 600-900 tokens)
- Action-oriented with clear steps

### When to Use

**Create guide fragments when:**
- You're documenting setup or installation procedures
- You need to provide configuration instructions
- The value is in the step-by-step process
- You're covering infrastructure or environment setup

**Don't create guide fragments for:**
- Architectural decisions (use patterns/)
- Code examples (use examples/)
- Conceptual explanations (use skills/ or agents/)
- Execution workflows (use workflows/)

### Structure Patterns

#### Setup Guide Pattern

```
{tool}-{resource}-setup.md

Examples:
- aws-eks-cluster.md
- prometheus-monitoring-setup.md
- terraform-remote-state.md
```

#### Configuration Guide Pattern

```
{technology}-{configuration}.md

Examples:
- kubernetes-secrets-management.md
- ci-cd-github-actions.md
- database-migrations-flyway.md
```

### Examples

#### aws-eks-cluster.md

```yaml
---
id: aws-eks-cluster
category: pattern
tags: [aws, eks, kubernetes, cluster, infrastructure]
capabilities:
  - EKS cluster provisioning
  - Node group configuration
  - IAM role setup
useWhen:
  - Setting up production-grade Kubernetes cluster on AWS
  - Configuring EKS with proper networking and security
  - Provisioning managed Kubernetes infrastructure
estimatedTokens: 850
---

# AWS EKS Cluster Setup Guide

## Prerequisites

1. AWS CLI installed and configured
2. eksctl CLI tool installed
3. kubectl installed

## Step 1: Create VPC

```bash
eksctl create cluster \
  --name production-cluster \
  --region us-west-2 \
  # [Complete setup steps...]
```

[More setup instructions...]
```

**Why this is a guide fragment:**
- Step-by-step setup
- Infrastructure provisioning
- Sequential instructions

#### prometheus-monitoring-setup.md

```yaml
---
id: prometheus-monitoring-setup
category: pattern
tags: [prometheus, monitoring, observability, metrics, alerting]
capabilities:
  - Prometheus installation and configuration
  - Metrics scraping setup
  - Alert rule configuration
useWhen:
  - Setting up application monitoring with Prometheus
  - Configuring metrics collection and alerting
  - Installing Prometheus in Kubernetes or bare metal
estimatedTokens: 780
---

# Prometheus Monitoring Setup

## Installation

### Kubernetes (Helm)

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/prometheus
```

[More configuration steps...]
```

**Why this is a guide fragment:**
- Installation instructions
- Configuration guide
- Tool-specific setup

---

## best-practices/

**Purpose:** Code standards, quality guidelines, and established conventions.

### What Belongs Here

**Best practice fragments define:**
- Code quality standards
- API design conventions
- Security best practices
- Testing standards
- Documentation guidelines
- Code review checklists

**Characteristics:**
- Prescriptive guidelines
- Industry standards
- Quality-focused
- Technology or domain specific
- Medium token count (typically 600-900 tokens)

### When to Use

**Create best practice fragments when:**
- You're documenting coding standards or conventions
- You need to capture quality guidelines
- You're establishing team or project standards
- You're documenting security or compliance requirements

**Don't create best practice fragments for:**
- Specific implementations (use examples/)
- Architectural patterns (use patterns/)
- How-to guides (use skills/)
- Processes (use workflows/)

### Structure Patterns

#### Standards Pattern

```
{domain}-{standard-type}.md

Examples:
- api-design-rest.md
- security-owasp-top10.md
- code-quality-standards.md
```

#### Convention Pattern

```
{technology}-{convention}.md

Examples:
- typescript-style-guide.md
- python-pep8-guidelines.md
- react-component-patterns.md
```

### Examples

#### api-design-rest.md

```yaml
---
id: api-design-rest
category: skill
tags: [api, rest, design, http, conventions]
capabilities:
  - RESTful API design principles
  - HTTP method usage conventions
  - Resource naming guidelines
useWhen:
  - Designing RESTful APIs following industry standards
  - Establishing API naming and structure conventions
  - Building consistent REST API interfaces
estimatedTokens: 720
---

# REST API Design Best Practices

## Resource Naming

**Collections (plural nouns):**
```
GET /users
POST /users
```

**Individual resources (ID-based):**
```
GET /users/{id}
PUT /users/{id}
DELETE /users/{id}
```

[More conventions...]
```

**Why this is a best practice fragment:**
- Design conventions
- Industry standards
- Quality guidelines

#### security-owasp-top10.md

```yaml
---
id: security-owasp-top10
category: skill
tags: [security, owasp, vulnerabilities, web-security, best-practices]
capabilities:
  - Identify and prevent common security vulnerabilities
  - Apply OWASP security guidelines
  - Implement secure coding practices
useWhen:
  - Conducting security audits of web applications
  - Implementing security best practices in development
  - Preventing common web application vulnerabilities
estimatedTokens: 890
---

# OWASP Top 10 Security Best Practices

## 1. Injection Prevention

**SQL Injection:**
```typescript
// Bad
db.query(`SELECT * FROM users WHERE id = ${userId}`);

// Good
db.query('SELECT * FROM users WHERE id = ?', [userId]);
```

[More security guidelines...]
```

**Why this is a best practice fragment:**
- Security standards
- Vulnerability prevention
- Industry guidelines

---

## workflows/

**Purpose:** Execution strategies, process templates, and task orchestration patterns.

### What Belongs Here

**Workflow fragments define:**
- Multi-step processes
- Task execution strategies
- Project workflows (new project, refactoring, deployment)
- Phased approaches
- Coordination patterns

**Characteristics:**
- Process-oriented
- Sequential or phased
- Describes "when" and "how" to execute
- Medium token count (typically 500-800 tokens)
- Strategic and tactical

### When to Use

**Create workflow fragments when:**
- You're documenting a multi-step process
- You need to define execution strategies
- You're capturing project lifecycle patterns
- You're describing coordination approaches

**Don't create workflow fragments for:**
- Setup instructions (use guides/)
- Code examples (use examples/)
- Design patterns (use patterns/)
- Single techniques (use skills/)

### Structure Patterns

#### Task Workflow Pattern

```
workflow-{task-name}.md

Examples:
- workflow-new-project.md
- workflow-refactor.md
- workflow-deploy.md
- workflow-security-audit.md
```

#### Process Pattern

```
workflow-{process-name}.md

Examples:
- workflow-research-solution.md
- workflow-knowledge-capture.md
- workflow-performance-optimization.md
```

### Examples

#### workflow-new-project.md

```yaml
---
id: workflow-new-project
category: pattern
tags: [workflow, project-creation, initialization, autonomous, parallel]
capabilities:
  - End-to-end project initialization
  - Tech stack selection
  - Parallel track execution
useWhen:
  - Greenfield project initialization requiring tech stack selection
  - Production-ready application development with parallel tracks
  - Full-stack project creation with structured approach
estimatedTokens: 580
---

# New Project Creation Pattern

**Phases:** Requirements (0-20%) → Setup (20-30%) → Implementation (30-70%) → Testing (70-90%) → Deployment (90-100%)

## Phase 1: Requirements & Architecture (0-20%)
- Parse requirements
- Select tech stack
- Design architecture
- **Checkpoint:** Architecture approved

## Phase 2: Project Setup (20-30%)
[Process steps...]
```

**Why this is a workflow fragment:**
- Multi-phase process
- Execution strategy
- Coordination approach

#### workflow-refactor.md

```yaml
---
id: workflow-refactor
category: pattern
tags: [workflow, refactoring, code-quality, testing, incremental]
capabilities:
  - Safe refactoring process
  - Test-driven refactoring
  - Incremental improvement strategy
useWhen:
  - Refactoring legacy code with comprehensive test coverage
  - Improving code quality incrementally
  - Restructuring code while maintaining functionality
estimatedTokens: 640
---

# Code Refactoring Workflow

## Phase 1: Analysis (0-20%)
- Identify code smells
- Prioritize refactoring targets
- **Checkpoint:** Refactoring plan approved

## Phase 2: Test Coverage (20-40%)
[Process steps...]
```

**Why this is a workflow fragment:**
- Phased process
- Execution strategy
- Safety protocols

---

## Cross-Category Relationships

### How Categories Compose

Categories are designed to work together in layered compositions:

```
Task: Build TypeScript Express API with JWT auth

Layer 1 (Workflow):
└── workflow-new-project (process structure)

Layer 2 (Agents):
├── typescript-core (language expertise)
└── typescript-api-development (framework expertise)

Layer 3 (Skills):
├── security-authentication-jwt (auth technique)
└── error-handling-api-patterns (error handling)

Layer 4 (Examples):
└── express-jwt-auth (reference implementation)

Layer 5 (Patterns):
└── api-design-rest (architectural guidance)

Total: ~3,500 tokens (dynamically assembled)
```

### Category Selection Decision Tree

```
Is it a multi-step process?
├── Yes → workflows/
└── No ↓

Is it primarily code?
├── Yes → examples/
└── No ↓

Is it setup/installation instructions?
├── Yes → guides/
└── No ↓

Is it architectural or high-level design?
├── Yes → patterns/
└── No ↓

Is it comprehensive expertise in a technology?
├── Yes → agents/
└── No ↓

Is it a quality standard or convention?
├── Yes → best-practices/
└── No ↓

Is it a specific technique or best practice?
└── Yes → skills/
```

### Common Combinations

#### Full-Stack Development
```
agents/typescript-core
agents/frontend-react-expert
skills/api-design-rest
examples/express-jwt-auth
workflows/workflow-new-project
```

#### Infrastructure Setup
```
patterns/architecture-microservices
guides/aws-eks-cluster
guides/terraform-remote-state
skills/kubernetes-deployment-patterns
examples/k8s-deployment-basic
```

#### Security Implementation
```
skills/security-authentication-jwt
skills/security-input-validation
best-practices/security-owasp-top10
examples/express-jwt-auth
workflows/workflow-security-audit
```

---

## Category Best Practices

### For Authors

1. **Choose the right category** using the decision tree
2. **Consider composition** - how will this combine with other fragments?
3. **Avoid duplication** - check if similar content exists in another category
4. **Write specific metadata** - especially useWhen scenarios
5. **Think about discovery** - what queries should find this fragment?

### For Consumers

1. **Start with workflows** for high-level process guidance
2. **Load agents** for deep expertise in specific technologies
3. **Add skills** for cross-cutting techniques
4. **Reference examples** for concrete implementations
5. **Use patterns** for architectural guidance
6. **Consult guides** for setup and configuration
7. **Check best-practices** for quality standards

### Common Mistakes

❌ **Putting code examples in agents/**
- Examples belong in examples/
- Agents should explain, examples should demonstrate

❌ **Putting workflows in patterns/**
- Patterns are architectural, workflows are processual
- Patterns describe structure, workflows describe execution

❌ **Putting setup guides in skills/**
- Setup belongs in guides/
- Skills are techniques, guides are procedures

❌ **Putting best practices in skills/**
- Best practices are standards/conventions
- Skills are how-to techniques

---

## Related Documentation

- [README.md](./README.md) - Resource system overview
- [fragments.md](./fragments.md) - Fragment system details
- [authoring-guide.md](./authoring-guide.md) - Step-by-step authoring guide

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-11
**Maintained By:** Orchestr8 Documentation Team

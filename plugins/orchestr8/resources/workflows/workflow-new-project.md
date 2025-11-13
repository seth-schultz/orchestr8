---
id: workflow-new-project
category: pattern
tags: [workflow, project-creation, initialization, autonomous, parallel, greenfield, setup, architecture]
capabilities:
  - End-to-end project initialization from requirements to deployment
  - Tech stack selection and architecture design
  - Parallel track execution for backend/frontend/infrastructure
useWhen:
  - Greenfield project initialization requiring tech stack selection, architecture design, and parallel track execution for maximum velocity
  - Production-ready application development needing autonomous organization with backend, frontend, and infrastructure tracks
  - Full-stack project creation requiring structured approach from requirements analysis to deployment with CI/CD pipeline setup
  - Rapid application development scenarios needing parallel development across independent components with project manager coordination
estimatedTokens: 2800
---

# New Project Creation Pattern

**Phases:** Requirements (0-20%) → Setup (20-30%) → Implementation (30-70%) → Testing (70-90%) → Deployment (90-100%)

**Token Efficiency:**
- Without JIT: ~12,000 tokens upfront (all agents/skills loaded)
- With JIT: ~2,800 tokens progressive (loaded by phase as needed)
- **Savings: 77%**

## Phase 1: Requirements & Architecture (0-20%)

**→ Load Requirements & Architecture Expertise (JIT):**
```
orchestr8://match?query=requirements+analysis+architecture+design&categories=skill,pattern&mode=index&maxResults=5
orchestr8://skills/requirement-analysis-framework
```

**Activities:**
- Parse requirements (functional, non-functional, constraints)
- Select tech stack based on project needs
- Design architecture (components, APIs, data models)
- Document decisions (ADRs)

**Checkpoint:** Architecture approved

## Phase 2: Project Setup (20-30%)

**→ Load Project Setup Expertise (JIT):**
```
orchestr8://match?query=${tech-stack}+project+initialization+tooling&categories=skill,example&mode=index&maxResults=5
orchestr8://skills/git-workflow
```

**Parallel:** Repository + Build tools + Environment config
- Init git, create structure, configure tools
- Package manager, compiler, linter, formatter
- Config management, env templates, secrets

**Checkpoint:** `npm install && npm run build` works

## Phase 3: Core Implementation (30-70%)

**→ Load Implementation Expertise (JIT):**
```
orchestr8://match?query=${tech-stack}+${architecture-pattern}+implementation&categories=agent,skill,example&mode=index&maxResults=15
orchestr8://patterns/autonomous-parallel
```

**Note:** This single comprehensive load supports all parallel tracks (backend, frontend, infrastructure) with domain-specific expertise.

**Parallel tracks:**
- **Backend:** Schema/migrations, business logic (SOLID), API endpoints, auth
  - Backend PM loads: `orchestr8://match?query=${backend-tech}+api+database&categories=agent,example&mode=index&maxResults=8`
- **Frontend:** Routing, components, state, API integration, UX
  - Frontend PM loads: `orchestr8://match?query=${frontend-framework}+components+state&categories=agent,example&mode=index&maxResults=8`
- **Infrastructure:** Docker, configs, secrets management
  - Infra PM loads: `orchestr8://match?query=${infra-platform}+docker+deployment&categories=agent,skill&mode=index&maxResults=5`

**Checkpoint:** Features work end-to-end

## Phase 4: Testing & Quality (70-90%)

**→ Load Testing & Quality Expertise (JIT):**
```
orchestr8://match?query=${tech-stack}+testing+quality+security&categories=skill,agent&mode=index&maxResults=8
orchestr8://skills/testing-strategies
orchestr8://skills/security-owasp-top10
```

**Parallel tracks:**
- **Testing:** Unit (80%+), integration, E2E, CI automation
- **Quality:** Code review, security scan, performance check

**Checkpoint:** Tests pass, no critical vulnerabilities

## Phase 5: Deployment (90-100%)

**→ Load Deployment Expertise (JIT - CONDITIONAL):**
```
# Only if deployment requested
orchestr8://match?query=${deployment-platform}+cicd+infrastructure&categories=skill,pattern&mode=index&maxResults=8
orchestr8://skills/deployment-zero-downtime
orchestr8://patterns/architecture-decision-records
```

**Parallel tracks:**
- **CI/CD:** Pipeline, staging/production configs
- **Infrastructure:** IaC, networking, databases
- **Observability:** Logging, metrics, alerts
- **Docs:** README, API docs, runbooks
- **Final:** Staging → Production → Monitor

**Checkpoint:** Production healthy, monitored

## Parallelism
- **Independent:** Backend + Frontend + Infra (Phase 3), Testing + Security (Phase 4), CI/CD + IaC + Observability (Phase 5)
- **Dependencies:** Frontend needs backend API, E2E needs both, production needs staging validation

## JIT Loading Strategy

**Progressive Refinement:**
1. Phase 1: Load general architecture patterns (1200 tokens)
2. Phase 2: Load setup/tooling skills based on selected tech stack (1000 tokens)
3. Phase 3: Load comprehensive implementation expertise for all tracks (3500 tokens total, or 1500+1500+1200 if split across PMs)
4. Phase 4: Load testing and security validation skills (2000 tokens)
5. Phase 5: Conditionally load deployment if needed (1800 tokens)

**Total Budget:** 2,800-9,500 tokens depending on complexity and deployment needs
**Typical Usage:** 4,500-6,000 tokens for most projects

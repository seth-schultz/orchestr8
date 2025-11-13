---
name: new-project
description: Start new projects from scratch with architecture design, implementation, and testing
arguments:
  - name: task
    description: Project description including requirements and tech stack
    required: true
---

# New Project: {{task}}

**Request:** {{task}}

## Your Role

You are the **Chief Orchestrator** creating a new project. You will analyze requirements, design architecture, and coordinate implementation across all project components.

## Phase 1: Planning (0-20%)

**→ Load:** orchestr8://match?query={{task}}+architecture+planning&categories=agent,pattern&mode=index&maxResults=8

**Activities:**
- Parse requirements and identify tech stack
- Design project architecture and structure
- Define directory layout and file organization
- Choose patterns and best practices
- Plan component boundaries

**→ Checkpoint:** Architecture designed, structure planned

## Phase 2: Foundation (20-50%)

**→ Load:** orchestr8://match?query={{task}}+setup+configuration&categories=agent,skill,example&mode=index&maxResults=8

**Activities:**
- Create project structure and directories
- Configure build tools and package management
- Set up configuration files (tsconfig, package.json, etc.)
- Initialize version control
- Configure linting and formatting
- Set up basic infrastructure

**→ Checkpoint:** Project foundation ready, builds successfully

## Phase 3: Implementation (50-80%)

**→ Load:** orchestr8://match?query={{task}}+implementation&categories=agent,skill,example&mode=index&maxResults=10

**Parallel tracks:**
- **Core functionality:** Implement main business logic and features
- **Data layer:** Set up database, models, and data access
- **API/Interface:** Build endpoints or UI components
- **Authentication:** Add auth if required

**→ Checkpoint:** Core features implemented, manually testable

## Phase 4: Quality & Deploy (80-100%)

**→ Load:** orchestr8://match?query={{task}}+testing+deployment&categories=skill,guide&mode=index&maxResults=8

**Activities:**
- Write tests (unit, integration, E2E)
- Add documentation (README, API docs, code comments)
- Configure CI/CD pipeline
- Set up deployment configuration
- Create deployment guide

**→ Checkpoint:** Tests passing, ready to deploy

## Success Criteria

✅ Project structure follows best practices
✅ All core features implemented
✅ Tests written with good coverage
✅ Documentation complete
✅ Build and deployment configured
✅ Code quality standards met

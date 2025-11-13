---
id: autonomous-organization-workflow
category: pattern
tags: [workflow, autonomous, organization, parallel, coordination, project-management, file-conflicts, team, orchestration]
capabilities:
  - Multi-tier autonomous organization
  - File conflict prevention
  - Parallel task coordination
  - Role-based specialization
  - Project manager coordination
  - Worker specialization
  - Progress tracking and reporting
useWhen:
  - Large-scale projects with 50+ files requiring three-tier hierarchy with Chief Orchestrator, Project Managers, and specialized Workers
  - True parallel development scenarios needing file conflict prevention through registry-based coordination across multiple concurrent developers
  - Multi-domain implementations requiring specialized roles including Developer, QA Engineer, SRE, and Documentation Specialist with clear scope boundaries
  - Complex systems with cross-scope dependencies requiring wave-based PM launches with dependency analysis and sequential coordination
  - Projects where uncoordinated parallel work creates file conflicts, requiring PM-level file registry management and worker task assignment
  - Enterprise-scale development needing hierarchical task management with autonomous PM decision-making and worker specialization
estimatedTokens: 1800
---

# Autonomous Organization Workflow

## Overview

Execute complex projects using a complete autonomous organization with hierarchical coordination, specialized roles, and intelligent file conflict prevention. This pattern enables true parallel development by coordinating multiple workers through project managers who ensure no file conflicts occur.

**Key Mechanism:** Nested Task Creation
- Chief Orchestrator uses **Task tool** to create Project Manager subagents
- Project Managers use **Task tool** to create Worker subagents
- This creates a three-tier hierarchy: Chief → PMs → Workers
- Each tier operates autonomously within its scope

## Organization Structure

```
Chief Orchestrator (this agent)
├── Task Decomposition & Organization Planning
├── Project Manager Coordination (creates PMs via Task tool)
└── Final Integration & Validation

Project Manager(s) (Task subagents created by Chief)
├── Scope Management (e.g., Backend, Frontend, Infrastructure)
├── File Conflict Registry Management
├── Worker Task Assignment (creates Workers via Task tool)
├── Worker Output Integration
└── Scope-Level Validation

Specialized Workers (Task subagents created by PMs)
├── Developer (implementation)
├── QA Engineer (testing)
├── SRE (infrastructure, deployment)
└── Documentation Specialist
```

**Task Tool Hierarchy:**
```
You (Chief)
  ↓ Task tool
Project Managers (subagents)
  ↓ Task tool
Workers (sub-subagents)
  ↓ Do actual work
Code/Tests/Infrastructure
```

## Role Definitions

### Chief Orchestrator
**Responsibilities:**
- Analyze request and decompose into high-level scopes/domains
- Launch project managers for each scope
- Track organization-level progress
- Integrate final outputs from all project managers
- Validate end-to-end functionality

**Does NOT:**
- Directly modify code
- Manage file-level conflicts
- Launch individual workers

### Project Manager
**Responsibilities:**
- Own a specific scope (e.g., backend, frontend, infrastructure)
- Maintain file conflict registry for their scope
- Break down scope into worker tasks
- Assign tasks to specialized workers with explicit file lists
- Launch workers in parallel (when no file conflicts)
- Collect and integrate worker outputs
- Validate scope-level functionality
- Report status to Chief Orchestrator

**File Conflict Registry Format:**
```json
{
  "inProgress": {
    "worker_id": ["file1.ts", "file2.ts"],
    "worker_id_2": ["file3.ts"]
  },
  "completed": {
    "worker_id": ["file1.ts", "file2.ts"]
  }
}
```

**Before Launching Worker:**
1. Determine files the worker will modify
2. Check registry for conflicts
3. If conflict: queue task until files are free
4. If no conflict: register files and launch worker

### Specialized Workers

#### Developer
- Implement features/fixes
- Write clean, tested code
- Follow project conventions
- Report files modified

#### QA Engineer
- Write comprehensive tests
- Validate functionality
- Report test coverage
- Flag issues early

#### SRE
- Infrastructure as code
- CI/CD pipeline setup
- Monitoring and observability
- Deployment automation

#### Documentation Specialist
- API documentation
- Architecture decision records
- User guides
- Inline code documentation

## Execution Flow

### Phase 1: Organization Initialization (Chief Orchestrator)

1. **Analyze Request**
   - Understand full scope and requirements
   - Identify technical domains involved
   - Determine if multiple scopes warrant project managers

2. **Analyze Cross-PM Dependencies (CRITICAL)**

   **MUST identify dependencies BEFORE planning structure:**

   For each scope, determine:
   - **CONSUMES:** What this scope needs from others (APIs, data, infrastructure)
   - **PRODUCES:** What this scope creates for others
   - **BLOCKING:** Which scopes must complete before this starts

   **Common patterns:**
   - Testing/Validation CANNOT run parallel with what they test
   - Consumers CANNOT run parallel with their producers
   - Build/Deploy CANNOT run parallel with implementation

   **Group into waves:**
   - Wave 1: Scopes with ZERO dependencies
   - Wave 2: Scopes depending ONLY on Wave 1
   - Wave 3+: Continue pattern

3. **Plan Organization Structure with Waves**
   ```
   Example for full-stack API project:

   Dependency analysis:
   - Backend: produces API (no dependencies)
   - Frontend: consumes API (depends on Backend)
   - Testing: consumes Frontend+Backend (depends on both)

   Waves:
   Wave 1: PM-Backend (src/api/, src/services/)
   Wave 2: PM-Frontend (src/components/, src/pages/)
   Wave 3: PM-Testing (tests/, e2e/)
   ```

4. **Launch Project Managers in Waves**

   **Launch Wave 1 PMs:**
   - Use Task tool to create PM subagents with NO dependencies
   - Send SINGLE message with multiple Task invocations (one per Wave 1 PM)
   - Wait for ALL Wave 1 PMs to complete

   **Launch Wave 2 PMs:**
   - Use Task tool to create PM subagents that depend on Wave 1
   - Send SINGLE message with multiple Task invocations (one per Wave 2 PM)
   - Wait for ALL Wave 2 PMs to complete

   **Continue for Wave 3+...**

   **Each PM gets:**
   - Clear scope definition and file boundaries
   - List of completed dependencies (what they can rely on)
   - Worker types they can use
   - Instruction to load PM expertise

### Phase 2: Project Manager Execution

Each PM is a Task subagent that executes this workflow autonomously:

1. **Scope Analysis**
   - Load PM expertise: orchestr8://agents/project-manager
   - Load relevant scope-specific expertise from catalog
   - Break scope into granular worker tasks
   - Identify file dependencies and blocking relationships

2. **Task Planning with Conflict Prevention**
   ```
   For each worker task:
   - List exact files to be created/modified
   - Check file conflict registry
   - Identify blocking dependencies (tasks that must complete first)
   - Group non-conflicting, unblocked tasks for parallel execution
   - Queue blocked tasks with blockedBy references
   ```

3. **Worker Coordination**
   - **Use Task tool to launch Wave 1:** All non-conflicting, unblocked workers (single message, multiple Task invocations)
   - Wait for completion (workers report back)
   - Update registry (move from inProgress to completed)
   - Check queued tasks for newly unblocked work
   - **Use Task tool to launch Wave 2:** Next set of non-conflicting workers (single message, multiple Task invocations)
   - Repeat until registry.queued is empty and all tasks complete

4. **Integration & Validation**
   - Collect all worker outputs
   - Test scope-level integration
   - Validate against requirements
   - Report to Chief Orchestrator

### Phase 3: Final Integration (Chief Orchestrator)

1. **Collect PM Outputs**
   - Review deliverables from each scope
   - Check for cross-scope issues

2. **End-to-End Integration**
   - Connect components across scopes
   - Resolve any cross-scope conflicts
   - Run comprehensive tests

3. **Final Validation**
   - Verify all requirements met
   - Check quality standards
   - Validate security and performance

## Worker Task Specification

When a PM launches a worker, provide:

```markdown
## Task
[Clear description of what to implement/test/deploy]

## Scope Boundaries
Files you WILL modify: [exact list]
Files you MUST NOT modify: [any files outside scope or in use]

## Requirements
- [Specific requirement 1]
- [Specific requirement 2]

## Context
[Any necessary context about the broader system]

## Deliverables
- [Expected output 1]
- [Expected output 2]

## Reporting
Report back:
1. Files actually modified
2. Any files you needed but couldn't modify (conflicts)
3. Completion status
4. Any blockers or issues
```

## File Conflict Prevention Protocol

### Before Launching Any Worker

1. **Identify Files**
   ```
   Analyze the task and list ALL files that will be:
   - Created
   - Modified
   - Deleted
   ```

2. **Check Registry**
   ```
   For each file in the list:
   - Is it in inProgress? → Conflict detected
   - Is it in another worker's assigned list? → Conflict detected
   ```

3. **Decision**
   - No conflicts → Register files, launch worker
   - Conflicts → Queue task, wait for files to be freed

4. **Update Registry on Completion**
   ```
   When worker reports completion:
   - Move files from inProgress to completed
   - Check queued tasks
   - Launch next non-conflicting tasks
   ```

## Inter-PM Coordination

When scopes might have overlapping files (e.g., shared types):

1. **During Organization Planning**
   - Chief Orchestrator identifies shared files
   - Assigns shared files to ONE PM
   - Other PMs must coordinate with owner PM

2. **Shared File Protocol**
   ```
   PM 1 (Owner): Modifies shared file
   PM 2 (Dependent): Waits for PM 1's worker to complete
   PM 2: Proceeds with dependent work
   ```

3. **Alternative: Dedicated Shared Resources PM**
   - For projects with many shared files
   - One PM owns all shared code
   - Other PMs depend on this PM

## Progress Tracking

### Chief Orchestrator Level
Use TodoWrite for high-level organization tracking:
```
- Initialize organization structure
- PM 1 (Backend): In Progress
- PM 2 (Frontend): Pending
- PM 3 (Infrastructure): Pending
- Final integration and validation
```

### Project Manager Level
Each PM tracks their scope in their own context:
```
Scope: Backend API

File Conflict Registry:
- In Progress: worker-dev-1 [user.service.ts, user.controller.ts]
- Queue: worker-dev-2 [user.service.ts, auth.middleware.ts] (waiting on user.service.ts)

Workers:
- Developer 1: Implementing user endpoints [IN PROGRESS]
- Developer 2: Auth middleware [QUEUED - file conflict]
- QA 1: Unit tests [READY TO LAUNCH - no conflicts]
```

### Worker Level
Workers report back concisely:
```
Task: Implement user endpoints
Status: Complete
Files Modified:
  - src/api/user.controller.ts
  - src/services/user.service.ts
  - src/types/user.types.ts
Issues: None
```

## Best Practices

### For Chief Orchestrator

✅ **ANALYZE DEPENDENCIES FIRST** before planning any PMs
✅ Group PMs into waves based on dependencies
✅ Launch each wave completely before starting next wave
✅ Decompose based on logical domains/scopes
✅ Keep organization structure simple (3-5 PMs typically)
✅ Trust PMs to manage their scope
✅ Only intervene for cross-scope integration

❌ **NEVER launch testing PMs parallel with implementation PMs**
❌ **NEVER launch consumer PMs parallel with producer PMs**
❌ **NEVER launch all PMs at once without dependency analysis**
❌ Don't micromanage PM decisions
❌ Don't create too many PMs (overhead)

**Critical Mistakes to Avoid:**
- ❌ Launching E2E testing while frontend is being built
- ❌ Launching frontend while backend API is being implemented (if frontend needs API)
- ❌ Launching integration tests while components are being created
- ❌ Launching deployment while build is happening
- ❌ Launching any scope that consumes outputs from another scope in parallel

### For Project Managers

✅ Be aggressive about preventing file conflicts
✅ Launch workers in waves based on file availability
✅ Keep workers focused (single responsibility)
✅ Provide clear scope boundaries
✅ Track file registry meticulously
❌ Don't launch workers with potential conflicts
❌ Don't let workers modify files outside scope
❌ Don't create too many tiny workers (overhead)

### For Workers

✅ Stay strictly within assigned files
✅ Report actual files modified
✅ Flag blockers immediately
✅ Deliver complete, testable work
❌ Don't modify files outside assignment
❌ Don't make assumptions about other workers' tasks
❌ Don't integrate with other workers' code (PM does this)

## Example: Full-Stack API Project

**Request:** "Build a REST API with React frontend for task management"

### Organization Structure

```
Chief Orchestrator
├── PM-Backend (src/api/, src/services/, src/db/)
│   ├── Dev-1: Database schema & models
│   ├── Dev-2: Task API endpoints
│   ├── Dev-3: Auth endpoints
│   ├── QA-1: API unit tests
│   └── QA-2: Integration tests
│
├── PM-Frontend (src/components/, src/pages/, src/hooks/)
│   ├── Dev-1: Core components
│   ├── Dev-2: Task management pages
│   ├── Dev-3: Auth flow
│   └── QA-1: Component tests
│
└── PM-Infrastructure (docker/, .github/, terraform/)
    ├── SRE-1: Docker setup
    ├── SRE-2: CI/CD pipeline
    └── Doc-1: Deployment guide
```

### Execution Timeline

**T=0: Chief Orchestrator**
- Analyzes request
- Plans 3 PMs
- Launches PM-Backend, PM-Frontend, PM-Infrastructure in parallel

**T=1: Project Managers Initialize**
- Each PM analyzes their scope
- Creates file conflict registries
- Plans worker tasks

**T=2: Wave 1 Workers Launch**
- PM-Backend: Dev-1 (no conflicts) + QA-1 (no conflicts)
- PM-Frontend: Dev-1 (no conflicts)
- PM-Infrastructure: SRE-1 (no conflicts)

**T=3: Wave 1 Completes, Wave 2 Launches**
- PM-Backend: Dev-2, Dev-3 (now no conflicts with Dev-1's files)
- PM-Frontend: Dev-2, Dev-3 (depends on Dev-1 components)
- PM-Infrastructure: SRE-2 (needs SRE-1 Docker setup)

**T=4: Final Workers**
- PM-Backend: QA-2 (needs all endpoints complete)
- PM-Frontend: QA-1 (needs all components)

**T=5: PM Integration**
- Each PM integrates their scope
- Tests scope-level functionality
- Reports to Chief Orchestrator

**T=6: Final Integration**
- Chief Orchestrator connects frontend to backend
- Runs end-to-end tests
- Validates complete solution

## Scaling Considerations

### Small Projects (< 10 files)
- Consider skipping PMs
- Use direct worker coordination
- Simpler overhead

### Medium Projects (10-50 files)
- 2-3 PMs by domain
- Clear file boundaries
- Worth the coordination

### Large Projects (> 50 files)
- 3-5 PMs by domain
- Consider sub-PMs for large scopes
- Strict file conflict management essential

## Failure Handling

### Worker Failure
1. PM detects failure from worker report
2. PM frees files from registry
3. PM reassigns task (possibly to different worker)
4. PM tracks retry count

### PM Failure
1. Chief Orchestrator detects incomplete scope
2. Analyze what was completed
3. Relaunch PM with context of completed work
4. Continue from checkpoint

### Cross-Scope Conflict
1. Detected during final integration
2. Chief Orchestrator resolves
3. May require re-launching specific workers
4. Update organization plan to prevent recurrence

## Integration with Orchestr8 Catalog

### Chief Orchestrator
```
Query: "organization planning, project management, workflow coordination"
Load: Workflow architects, project management patterns
```

### Project Managers
```
Query: "{scope-specific-tech} {domain} best practices"
Examples:
  - "TypeScript REST API Node.js Express"
  - "React TypeScript component architecture"
  - "Terraform AWS infrastructure"
Load: Domain experts, architectural patterns, best practices
```

### Workers
```
Query: "{specific-task-tech} {task-type}"
Examples:
  - "Express.js error handling middleware"
  - "React hooks state management"
  - "Jest unit testing strategies"
Load: Specific skills, code examples, testing strategies
```

## Summary

This autonomous organization pattern enables true parallel development by:

1. **Hierarchical coordination** - Chief → PMs → Workers
2. **File conflict prevention** - Registry-based coordination
3. **Specialized roles** - Right expertise for each task
4. **Parallel execution** - Maximum efficiency without conflicts
5. **Scalable structure** - Works for small to large projects

The key insight: **Project Managers are the coordination layer that enables safe parallelism by preventing file conflicts before they happen.**

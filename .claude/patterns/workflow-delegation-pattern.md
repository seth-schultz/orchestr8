# Workflow Delegation Pattern

## Problem

Workflows were being executed in the main Claude Code context instead of being delegated to specialized orchestrator agents, defeating the purpose of hierarchical orchestration.

## Solution

Every workflow MUST start with explicit delegation instructions that force the main context to immediately invoke an orchestrator agent via the Task tool.

## Standard Delegation Header

Add this to the TOP of every workflow file (after frontmatter):

```markdown
---
description: [workflow description]
argumentHint: "[arguments]"
---

# [Workflow Name]

## ⚠️ CRITICAL: Autonomous Orchestration Required

**DO NOT execute this workflow in the main Claude Code context.**

You MUST immediately delegate this entire workflow to the appropriate orchestrator agent using the Task tool:

```
Use the Task tool with:
- subagent_type: "[orchestrator-agent-name]"
- description: "[short task description]"
- prompt: "Execute the [workflow-name] workflow with the following requirements: [user's request]. Follow all phases, quality gates, and success criteria defined in the workflow."
```

**After delegation:**
- The orchestrator agent will handle all phases autonomously
- Return control to main context only when:
  - Workflow is complete
  - User input is required
  - Critical errors occur

**Do NOT:**
- ❌ Execute workflow steps directly in main context
- ❌ Read files or run commands in main context
- ❌ Attempt to coordinate agents from main context

---

[Rest of workflow instructions for the orchestrator agent...]
```

## Orchestrator Agent Mapping

| Workflow | Orchestrator Agent |
|----------|-------------------|
| /new-project | project-orchestrator |
| /add-feature | feature-orchestrator |
| /fix-bug | debugger |
| /refactor | fullstack-developer |
| /security-audit | security-auditor |
| /optimize-performance | fullstack-developer |
| /deploy | fullstack-developer |
| /review-code | code-review-orchestrator |
| /review-pr | code-review-orchestrator |
| /review-architecture | architect |
| /setup-cicd | fullstack-developer |
| /setup-monitoring | observability-specialist |
| /build-ml-pipeline | mlops-specialist |
| /modernize-legacy | architect |
| /test-web-ui | playwright-specialist |
| /optimize-costs | aws-specialist or appropriate cloud specialist |
| /create-agent | agent-architect |
| /create-workflow | workflow-architect |
| /create-skill | skill-architect |

## Example: Updated Workflow

### Before (Broken):
```markdown
---
description: Optimize performance
---

# Optimize Performance Workflow

## Phase 1: Profiling
Use frontend-developer to profile the application...
```

Main context reads this and tries to do the work itself ❌

### After (Fixed):
```markdown
---
description: Optimize performance
---

# Optimize Performance Workflow

## ⚠️ CRITICAL: Autonomous Orchestration Required

**DO NOT execute this workflow in the main Claude Code context.**

You MUST immediately delegate to the fullstack-developer orchestrator:

Use Task tool:
- subagent_type: "fullstack-developer"
- description: "Optimize application performance"
- prompt: "Execute the optimize-performance workflow with target: [user's target]. Perform profiling, identify bottlenecks, implement optimizations, benchmark results, and document improvements. Follow all phases and quality gates."

---

## Phase 1: Profiling (20%)
[Detailed instructions for the orchestrator agent]
```

Main context immediately delegates ✅

## Implementation Checklist

- [ ] Update all 19 workflows with delegation header
- [ ] Verify each workflow maps to correct orchestrator agent
- [ ] Test that workflows properly delegate on invocation
- [ ] Update workflow creation templates with pattern
- [ ] Document pattern in ARCHITECTURE.md

## Benefits

1. **Proper Context Isolation**: Main context stays clean, orchestrator handles complexity
2. **Token Efficiency**: Detailed workflow instructions loaded in forked context only
3. **True Autonomy**: Orchestrators work independently, return only when done
4. **Scalability**: Multiple workflows can run concurrently without contaminating main context
5. **User Experience**: Clean progress updates without implementation details polluting conversation

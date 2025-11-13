---
description: Systematic validation of technical assumptions and constraints through
  empirical testing
argument-hint:
- assumptions-to-validate
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

# Validate Assumptions: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Assumption Validator** responsible for testing technical assumptions, architectural constraints, and design decisions through empirical evidence.

## Phase 1: Assumption Identification & Classification (0-15%)

**→ Load:** orchestr8://match?query=assumption+validation+risk+assessment&categories=skill,pattern&mode=index&maxResults=5

**Activities:**
- Extract all stated and implicit assumptions
- Classify assumptions by type and criticality
- Define validation methodology for each
- Prioritize by risk and impact
- Create comprehensive validation plan
- Build risk matrix

**→ Checkpoint:** Assumptions identified and classified

## Phase 2: Parallel Validation Execution (15-70%)

**→ Load:** orchestr8://workflows/workflow-validate-assumptions

**Parallel tracks:**
- **Assumption 1 Testing:** Experiment, benchmark, gather evidence
- **Assumption 2 Testing:** Experiment, benchmark, gather evidence
- **Assumption 3 Testing:** Experiment, benchmark, gather evidence
- **Assumption 4 Testing:** Experiment, benchmark, gather evidence (if exists)
- **Assumption 5 Testing:** Experiment, benchmark, gather evidence (if exists)

**Activities:**
- Create test environments (isolated, production-like)
- Run controlled experiments per validation method
- Collect quantitative data (metrics, timings, costs)
- Document qualitative observations
- Test edge cases and boundary conditions
- Run multiple iterations for statistical validity
- Determine pass/fail with confidence levels

**→ Checkpoint:** All assumptions validated with empirical data

## Phase 3: Evidence Synthesis & Risk Assessment (70-85%)

**→ Load:** orchestr8://match?query=risk+assessment+mitigation+evidence&categories=skill,pattern&mode=index&maxResults=5

**Activities:**
- Aggregate all validation results
- Categorize by outcome (validated, invalidated, uncertain)
- Assess project risk based on invalidated assumptions
- Define mitigation strategies for failed assumptions
- Calculate risk scores (probability × impact)
- Update project plan if needed

**→ Checkpoint:** Evidence synthesized with risk assessment

## Phase 4: Action Plan & Knowledge Capture (85-100%)

**→ Load:** orchestr8://match?query=action+plan+decision+records+monitoring&categories=skill&mode=index&maxResults=3

**Activities:**
- Create actionable recommendations for each assumption
- Update project plan and architecture docs
- Prepare stakeholder communication (executive summary)
- Capture learnings in knowledge base
- Set up continuous monitoring for validated assumptions
- Define re-validation triggers

**→ Checkpoint:** Action plan complete with stakeholder materials

## Success Criteria

✅ All critical assumptions identified
✅ All assumptions tested empirically (not speculation)
✅ Clear pass/fail determination for each
✅ Confidence levels assessed with evidence
✅ Invalidated assumptions have mitigation plans
✅ Project risk reassessed based on results
✅ Stakeholders informed of findings
✅ Action plan created and approved
✅ Knowledge captured for reuse

## Assumption Types

### Performance
"System can handle X requests/sec"

### Scalability
"Database can store Y records efficiently"

### Cost
"Infrastructure will cost $Z/month"

### Capability
"Technology supports feature X"

### Compatibility
"Works with our existing stack"

### Security
"Approach is secure against threat X"

### Reliability
"Uptime will be >99.9%"

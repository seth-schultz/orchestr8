# Orchestr8 Agent Prompts Analysis
## Comparing Current Approach to Simon Willison's Effective Prompt Techniques

**Analysis Date:** November 6, 2025  
**Project:** orchestr8 - Enterprise Multi-Agent Orchestration System  
**Scope:** Agent prompt structure, ambiguity handling, iterative refinement, and research task optimization

---

## Executive Summary

Orchestr8's current agent prompts are **well-structured for implementation tasks** with clear checklists, sequential phases, and quality gates. However, when compared to Simon Willison's emphasis on **clear objectives with specific constraints**, **iterative refinement**, and **systematic research approaches**, the system reveals opportunities for improvement—particularly in:

1. **Handling ambiguous/exploratory tasks** - Current prompts assume clear requirements upfront
2. **Iterative refinement loops** - Limited feedback mechanisms for prompt evolution
3. **Research and validation phases** - No systematic exploration before committing to approaches
4. **Constraint-based prompt design** - Constraints are implicit rather than explicit

**Key Finding:** Orchestr8 excels at **deterministic workflows** (known solution → implement → validate) but lacks **exploratory workflows** (unknown solution → research → learn → implement).

---

## Part 1: Current Agent Prompt Structure Analysis

### 1.1 Typical Agent Prompt Pattern (Current)

All agent prompts follow a consistent structure:

```markdown
---
name: [agent-name]
description: [what agent does]
model: [claude-model]
---

# [Agent Title]

[Agent persona and expertise]

## [Major Responsibility 1]
[Detailed instructions with examples]

## [Major Responsibility 2]
[Detailed instructions with examples]

## Output Format
[Expected deliverables]
```

**Example from architect.md (lines 1-50):**

```markdown
---
name: architect
description: Designs system architecture...
model: claude-haiku-4-5-20251001
---

# Software Architect Agent

You are an elite software architect...

## Core Responsibilities
1. System Design
2. Technology Selection
3. Architecture Patterns
...

## Design Principles
### SOLID Principles
- Single Responsibility...
```

### 1.2 Strengths of Current Approach

✅ **Clear Role Definition**
- Agent persona established immediately ("You are an elite...")
- Scope clearly defined (what the agent does)
- Expected capabilities listed

✅ **Comprehensive Checklists**
- code-reviewer.md has 10 major sections with sub-items
- security-auditor.md covers OWASP Top 10 systematically
- architect.md includes decision frameworks and technology matrices

✅ **Practical Examples**
- Code samples showing correct patterns
- API design examples
- Database schema examples

✅ **Output Specifications**
- Expected deliverables listed
- Format templates provided
- Success criteria defined

### 1.3 Weaknesses Compared to Simon's Approach

❌ **Vague Success Criteria**
- Many prompts use subjective language: "comprehensive", "thorough", "appropriate"
- Example from review-architecture.md: "Review architecture patterns and violations"
  - Better (Simon's approach): "Identify all layer violations, circular dependencies, and tight coupling between components. Rate severity as CRITICAL (breaks design), HIGH (violates principles), or MEDIUM (suboptimal)"

❌ **Implicit Rather Than Explicit Constraints**
- Constraints embedded in instructions, not stated upfront
- Example from test-engineer.md: "aim for >80% coverage"
  - Better: "Coverage MUST exceed 80%. If below, identify gaps and recommend additions. Fail if coverage below 80%."

❌ **No Iterative Refinement Loop**
- Prompts assume first pass is correct
- No "if output unsatisfactory, try alternative" guidance
- Example: add-feature.md has quality gates but no remediation guidance if gates fail

❌ **Ambiguous Task Handling**
- When requirements are unclear, agents are expected to "clarify with user"
- No structured approach to handling ambiguity
- No systematic exploration of alternatives

❌ **Research Phase Absent**
- Prompts jump from design to implementation
- No "What if we tried X instead of Y?" phase
- Validation only happens AFTER implementation (not before)

---

## Part 2: Deep Analysis - Specific Prompts

### 2.1 add-feature.md Workflow (Representative Example)

**Current Structure:**

```
Phase 1: Analysis & Design (0-20%)
├─ Requirements Analysis
├─ Design Implementation  
├─ Create Task Plan
└─ CHECKPOINT: Review plan with user

Phase 2: Implementation (20-70%)
├─ Backend Implementation
└─ Frontend Implementation

Phase 3: Quality Gates (70-90%)
├─ Code Review
├─ Testing Validation
├─ Security Audit
├─ Performance Analysis
└─ Accessibility

Phase 4: Documentation & Deployment (90-100%)
```

**Issue 1: Ambiguity in Phase 1**

Current text (line 56-97):
```
Tasks:
1. Requirements Analysis
   - Parse feature description
   - Identify scope (backend-only, frontend-only, or full-stack)
   - List affected components
   - Determine dependencies on existing code
   - Define clear acceptance criteria (measurable)
```

**Problem:** What if parsing reveals conflicting requirements? The prompt doesn't specify what to do. How many acceptance criteria? What makes them "clear"?

**Simon's Approach:**

```
Tasks:
1. Requirements Analysis
   CONSTRAINTS:
   - Acceptance criteria must be testable/measurable
   - Scope must be ONE of: backend-only, frontend-only, full-stack
   - List all affected components with file paths
   - For each dependency, rate as: BLOCKING, NEEDED, or OPTIONAL
   
   IF requirements are ambiguous:
   - Flag 3+ specific ambiguities
   - Propose specific resolutions (with tradeoffs)
   - DO NOT proceed to Phase 2 until resolved
   
   OUTPUT:
   - requirements-analysis.md (min 500 words)
   - Contains: scope, components, dependencies, acceptance criteria
   - If ambiguities found: marked [AMBIGUOUS] with proposed fixes
```

**Issue 2: No Alternative Exploration**

Current: Design immediately follows requirements  
Simon's approach: Propose alternatives before implementing

**Issue 3: Failed Quality Gates Have No Recovery**

Current prompts (lines 394-411):
```
Validation:
if [ ! -f "code-review-report.md" ]; then
  echo "❌ Code review not completed"
  exit 1
fi

if grep -q "CRITICAL" code-review-report.md; then
  echo "❌ Critical issues found"
  exit 1
fi
```

**Problem:** If critical issues are found, what happens? The workflow aborts with no remediation guidance.

**Simon's Approach:**

```
Validation:
if grep -q "CRITICAL" code-review-report.md; then
  CRITICAL_COUNT=$(grep -c "CRITICAL" code-review-report.md)
  
  # RECOVERY OPTION 1: Have reviewer provide specific fixes
  echo "❌ $CRITICAL_COUNT critical issues found"
  echo "RECOVERY: Running code-reviewer again with focus on fixes..."
  
  # Re-invoke code-reviewer with constraint:
  # "Address these specific critical issues: [list]. 
  #  Provide detailed fixes with file:line references."
  
  # If still failing after 2 attempts: escalate to architect
fi
```

### 2.2 review-architecture.md (Complex Orchestration)

**Current Structure:** 8 phases with explicit Task tool invocations

**Strengths:**
- Clear phase breakdown (0-15%, 15-30%, etc.)
- Parallel execution hint (line 141)
- Quality gates at each phase
- Comprehensive sections (SOLID, scalability, security, technical debt, API design)

**Weaknesses:**

**Issue 1: Prompts to Agents Are Vague**

Example from Phase 1 (lines 50-104):
```bash
prompt: "Analyze the system architecture and create a comprehensive map:

Scope: $1

Tasks:

1. **Identify Architecture Type**
   Use database queries to understand project structure:
   \`\`\`bash
   # Query for architectural patterns
   \`\`\`
   
   Determine if:
   - Monolith: Single app directory
   - Microservices: Multiple service directories
   - Serverless: Lambda/function directories
   - Layered: Clear layer separation
   - Clean/Hexagonal: Ports and adapters pattern
   - Event-Driven: Message/event infrastructure
   - CQRS: Separate read/write models
```

**Problem:** The agent is expected to infer architecture type but given vague heuristics. "Single app directory" could be many things.

**Simon's Approach:**

```bash
prompt: "Analyze and CLASSIFY system architecture:

INPUT: Scope = $1

TASK: Classify architecture as ONE of:
1. MONOLITH: All business logic in single deployable artifact
2. MICROSERVICES: 3+ independently deployable services
3. LAYERED: Organized as layers (presentation/business/persistence)
4. SERVERLESS: Functions as primary deployment unit
5. EVENT-DRIVEN: Message broker or event bus as core
6. CQRS: Separate read and write models

CONSTRAINTS (must meet ALL):
- Identify 3+ concrete evidence points (file paths, config, deployment)
- Rate confidence as HIGH/MEDIUM/LOW
- If evidence conflicts, document contradiction and list candidate types
- If unclear, ask specific follow-up questions

OUTPUT FORMAT:
## Architecture Classification

**Type:** [ONE OF ABOVE]
**Confidence:** [HIGH/MEDIUM/LOW]
**Evidence:**
1. [specific finding with path]
2. [specific finding with path]
3. [specific finding with path]

**Rationale:** [Why this classification]

[If unclear:]
**Ambiguities Found:**
- [specific ambiguity]
**Candidate Types:** [alternative classifications]
**Recommended Action:** [specific next step]
"
```

**Issue 2: No Prioritization for Large Codebases**

Current: Review ALL architecture dimensions equally  
Problem: Large systems might need focused analysis

**Simon's Approach:** Ask upfront:

```
PHASE 0: Scope Definition (Ask user)
"Review full architecture or focus on:
 - [ ] Overall structure and patterns (RECOMMENDED)
 - [ ] Scalability concerns (high-traffic system?)
 - [ ] Security architecture (sensitive data?)
 - [ ] Technical debt (legacy system?)
 - [ ] Performance bottlenecks (latency critical?)
 
Select FOCUS area. Adjusts effort/depth accordingly."
```

### 2.3 code-reviewer.md (Validation Agent)

**Current Approach:** 10-point checklist with examples

**Strengths:**
- Comprehensive coverage (SOLID, security, testing, etc.)
- Examples of good and bad comments (lines 294-336)
- Severity levels (🔴 CRITICAL, 🟡 MAJOR, 🔵 MINOR, 💡 SUGGESTION)

**Weaknesses:**

**Issue 1: Vague Severity Criteria**

Current (line 255):
```
Note issues by severity:
  * 🔴 **Critical**: Must fix (security, data loss, crashes)
  * 🟡 **Major**: Should fix (bugs, poor practices)
  * 🔵 **Minor**: Nice to fix (style, readability)
  * 💡 **Suggestion**: Consider for improvement
```

**Problem:** What constitutes "security"? What's a "crash"?

**Simon's Approach:**

```
SEVERITY RULES (apply in order):
1. 🔴 CRITICAL: Fails security audit (OWASP violation)
              OR causes data loss
              OR crashes on valid input
              OR bypasses authentication/authorization
              
2. 🟡 MAJOR: Performance issue (>500ms response)
           OR code smell affecting >10% of code
           OR violates team's SOLID enforcement
           OR test coverage drops below 80%
           
3. 🔵 MINOR: Style/naming improvement
            OR refactoring that doesn't affect behavior
            OR documentation gap
            
4. 💡 SUGGESTION: Design improvement
                 OR learning opportunity
                 OR nice-to-have enhancement

IF issue could be CRITICAL or MAJOR: Apply CRITICAL rule
(Default to severity, not optimism)
```

**Issue 2: No Actionable Examples**

Current (lines 294-336) show comment patterns, but don't show how to iterate.

What if developer doesn't understand comment? How does code-reviewer respond?

---

## Part 3: Simon Willison's Effective Prompt Techniques

### 3.1 Core Principles Identified

Based on research into Simon Willison's approach:

**1. Clear Objectives with Specific Constraints**
- State exact goals upfront
- Make constraints explicit and measurable
- Example: "Write summary of 3 sentences or less" (not "write brief summary")

**2. Format Specifications**
- Define output structure explicitly
- Example: "Return JSON with fields: task, status, confidence. No other text."

**3. Handling Ambiguity**
- Structured approach to unclear requirements
- Flag ambiguities explicitly
- Propose specific resolutions with tradeoffs

**4. Iterative Refinement**
- Treat prompting as iterative: Output → Evaluate → Refine
- Include "if X, then Y" conditions for recovery
- Systematic feedback loops

**5. Research Before Implementation**
- Explore alternatives before committing
- Validate assumptions through hypothesis testing
- Document findings for future decisions

**6. Constraint-Based Design**
- Use constraints to limit scope (prevents meandering)
- Defensive prompting with rules and boundaries
- Explicit success/failure criteria

### 3.2 How to Apply to Orchestr8

**Technique 1: Explicit Constraints in All Prompts**

❌ Current (fuzzy):
```
"Design for scalability and maintainability"
```

✅ Simon's approach (explicit):
```
CONSTRAINTS:
- Must support 10,000 concurrent users (horizontal scaling)
- Deployment time <5 minutes (stateless design)
- All components independently testable (dependency injection)
- No monolithic god objects (classes <500 lines)
```

**Technique 2: Structured Ambiguity Handling**

❌ Current (vague):
```
"If unclear, ask user for clarification"
```

✅ Simon's approach (structured):
```
IF requirements contain ambiguity:
1. Flag specific ambiguity (quote exact text)
2. Propose 2-3 interpretations with tradeoffs
3. Recommend interpretation with rationale
4. Ask user to confirm OR propose alternative
5. DO NOT proceed until resolved

FORMAT:
## Ambiguities Found
- **Ambiguity:** [specific text causing confusion]
  **Option 1:** [interpretation + tradeoffs]
  **Option 2:** [interpretation + tradeoffs]
  **Recommendation:** [which option why]
```

**Technique 3: Explicit Success Criteria**

❌ Current:
```
"Comprehensive code review"
```

✅ Simon's approach:
```
SUCCESS CRITERIA (ALL must be met):
- Every method <50 lines (check cyclomatic complexity <10)
- No duplicate code >10 lines (DRY principle)
- SOLID principles assessed (SRP, OCP, LSP, ISP, DIP)
- Test coverage >80% (automated measurement)
- No OWASP violations (specific checklist)
- Documentation covers "why" not "what"

OUTPUT: Structured report with:
- Issues found (with file:line references)
- Severity (CRITICAL/MAJOR/MINOR using explicit rules)
- Remediation (specific steps, not vague suggestions)
```

**Technique 4: Iterative Refinement Loops**

Add to workflows (currently missing):

```
PHASE N+1: Validation & Remediation Loop

IF quality gates fail (critical issues found):
  
  LOOP (max 3 iterations):
    1. Agent reviews specific failing criteria
    2. Proposes targeted fixes
    3. Implements fixes (or reasons why not possible)
    4. Re-runs quality gate
    5. IF PASS: continue to next phase
    6. IF FAIL: escalate to architect for redesign
    
  ESCALATION (if 3 iterations fail):
    - Architect reviews design assumptions
    - May require backtracking to Phase 1 (requirements)
    - Documents lessons learned
```

**Technique 5: Research Phase (Missing)**

Add new workflow for exploratory tasks:

```
/orchestr8:research-approach "Compare API design patterns for user service"

WORKFLOW:
Phase 1: Define Research Objective
- What are we trying to learn?
- What constraints apply? (performance, scalability, team skill)
- What are success criteria?

Phase 2: Propose Alternatives
- REST API
- GraphQL
- gRPC
- tRPC

Phase 3: Prototype & Evaluate (PARALLEL)
- researcher-agent: Build quick prototypes
- performance-analyzer: Benchmark each
- security-auditor: Assess security of each
- test-engineer: Evaluate testability

Phase 4: Compare & Recommend
- Document findings
- Tradeoff analysis
- Recommend approach with rationale
- Document assumptions to validate later

Phase 5: Implement Recommended Approach
- Use findings to inform implementation
- Include research results in ADR
```

---

## Part 4: Specific Improvements for Orchestr8

### 4.1 Agent Prompt Template (Current vs. Improved)

**Current Template Structure:**

```markdown
---
name: [agent]
description: [what it does]
model: [model]
---

# Agent Title
You are a...

## [Section]
[Instructions with examples]

## [Section]
[Instructions]

## Output Format
[Expected deliverables]
```

**Improved Template (Simon's Approach):**

```markdown
---
name: [agent]
description: [what it does]
model: [model]
---

# Agent Title
You are a...

## Clear Objective
[Explicit goal in 1-2 sentences]

## Constraints (MUST ALL BE MET)
- [Specific, measurable constraint]
- [Specific, measurable constraint]
- [Specific, measurable constraint]

## Scope
- [What IS included]
- [What IS NOT included]

## Key Responsibilities
## [Detailed sections with examples]

## Handling Ambiguity
IF input is ambiguous:
1. Flag specific ambiguity
2. Propose 2-3 interpretations with tradeoffs
3. Recommend one with rationale
4. Ask user to confirm

## Iterative Refinement
IF output unsatisfactory:
- [Specific diagnostic criteria]
- [Alternative approach to try]
- [When to escalate]

## Success Criteria
- [Measurable criterion 1]
- [Measurable criterion 2]
- [Measurable criterion 3]

## Output Format
[Exact structure expected]

## Examples
[Good example output]
[Bad example output with explanation]
```

### 4.2 Recommended Changes to Specific Agents

**Architect Agent Improvements:**

Currently (line 9): "You are an elite software architect specializing in designing..."

Should add explicit constraints upfront:

```markdown
## Clear Objective
Design a system architecture that meets current and future requirements while balancing ideal design with practical constraints.

## Constraints (NON-NEGOTIABLE)
- Deliverable must be implementable by team in 3 months
- Architecture pattern must fit team size (< 50 engineers → avoid microservices)
- Technology choices must use only approved stack
- All decisions documented as Architecture Decision Records (ADRs)

## Ambiguity Protocol
If requirements don't specify:
- Scalability: Assume 1,000 concurrent users (not 1M) unless stated
- Availability: Assume 99.9% uptime unless stated
- Technology: Stick to proven choices (avoid experimental tech)
- Team skill: Ask about unfamiliar technologies

## Success Criteria
- ADRs created for 3+ key decisions
- Technology stack fully justified (tradeoff analysis)
- Architecture can be drawn (and explained to non-engineers)
- Scalability path defined (growth from current load to 10x)
- Security architecture reviewed by security-auditor
```

**Code-Reviewer Agent Improvements:**

Currently (lines 254-258): Severity criteria are vague

Should formalize:

```markdown
## Severity Classification Rules

Apply in this order:

🔴 CRITICAL (Block merge):
  - Security: Any OWASP violation (injection, XSS, broken auth, etc.)
  - Data: Risk of data loss or corruption
  - Crashes: Crashes on valid input
  - Dependency: Blocks other work
  - Example: SQL injection, hardcoded secrets, null pointer on normal input

🟡 MAJOR (Request changes):
  - Performance: API response >500ms (p50) or >1s (p95)
  - Code smell: >20% code duplication
  - Missing tests: Coverage <80%
  - Architecture: Violates team SOLID enforcement
  - Example: N+1 query problem, untested error path, god class

🔵 MINOR (Nice to fix):
  - Naming: Variable/function names unclear
  - Style: Doesn't match team conventions
  - Documentation: Missing explanatory comments
  - Refactoring: Code works but could be cleaner
  - Example: Rename variable, add comment, extract method

💡 SUGGESTION (No action required):
  - Learning: "Consider reading X for optimization insight"
  - Future: "When you refactor, consider Y pattern"
  - Example: Suggest library upgrade, mention relevant design pattern
```

**Test-Engineer Agent Improvements:**

Add explicit coverage rules:

```markdown
## Test Coverage Requirements

- Critical business logic: 100% branch coverage
- API endpoints: 100% path coverage (all status codes)
- Edge cases: 100% (nulls, empty arrays, negative numbers, etc.)
- Error conditions: 100% (all error paths tested)
- Happy path: 100%
- Overall: ≥80% line coverage

IF coverage <80%: Flag as CRITICAL and list gaps
IF coverage 80-90%: Flag as MAJOR and recommend additions
IF coverage >90%: Flag as suggestion for remaining gaps

Test Quality Rules:
- Each test name describes scenario
- Tests are independent (no ordering dependencies)
- No test >30 lines (split if longer)
- Mocks only external dependencies (not internal code)
```

### 4.3 New Workflows to Support Research

**Add: /orchestr8:research-feature**

```markdown
---
description: Systematically research and validate approach before implementing feature
argument-hint: [feature-description]
model: claude-sonnet-4-5-20250929
---

# Research Feature Workflow

Systematically explore and validate the BEST approach for a feature before implementation begins.

## Phase 1: Define Research Objective (0-10%)

**Clear Objective:** Determine optimal approach for feature

**Constraints:**
- Must propose 2-3 distinct approaches
- Must define metrics for comparison
- Must include prototype/POC for each
- Research limited to 1-2 hours per approach

## Phase 2: Propose Alternatives (10-25%)

**Approach A:** [First proposed pattern]
- Pros:
- Cons:
- Complexity:
- Risk:
- Estimated effort:

**Approach B:** [Alternative]
...

**Approach C:** [If applicable]
...

## Phase 3: Prototype & Evaluate (25-75%)

Run in parallel:
- Build quick POC for each approach
- Benchmark (speed, memory, complexity)
- Evaluate maintainability
- Assess testability
- Security analysis

## Phase 4: Compare & Recommend (75-90%)

Create comparison matrix:
- Performance metrics
- Code complexity
- Team familiarity
- Long-term maintainability
- Risk assessment

**Recommendation:** Approach [X] because...
**Rationale:** [specific tradeoff analysis]

## Phase 5: Document Assumptions & Next Steps (90-100%)

Create Architecture Decision Record:
- What we learned
- Why we chose this approach
- Assumptions to validate during implementation
- Alternative approaches for future consideration
```

### 4.4 Enhanced Quality Gate with Remediation

**Current:** Gates are binary (pass/fail)

**Improved:** Gates include remediation loops

```markdown
## Quality Gate: Code Review (Enhanced)

### Step 1: Review Code

[Standard code review process]

### Step 2: Evaluate Results

IF no issues: ✅ PASS
IF MINOR issues: ✅ PASS (note for author)
IF MAJOR issues: 
  GO TO Step 3 (Remediation)
IF CRITICAL issues:
  GO TO Step 4 (Escalation)

### Step 3: Remediation Loop (MAJOR issues)

LOOP (max 2 iterations):
  1. Code-reviewer proposes specific fixes
  2. Developer implements fixes
  3. Re-run code review on fixes
  4. IF PASS: Continue
  5. IF still MAJOR: Go to Step 4

### Step 4: Escalation (CRITICAL or 2x failed remediation)

1. Architect reviews design
2. Determine if issue is:
   - Implementation bug (fixable)
   - Design flaw (requires redesign)
   - Requirements unclear (go back to Phase 1)
3. Document findings
4. Plan remediation

### Step 5: Execute Remediation

Based on diagnosis:
- Minor: Fix in current code
- Design: Refactor
- Requirements: Restart feature analysis
```

---

## Part 5: Opportunities for Improvement

### 5.1 Handling Ambiguous/Exploratory Tasks

**Current:** Limited support for "I don't know the best approach" scenarios

**Needed:** Structured research workflow

**Recommendation:**

Add `/orchestr8:research-problem` for exploratory tasks:

```bash
/orchestr8:research-problem "How should we design notifications? 
Requirements: real-time, persistent, user-configurable"

WORKFLOW:
1. Define research questions
   - What are viable patterns? (webhooks, polling, WebSockets, etc.)
   - What are tradeoffs? (complexity, latency, scalability)
   - Which fit our constraints? (team size, budget, timeline)

2. Propose alternatives
   - Pattern A: [description + pros/cons]
   - Pattern B: [description + pros/cons]
   - Pattern C: [description + pros/cons]

3. Prototype & compare
   - Build POCs for each
   - Benchmark performance
   - Evaluate implementation complexity
   - Assess maintenance overhead

4. Recommend & document
   - Choose approach
   - Document tradeoffs
   - Create ADR
   - Plan implementation
```

### 5.2 Iterative Refinement Capability

**Current:** One-pass implementation with validation only at end

**Needed:** Explicit refinement loops with feedback

**Recommendation:**

All agents should include:

```markdown
## If Output Is Unsatisfactory

**Diagnostic Process:**
1. What aspect doesn't meet requirements? (Be specific)
2. Is it a change request (requirements) or quality issue (execution)?
3. Request specific changes, not vague improvements

**Example Good Request:**
"Code review rated this as MAJOR but no specific fixes provided.
Request: For each MAJOR issue, provide:
- File:line reference
- Specific problem (quote exact code)
- Specific fix (code example)"

**Example Bad Request:**
"Make it better"
```

### 5.3 Research-Focused Agents (New)

Create `/agents/research/` with agents focused on exploration:

```
research/
├─ code-researcher.md         # Explores implementation alternatives
├─ assumption-validator.md    # Tests design assumptions
├─ pattern-evaluator.md       # Compares design patterns
├─ performance-researcher.md  # Benchmarks approaches
└─ integration-explorer.md    # Tests integration strategies
```

Each would follow Simon's research methodology:
- Define hypothesis
- Propose alternatives
- Run experiments
- Document findings
- Recommend approach

### 5.4 Constraint-Based Prompt Refinement

**Current:** Constraints implied in instructions

**Improved:** Constraints explicit and upfront

**Example - Before:**
```
Design a scalable system.
```

**Example - After:**
```
CONSTRAINTS (must all be satisfied):
- Must scale to 10,000 concurrent users (horizontal scaling)
- API response time <200ms (p50) <500ms (p95)
- Deployment time <5 minutes (stateless, immutable containers)
- Team has 5 backend engineers
- Use approved stack only (Node.js, Python, PostgreSQL, Redis)
```

---

## Part 6: Comparison Matrix

| Dimension | Current Orchestr8 | Simon's Approach | Opportunity |
|-----------|------------------|-----------------|-------------|
| **Objective Clarity** | ✅ Clear role | ✅ Clear + constraints | Add explicit constraints |
| **Handling Ambiguity** | ⚠️ Ask user | ✅ Flag + propose | Structured ambiguity protocol |
| **Success Criteria** | ✅ Listed | ✅ Explicit rules | Formalize criteria (measurable) |
| **Iterative Refinement** | ⚠️ One pass | ✅ Multiple passes | Add refinement loops |
| **Research Phase** | ❌ Missing | ✅ Before implementing | Add research workflow |
| **Constraint Explicitness** | ⚠️ Implicit | ✅ Explicit | Make constraints upfront |
| **Error Recovery** | ❌ Fails hard | ✅ Structured recovery | Add remediation flows |
| **Documentation** | ✅ Good | ✅ Excellent | Document decision rationale |
| **Exploratory Tasks** | ❌ Not designed for | ✅ Supported | New research agents |
| **Learning/Knowledge Capture** | ⚠️ Implicit | ✅ Explicit | Create learnings repository |

---

## Part 7: Implementation Roadmap

### Phase 1: Immediate (This Month)

**Quick wins requiring minimal changes:**

1. **Enhance architect.md**
   - Add explicit constraints section
   - Define ambiguity handling protocol
   - Add "Alternative Approaches" section before recommending one

2. **Enhance code-reviewer.md**
   - Formalize severity rules
   - Add iterative refinement guidance
   - Include "recovery path" for MAJOR issues

3. **Enhance test-engineer.md**
   - Explicit coverage rules
   - Add gap analysis (if <80%, list specific gaps)
   - Include test quality rules

4. **Create ambiguity template**
   - All agents should follow when encountering unclear requirements
   - Structured format: Flag → Propose → Recommend → Confirm

### Phase 2: Short-term (Next Month)

**Structural improvements:**

5. **Add research workflow**
   - `/orchestr8:research-approach` for exploratory decisions
   - Template for comparing alternatives
   - Benchmark/evaluation framework

6. **Add remediation flows**
   - All workflows should handle failed quality gates
   - Specify escalation criteria
   - Document lessons learned

7. **Create constraint templates**
   - Generic constraints (scalability, performance, security)
   - Use in all agent prompts
   - Make explicit upfront

### Phase 3: Medium-term (Q1 2026)

**New agent layer:**

8. **Research agent category**
   - code-researcher: Explore implementation alternatives
   - assumption-validator: Test design assumptions
   - pattern-evaluator: Compare design patterns
   - performance-researcher: Benchmark approaches

9. **Enhanced orchestrators**
   - Add research phase option to feature-orchestrator
   - Add assumption validation to project-orchestrator
   - Create "research-then-build" workflows

10. **Knowledge capture system**
    - Document all research findings
    - Store comparison results
    - Reference in future decisions (learning repository)

---

## Part 8: Specific Code Examples

### 8.1 Current Prompt (architect.md) vs. Improved

**Current (Lines 9-19):**

```markdown
# Software Architect Agent

You are an elite software architect specializing in designing scalable, maintainable, 
and secure systems. You make strategic technology decisions and create comprehensive 
technical specifications.

## Core Responsibilities

1. **System Design**: Create high-level architecture and component designs
2. **Technology Selection**: Choose appropriate technologies, frameworks, and tools
3. **Architecture Patterns**: Apply proven architectural patterns
...
```

**Improved (Adds constraints upfront):**

```markdown
# Software Architect Agent

You are an elite software architect specializing in designing systems that balance 
ideal architecture with practical constraints.

## Clear Objective
Design system architecture that:
- Meets current requirements
- Scales to 10x current load
- Is maintainable by team size
- Aligns with approved technology stack

## Constraints (MUST ALL BE MET)
- Architecture implementable within 3 months
- Fits team skill level (clarify if unsure)
- Uses only approved technologies (clarify if needed)
- Technology choices documented with tradeoffs
- All decisions recorded as ADRs

## Core Responsibilities

1. **System Design**: Create high-level architecture and component designs
2. **Technology Selection**: Choose appropriate technologies WITH TRADEOFF ANALYSIS
3. **Architecture Patterns**: Apply proven patterns (document why chosen)
...

## If Requirements Are Ambiguous

**Flag-and-Propose Protocol:**
1. Quote the ambiguous requirement
2. Propose 2-3 interpretations with tradeoffs
3. Recommend interpretation with rationale
4. Ask user to confirm or propose alternative
5. Document assumption for validation during implementation

Example:
- **Ambiguous:** "System must be scalable"
- **Interpretation A:** Horizontal scaling (add servers) vs.
- **Interpretation B:** Vertical scaling (bigger server) vs.
- **Interpretation C:** No scaling anticipated (single server)
- **Recommendation:** Interpretation A (most common), unless:
  - Prediction: [budget constraint → C]
  - Prediction: [single team → B]
  - Prediction: [millions of users → A]

## Success Criteria
- [ ] Architecture diagram created (text-based ok)
- [ ] 3+ ADRs created (decisions documented)
- [ ] Technology stack fully justified
- [ ] Scalability plan (current → 10x load)
- [ ] Security architecture designed
- [ ] Team confirms they can implement design
```

### 8.2 Current add-feature Workflow vs. Improved

**Current (Lines 44-97):**

```markdown
## Phase 1: Analysis & Design (0-20%)

**⚡ EXECUTE TASK TOOL:**
\`\`\`
Use the requirements-analyzer agent to:
1. Read and understand feature description
2. Identify affected components (frontend, backend, database)
3. List dependencies on existing code
4. Define acceptance criteria
5. Create detailed task plan
\`\`\`

Expected outputs:
- requirements-analysis.md
- design-document.md
- TodoWrite task list initialized
```

**Improved (Adds explicit constraints and ambiguity handling):**

```markdown
## Phase 0: Clarify Requirements (0-10%) [NEW]

**🎯 Explicit Objective:** Ensure all requirements are clear and unambiguous

**🚧 CONSTRAINTS (MUST ALL BE MET):**
- Requirements must be testable (not vague like "fast" or "user-friendly")
- Scope must be clear: Is this backend-only, frontend-only, or full-stack?
- Acceptance criteria must be measurable (e.g., "< 200ms response time")
- All dependencies must have clear ownership

**Ambiguity Resolution Protocol:**
IF feature description contains ambiguity:
  1. Flag specific ambiguous text
  2. Propose 2-3 interpretations with pros/cons
  3. Recommend interpretation with rationale
  4. Ask user to confirm
  5. DO NOT proceed to Phase 1 until confirmed

Example:
- **Ambiguous:** "Users should get notifications"
  - **Option A:** Instant (WebSocket-based, complex)
  - **Option B:** Near-instant polling (simpler, higher latency)
  - **Option C:** Batch notifications (daily digest)
  - **Recommendation:** Option A unless performance-constrained

## Phase 1: Analysis & Design (10-25%) [UPDATED]

**Clear Objective:** Decompose feature into concrete, testable requirements

**Task Inputs:**
- Feature description (clarified in Phase 0)
- Scope: [frontend | backend | full-stack] ← MUST BE SPECIFIED
- Team context: [team size, skills, constraints]
- Technical context: [existing architecture, frameworks]

**Task Outputs (ALL REQUIRED):**

1. **requirements-analysis.md** (min 500 words)
   - Feature scope (backend-only, frontend-only, full-stack)
   - Acceptance criteria (at least 5, all testable)
   - Affected components (with file paths)
   - Dependencies (rated BLOCKING | NEEDED | OPTIONAL)
   
2. **design-document.md** (min 800 words)
   - API contracts (if backend changes)
   - UI mockups (if frontend changes)
   - Database schema (if data model changes)
   - Error handling strategy
   - Testing strategy

3. **TodoWrite task list**
   - Database migrations (if needed)
   - Backend tasks
   - Frontend tasks
   - Integration tasks
   - Test tasks
   - Documentation tasks

**Quality Gate: Requirements Validation**

✅ PASS if:
- All acceptance criteria are testable
- Scope is single category (not ambiguous)
- All dependencies identified and rated
- Team confirms understanding

❌ FAIL if:
- Vague acceptance criteria ("should be fast")
- Ambiguous scope (mix of frontend/backend without clear separation)
- Missing dependencies

🔄 IF FAIL: Re-run Phase 0 (Clarify Requirements)

## Phase 1B: Alternative Approaches [NEW]

**If feature is complex or has multiple viable approaches:**

Propose 2-3 alternatives:
- **Approach A:** [description] (pros/cons, complexity, timeline)
- **Approach B:** [description] (pros/cons, complexity, timeline)
- **Approach C:** [description] (pros/cons, complexity, timeline)

**Recommend:** Approach X because [specific tradeoff rationale]

Confirm with user before proceeding to Phase 2
```

---

## Part 9: Success Metrics

To validate improvements, measure:

1. **Prompt Clarity**
   - Reduction in "clarification requests" during Phase 1
   - Target: <5% of features need clarification

2. **Ambiguity Resolution**
   - Adoption of flag-and-propose protocol
   - Time spent resolving ambiguities
   - Target: <15 minutes per feature

3. **Quality Gate Success**
   - Reduction in failed quality gates
   - Reduction in iteration loops
   - Target: >95% pass on first attempt

4. **Iterative Refinement**
   - Track remediation loop usage
   - Measure time to resolution
   - Target: 2x speedup from current 3-iteration average

5. **Research Adoption**
   - Number of features using research workflow
   - Quality of documented decisions (ADR completeness)
   - Target: >50% of complex features use research phase

---

## Conclusion

Orchestr8's agent prompts are well-designed for **deterministic implementation workflows** with clear requirements and known approaches. However, by adopting Simon Willison's emphasis on:

1. **Explicit constraints** (upfront, measurable)
2. **Structured ambiguity handling** (flag → propose → confirm)
3. **Iterative refinement loops** (try → evaluate → refine → escalate)
4. **Research before implementation** (explore → validate → decide)
5. **Constraint-based design** (prevent meandering, focus direction)

Orchestr8 can become significantly more effective at:

- **Exploratory/research tasks** (unknown best approach)
- **Complex features** (multiple viable strategies)
- **Ambiguous requirements** (unclear specifications)
- **Iterative development** (incremental refinement)
- **Learning & knowledge capture** (future decision support)

The opportunities are high-impact but low-effort—primarily refinements to existing agent prompts and the addition of research-focused workflows.

---

**Analysis completed:** November 6, 2025  
**Recommended action:** Review Phase 1 improvements (architect, code-reviewer, test-engineer enhancements) for immediate adoption

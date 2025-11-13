---
id: workflow-validate-assumptions
category: pattern
tags: [workflow, assumptions, validation, verification, evidence, risk-mitigation, testing]
capabilities:
  - Assumption extraction from architecture and design
  - Evidence-based validation methodology
  - Risk assessment for invalid assumptions
  - Spike and POC planning for uncertain assumptions
  - Assumption documentation and tracking
useWhen:
  - Assumption validation requiring hypothesis testing, prototype development, measurement, and decision adjustment
  - Technical assumption verification needing empirical testing, benchmark validation, and risk assessment
estimatedTokens: 450
---

# Assumption Validation Pattern

**Methodology:** Extract → Categorize → Validate → Document

**Critical:** Invalid assumptions cause expensive late-stage failures. Validate early.

## Phase 1: Assumption Extraction (0-25%)
**Goals:** Identify all implicit and explicit assumptions

**→ Load Skills:** `orchestr8://skills/match?query=requirement+analysis+risk&mode=index&maxResults=3`

**Sources to Mine:**
- Architecture documents and diagrams
- Technology selection decisions
- Performance and scalability estimates
- Integration and API contracts
- Team capability assessments
- Timeline and resource projections

**Assumption Types:**
- **Technical:** "Library X supports feature Y"
- **Performance:** "Database can handle 10K QPS"
- **Integration:** "Third-party API response time <200ms"
- **Team:** "Team has expertise in technology Z"
- **Business:** "Users will adopt feature A"
- **Timeline:** "Migration can complete in 2 weeks"

**Output:** Comprehensive assumption inventory (20-40 items typical)

## Phase 2: Risk Categorization (25-45%)
**Goals:** Prioritize assumptions by risk

**Risk Matrix:**
```
Impact if Wrong × Confidence Level = Priority

High Impact + Low Confidence = CRITICAL (validate immediately)
High Impact + Medium Confidence = HIGH (validate soon)
High Impact + High Confidence = MEDIUM (document evidence)
Low Impact + Low Confidence = LOW (monitor)
```

**Assessment Questions:**
1. **Impact:** What breaks if this assumption is wrong?
2. **Confidence:** How certain are we this is true? (evidence vs guess)
3. **Validation Cost:** Time/effort to verify
4. **Validation Timeline:** How soon can we test this?

**Prioritization:**
- Critical: Validate before proceeding
- High: Validate in current sprint
- Medium: Validate before feature using it
- Low: Document and monitor

**Output:** Risk-prioritized assumption list

## Phase 3: Validation Execution (45-85%)
**Goals:** Gather evidence for each assumption

**Validation Methods by Type:**

**Technical Assumptions:**
- ✅ **Code spike:** Build minimal POC (2-4 hours)
- ✅ **Documentation review:** Read official docs thoroughly
- ✅ **Community check:** Search issues, Stack Overflow, forums
- ✅ **Version verification:** Ensure feature exists in target version

**Performance Assumptions:**
- ✅ **Benchmark:** Run realistic load tests
- ✅ **Math:** Calculate theoretical limits (connections, memory, CPU)
- ✅ **Production data:** Analyze real metrics if available
- ✅ **Vendor specs:** Verify published performance numbers

**Integration Assumptions:**
- ✅ **API testing:** Call actual endpoints with realistic data
- ✅ **Contract review:** Read API docs, schemas, SLAs
- ✅ **Error scenarios:** Test failure modes and edge cases
- ✅ **Vendor communication:** Confirm assumptions with provider

**Team Assumptions:**
- ✅ **Skills assessment:** Direct conversation with team members
- ✅ **Test task:** Small proof-of-competency exercise
- ✅ **Training plan:** Identify gaps and training needs
- ✅ **Ramp-up time:** Realistic timeline for learning curve

**Validation Outcomes:**
- ✅ **VALIDATED:** Assumption confirmed with evidence
- ⚠️ **PARTIAL:** Assumption partially true (needs adjustment)
- ❌ **INVALID:** Assumption proven false (needs pivot)
- 🔄 **UNCERTAIN:** Need more testing (plan spike/POC)

**Output:** Evidence-backed validation results

## Phase 4: Documentation & Mitigation (85-100%)
**Goals:** Document findings and plan mitigations

**For Validated Assumptions:**
- Document evidence and sources
- Note any caveats or conditions
- Schedule re-validation if time-sensitive

**For Invalid Assumptions:**
- Assess impact on architecture/timeline
- Identify alternative approaches
- Update designs and plans
- Communicate to stakeholders

**For Uncertain Assumptions:**
- Plan spike or POC (time-boxed research)
- Define success criteria for spike
- Set decision deadline
- Identify fallback plan

**Assumption Log Format:**
```markdown
## Assumption: [Description]
**Category:** Technical/Performance/Integration/Team/Business
**Impact if Wrong:** High/Medium/Low
**Confidence:** High/Medium/Low
**Priority:** Critical/High/Medium/Low

**Validation Method:** [How tested]
**Evidence:** [Results, data, sources]
**Status:** ✅ Validated / ⚠️ Partial / ❌ Invalid / 🔄 Uncertain

**Implications:**
- [What this means for the project]

**Mitigations:**
- [Actions if assumption proves wrong]
```

**Output:** Assumption validation report with mitigations

## Critical Success Factors

⚠️ **Validate high-impact assumptions BEFORE commitment**
⚠️ **Gather real evidence, not opinions**
⚠️ **Plan fallbacks for uncertain assumptions**
⚠️ **Document assumptions for future reference**
⚠️ **Re-validate assumptions as context changes**

## Success Criteria
- All critical assumptions validated with evidence
- Invalid assumptions identified with pivot plans
- Uncertain assumptions have time-boxed spike/POC plans
- Assumption log maintained and accessible
- Risk significantly reduced before major commitments

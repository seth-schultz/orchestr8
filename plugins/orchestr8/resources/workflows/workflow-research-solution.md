---
id: workflow-research-solution
category: pattern
tags: [workflow, research, problem-solving, solution-design, requirements, feasibility]
capabilities:
  - Solution-focused research methodology
  - Problem-to-solution pathway analysis
  - Feasibility assessment and validation
useWhen:
  - Solution research requiring problem analysis, technology evaluation, feasibility assessment, and recommendation
  - Technical investigation needing web search, documentation review, community feedback analysis, and prototype validation
estimatedTokens: 520
---

# Solution-Focused Research Workflow

**Phases:** Problem Definition (0-20%) → Solution Research (20-70%) → Validation (70-100%)

Research methodology optimized for finding and validating solutions to specific problems.

## Phase 1: Problem Definition (0-20%)

**Clarify the problem:**
```markdown
□ What is the core problem to solve?
□ What are the constraints?
  - Technical limitations
  - Time/budget constraints
  - Team capabilities
  - Existing systems/dependencies
□ What defines success?
□ What are must-haves vs nice-to-haves?
```

**Extract requirements:**
```markdown
Functional requirements:
- What must the solution do?
- What inputs/outputs are expected?
- What scale/performance needed?

Non-functional requirements:
- Security considerations
- Maintainability needs
- Integration requirements
- Compliance constraints
```

**Frame research questions:**
```markdown
Primary: "How to [solve problem] given [constraints]?"

Supporting:
- What approaches exist for this problem?
- What have others used successfully?
- What are the trade-offs between options?
- What are the implementation risks?
```

**Identify prior art:**
- Has this been solved internally before?
- Are there existing libraries/frameworks?
- What do competitors/peers do?
- Are there open-source solutions?

## Phase 2: Solution Research (20-70%)

**Parallel investigation tracks:**

**Track A: Existing Solutions (20-40%)**
```markdown
Search for:
□ Open-source libraries/frameworks
□ SaaS/managed services
□ Internal existing implementations
□ Community solutions (GitHub, npm, etc.)

Evaluate each:
- Maturity and maintenance
- Feature fit (does it solve our problem?)
- License compatibility
- Community/support
- Documentation quality
```

**Track B: Implementation Approaches (30-55%)**
```markdown
Research:
□ Common patterns for this problem
□ Architecture options
□ Technology stack choices
□ Integration strategies

Sources:
- Orchestr8 patterns: orchestr8://patterns/match?query=${problem}
- Technical blogs and articles
- Official documentation
- Case studies
```

**Track C: Proof of Concept (40-65%)**
```markdown
For promising solutions:
□ Review example implementations
□ Check code quality and patterns
□ Assess complexity of integration
□ Identify potential blockers

Quick feasibility tests:
- Can we run minimal example?
- Does it work with our stack?
- Are there obvious integration issues?
```

**Track D: Trade-off Analysis (50-70%)**
```markdown
Compare options across:
| Criterion | Solution A | Solution B | Solution C |
|-----------|------------|------------|------------|
| Feature fit | 9/10 | 7/10 | 8/10 |
| Complexity | 6/10 | 9/10 | 7/10 |
| Performance | 8/10 | 7/10 | 9/10 |
| Maintenance | 7/10 | 9/10 | 6/10 |
| Cost | 9/10 | 6/10 | 8/10 |

Consider:
- Initial implementation effort
- Long-term maintenance burden
- Team learning curve
- Vendor lock-in risks
- Scalability limits
```

## Phase 3: Validation & Recommendation (70-100%)

**Validate top solution(s):**
```markdown
For the leading option(s):

Technical validation:
□ Prototype or spike implementation
□ Integration with existing system
□ Performance testing if critical
□ Security review if applicable

Risk assessment:
□ What could go wrong?
□ What are the mitigation strategies?
□ What are the fallback options?
□ What are the hidden costs?

Stakeholder validation:
□ Does it meet all requirements?
□ Are trade-offs acceptable?
□ Is team comfortable with approach?
□ Does it fit strategic direction?
```

**Create recommendation:**
```markdown
# Solution Recommendation: [Problem]

## Problem Summary
[Brief problem description and requirements]

## Recommended Solution
[Which approach and why]

## Key Benefits
- Benefit 1
- Benefit 2
- Benefit 3

## Trade-offs Accepted
- Trade-off 1 and why acceptable
- Trade-off 2 and why acceptable

## Implementation Plan
1. [Phase 1 - Timeline]
2. [Phase 2 - Timeline]
3. [Phase 3 - Timeline]

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Risk 1 | High | Strategy 1 |
| Risk 2 | Medium | Strategy 2 |

## Alternative Approaches Considered
### Alternative 1
- Pros: [...]
- Cons: [...]
- Why not chosen: [...]

### Alternative 2
[Same format...]

## Next Steps
1. [Immediate action]
2. [Follow-up action]
```

## Solution Research Strategies

**Build vs Buy decision:**
```markdown
Build internally if:
✅ Highly specific requirements
✅ Core competitive advantage
✅ Simple enough to maintain
✅ No suitable existing solution

Buy/Use existing if:
✅ Commoditized problem
✅ Mature solutions available
✅ Non-core functionality
✅ Time/resource constraints
```

**Quick feasibility check:**
```markdown
For each candidate solution:

1. Find documentation (15 min)
   - Is it clear and complete?

2. Find example code (15 min)
   - Can I understand the approach?

3. Identify dependencies (10 min)
   - Are they reasonable?

4. Check community health (10 min)
   - Active maintenance?
   - Good support?

Total: 50 min per solution
Target: Evaluate 3-4 solutions in 3 hours
```

**Red flags to watch for:**
```markdown
❌ No maintenance for >1 year
❌ Poor/missing documentation
❌ No test suite
❌ Breaking changes between versions
❌ Unresolved critical issues
❌ License conflicts
❌ Deprecated dependencies
❌ Single maintainer (bus factor)
```

## Best Practices

✅ **Start with requirements** - Clear problem definition first
✅ **Research multiple options** - Don't stop at first solution
✅ **Build quick prototypes** - Validate assumptions early
✅ **Consider total cost** - Implementation + maintenance
✅ **Document trade-offs** - Explain why choices made
✅ **Validate with team** - Get input from implementers
✅ **Plan for failure** - Have fallback options

❌ **Don't over-engineer** - Simplest solution that works
❌ **Don't ignore maintenance** - Long-term costs matter
❌ **Don't skip validation** - Theory ≠ practice
❌ **Don't decide alone** - Collaborative decision better
❌ **Don't chase perfection** - Good enough often sufficient

## Success Criteria

✅ Problem clearly defined with requirements
✅ Multiple solution options researched
✅ Trade-offs analyzed systematically
✅ Recommended solution validated
✅ Implementation plan created
✅ Risks identified with mitigations
✅ Stakeholders aligned on approach

---
id: fragment-discoverability-testing
category: skill
tags: [fragments, testing, fuzzy-matching, discovery, queries, validation, meta]
capabilities:
  - Fragment discoverability testing with queries
  - Fuzzy match query design patterns
  - Fragment selection validation
  - Match score debugging and improvement
useWhen:
  - Testing fragment discoverability with real-world queries validating fuzzy matching accuracy and relevance ranking
  - Building automated test suite for fragment selection measuring precision and recall of search algorithms
  - Creating query-to-fragment mapping validation ensuring high-value expertise surfaces for common development scenarios
  - Implementing fragment coverage analysis identifying gaps in expertise catalog for frequently requested skills
  - Designing A/B testing framework for fragment metadata comparing useWhen variations on selection accuracy
estimatedTokens: 650
---

# Fragment Discoverability Testing

Test fragment discoverability using query patterns to ensure fragments are selected by fuzzy matching for expected use cases.

## Query Testing Checklist

After creating a fragment, test these queries:

```markdown
□ Primary technology: orchestr8://${category}/match?query=${main-tech}
□ Technology + domain: orchestr8://${category}/match?query=${tech}+${domain}
□ Specific use case: orchestr8://${category}/match?query=${use-case}
□ Problem-oriented: orchestr8://${category}/match?query=${problem}+${tech}
□ Pattern-based: orchestr8://${category}/match?query=${pattern}+${tech}
```

**Example for TypeScript API fragment:**
```markdown
□ orchestr8://agents/match?query=typescript
□ orchestr8://agents/match?query=typescript+api
□ orchestr8://agents/match?query=typescript+rest+express
□ orchestr8://agents/match?query=build+api+typescript
□ orchestr8://agents/match?query=express+backend
```

## Query Design Patterns

### Pattern 1: Technology-First

```markdown
orchestr8://agents/match?query=python
orchestr8://agents/match?query=rust
orchestr8://skills/match?query=error+handling
```

Best for: General expertise lookup

### Pattern 2: Technology + Domain

```markdown
orchestr8://agents/match?query=python+api
orchestr8://agents/match?query=typescript+web+frontend
orchestr8://skills/match?query=testing+integration
```

Best for: Domain-specific expertise

### Pattern 3: Problem-Oriented

```markdown
orchestr8://match?query=build+rest+api+authentication
orchestr8://match?query=handle+async+errors+typescript
orchestr8://skills/match?query=database+optimization+postgres
```

Best for: Solution-focused searches

### Pattern 4: Tag-Filtered

```markdown
orchestr8://skills/match?query=security&tags=jwt,oauth
orchestr8://agents/match?query=api&tags=typescript,express
```

Best for: Narrowing by specific technologies

## Validation Process

```markdown
## Fragment Discoverability Test

### Fragment: ${fragment-id}

**Expected Queries:**
1. Query: "typescript api"
   - Expected: Selected in top 3
   - Actual: [Test result]

2. Query: "build rest api typescript"
   - Expected: Selected in top 3
   - Actual: [Test result]

3. Query: "express backend"
   - Expected: Selected in top 5
   - Actual: [Test result]

**Match Score Analysis:**
- Tags matched: [list]
- Capabilities matched: [list]
- UseWhen matched: [list]
- Total score: [number]

**Issues Found:**
- [Issue 1 and resolution]
- [Issue 2 and resolution]

**Metadata Adjustments:**
- Added tags: [list]
- Updated capabilities: [changes]
- Refined useWhen: [changes]

**Retest Results:**
- Query 1: ✅ Now selected
- Query 2: ✅ Now selected
- Query 3: ✅ Now selected
```

## Common Discovery Issues

### Issue 1: Fragment Not Selected

**Symptoms:**
- Fragment not in results for expected queries
- Match score too low

**Diagnosis:**
```markdown
□ Check tag overlap with query keywords
□ Review capability keywords
□ Verify useWhen scenarios match query intent
□ Compare with selected fragments' metadata
```

**Solutions:**
```markdown
✅ Add query keywords to tags
✅ Make capabilities more specific
✅ Add concrete useWhen scenarios
✅ Increase tag count (5-8 tags)
```

### Issue 2: Wrong Fragments Selected

**Symptoms:**
- Less relevant fragments selected first
- Better fragment has lower score

**Diagnosis:**
```markdown
□ Compare metadata richness (tag count)
□ Check capability specificity
□ Review useWhen concreteness
□ Analyze competing fragments
```

**Solutions:**
```markdown
✅ Enrich metadata with more specific tags
✅ Differentiate from competing fragments
✅ Add unique capability descriptions
✅ Include problem-specific useWhen scenarios
```

### Issue 3: Over-Selection

**Symptoms:**
- Fragment selected for unrelated queries
- Too many tag matches for wrong domains

**Diagnosis:**
```markdown
□ Tags too generic
□ Capabilities too broad
□ UseWhen scenarios too vague
```

**Solutions:**
```markdown
✅ Remove generic tags
✅ Make capabilities technology-specific
✅ Add context to useWhen scenarios
✅ Narrow fragment scope
```

## Testing Workflow

```markdown
1. Create fragment with initial metadata
2. Run 5-7 test queries (expected use cases)
3. Analyze match scores and rankings
4. Identify metadata gaps
5. Update tags, capabilities, useWhen
6. Retest all queries
7. Verify improvements
8. Document final metadata
```

## Best Practices

✅ **Test multiple queries** - At least 5 different query patterns
✅ **Problem-oriented queries** - Test how users will actually search
✅ **Compare with alternatives** - Ensure better match than similar fragments
✅ **Iterate on metadata** - Refine based on test results
✅ **Document expected queries** - Reference for future updates

❌ **Don't skip testing** - Always verify discoverability
❌ **Don't test one query** - Need diverse query patterns
❌ **Don't ignore competition** - Check against similar fragments

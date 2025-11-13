---
id: quality-refactoring-techniques
category: skill
tags: [refactoring, code-quality, clean-code, maintainability, patterns]
capabilities:
  - Safe refactoring patterns
  - Code smell identification
  - Extract method and class techniques
  - DRY principle application
estimatedTokens: 240
relatedResources:
  - orchestr8://examples/patterns/refactoring-patterns-complete
useWhen:
  - Implementing refactoring techniques improving code maintainability with extract method, rename, and simplify conditionals
  - Building refactoring strategy for legacy codebase incrementally improving code quality without breaking functionality
  - Designing test-driven refactoring approach ensuring behavior preservation with comprehensive test coverage
  - Creating code smell detection identifying long methods, large classes, and duplicated code for refactoring targets
  - Implementing automated refactoring with IDE tools safely renaming, extracting, and moving code with confidence
---

# Refactoring Techniques

## Safe Refactoring Process

### The Refactoring Cycle

```markdown
1. Ensure tests exist and pass
2. Make small, incremental changes
3. Run tests after each change
4. Commit working state
5. Repeat

Never: Refactor + add features simultaneously
```

### Test-Driven Refactoring

```typescript
// 1. Start with working code + tests
function calculateOrderTotal(order: Order): number {
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }
  if (order.customer.isPremium) {
    total = total * 0.9;
  }
  if (total > 100) {
    total = total - 10;
  }
  return total;
}

// 2. Extract method - tests still pass
function calculateItemsTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// 3. Extract more methods
function applyPremiumDiscount(total: number, isPremium: boolean): number {
  return isPremium ? total * 0.9 : total;
}

function applyBulkDiscount(total: number): number {
  return total > 100 ? total - 10 : total;
}

// 4. Refactored - tests still pass
function calculateOrderTotal(order: Order): number {
  let total = calculateItemsTotal(order.items);
  total = applyPremiumDiscount(total, order.customer.isPremium);
  total = applyBulkDiscount(total);
  return total;
}
```

## Core Refactoring Patterns

### Extract Method
Break long methods into smaller, focused functions:
- Identify cohesive blocks of logic
- Extract to named methods with clear purpose
- Reduce method length to <20 lines

### Extract Class
Separate concerns when classes do too much:
- Identify distinct responsibilities
- Create focused classes for each concern
- Use composition over inheritance

### Remove Duplication (DRY)
Eliminate repeated code:
- Extract common validation logic
- Create reusable utility functions
- Share logic across similar operations

### Replace Conditional with Polymorphism
Eliminate type switching:
- Create abstract base classes
- Implement type-specific subclasses
- Use polymorphism instead of switch/if chains

### Introduce Parameter Object
Simplify long parameter lists:
- Group related parameters
- Create descriptive interfaces
- Make function signatures clearer

### Replace Magic Numbers
Use named constants:
- Define meaningful constant names
- Group related constants
- Make business rules explicit

### Simplify Conditionals
Use guard clauses for clarity:
- Early returns for error cases
- Reduce nesting depth
- Make happy path obvious

For complete before/after examples of all patterns:
→ `orchestr8://examples/patterns/refactoring-patterns-complete`

## Key Principles

✅ **Test before refactoring** - Ensure tests exist and pass
✅ **Small steps** - Incremental changes with tests between
✅ **Commit working states** - Easy to rollback if needed
✅ **Extract methods** - Keep functions small and focused
✅ **Remove duplication** - DRY principle
✅ **Simplify conditionals** - Guard clauses and early returns
✅ **Introduce types** - Replace primitives with objects

❌ **Don't refactor and add features** - Separate concerns
❌ **Don't skip tests** - Refactoring without tests is dangerous
❌ **Don't make big changes** - Hard to debug when things break
❌ **Don't optimize prematurely** - Refactor for clarity first

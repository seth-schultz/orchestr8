---
description: Safe code refactoring with test coverage verification, incremental changes, and behavior preservation guarantees
argument-hint: [code-path-and-refactoring-goals]
model: sonnet
---

# Refactor Workflow

Autonomous, safe code refactoring with test coverage, quality validation, and behavior preservation guarantees.

## Core Principles

1. **Tests First**: Ensure comprehensive tests before refactoring
2. **Small Steps**: Refactor incrementally, keeping tests green
3. **No Behavior Change**: Refactoring must not change external behavior
4. **Always Passing**: Tests must pass after every step
5. **Continuous Validation**: Run tests frequently during refactoring

## Execution Instructions

### Phase 1: Analysis & Planning (20%)

**⚡ EXECUTE TASK TOOL:**
```
Use the code-archaeologist and code-reviewer agents to analyze current code and design refactoring strategy.

subagent_type: "quality-assurance:debugger"
description: "Analyze current code and identify refactoring opportunities"
prompt: "Analyze code for refactoring: $*

Tasks:
1. **Analyze Current Code**
   - Read code thoroughly
   - Identify code smells:
     - Long methods (>50 lines)
     - Large classes (>300 lines)
     - Duplicated code
     - Deep nesting (>3 levels)
     - Too many parameters (>4)
     - Feature envy
     - Shotgun surgery
     - Primitive obsession
     - Long parameter lists
   - Map dependencies
   - Check test coverage

2. **Design Refactoring Strategy**
   Create refactoring-plan.md with:

   GOAL: [What we want to achieve]

   CURRENT STATE:
   - [What the code looks like now]
   - [Problems with current design]

   TARGET STATE:
   - [What the code should look like]
   - [How it improves the design]

   REFACTORING STEPS:
   1. [Step 1 - specific, small]
   2. [Step 2 - specific, small]
   3. [Step 3 - specific, small]
   ...

   RISKS:
   - [What could go wrong]
   - [Mitigation strategies]

3. **Verify Test Coverage**
   - Check current coverage: 80%+ of code being refactored
   - If insufficient, plan test creation first

Expected outputs:
- code-analysis.md with:
  - Code smells identified
  - Dependencies mapped
  - Test coverage report
- refactoring-plan.md with:
  - Clear goal and strategy
  - Step-by-step refactoring plan
  - Risk mitigation strategies
"
```

**Expected Outputs:**
- `code-analysis.md` - Complete code smell analysis
- `refactoring-plan.md` - Detailed refactoring strategy
- Test coverage report

**Quality Gate: Planning Validation**
```bash
# Validate code analysis exists
if [ ! -f "code-analysis.md" ]; then
  echo "❌ Code analysis not created"
  exit 1
fi

# Validate refactoring plan exists
if [ ! -f "refactoring-plan.md" ]; then
  echo "❌ Refactoring plan not created"
  exit 1
fi

# Validate plan has clear steps
if ! grep -q "REFACTORING STEPS" refactoring-plan.md; then
  echo "❌ Refactoring steps not defined"
  exit 1
fi

echo "✅ Refactoring plan complete"
```

**Track Progress:**
```bash
# Update TodoWrite with refactoring steps from plan
echo "20% - Analysis & planning complete"
```

**CHECKPOINT**: Plan approved, tests comprehensive ✓

---

### Phase 2: Pre-Refactoring Test Suite (15%)

**⚡ EXECUTE TASK TOOL:**
```
Use the test-engineer agent to ensure comprehensive test coverage before refactoring.

subagent_type: "quality-assurance:test-engineer"
description: "Create comprehensive test suite for code being refactored"
prompt: "Create bulletproof test suite for refactoring: $*

Tasks:
1. **Characterization Tests**
   Document current behavior (even if buggy):
   - Test what the code does NOW
   - We'll maintain this behavior during refactoring
   - Cover all current functionality
   - Include edge cases

2. **Edge Case Tests**
   - Empty input
   - Null/undefined input
   - Single item
   - Boundary conditions
   - Error conditions
   - Concurrent access (if applicable)

3. **Integration Tests**
   - Test how this code interacts with rest of system
   - Verify behavior doesn't change
   - Test all integration points

4. **Performance Baselines**
   - Measure current performance
   - Set baseline metrics
   - Must maintain or improve performance

Based on: code-analysis.md

Expected outputs:
- Comprehensive test suite with:
  - Characterization tests (documenting current behavior)
  - Edge case tests (boundary and error conditions)
  - Integration tests (system interactions)
  - Performance baseline tests
- All tests PASSING
- Coverage report showing >80% for code being refactored
"
```

**Expected Outputs:**
- Comprehensive test suite files
- All tests passing
- Coverage report showing >80%
- Performance baseline established

**Quality Gate: Test Suite Validation**
```bash
# Run all tests
if ! npm test 2>/dev/null && ! python -m pytest 2>/dev/null && ! cargo test 2>/dev/null; then
  echo "❌ Tests failing before refactoring"
  exit 1
fi

# Check coverage
echo "Checking test coverage..."
# Coverage should be >80% for code being refactored

echo "✅ Comprehensive test suite in place, all passing"
```

**Track Progress:**
```bash
echo "35% - Test suite complete"
```

**CHECKPOINT**: Comprehensive test suite in place, all passing ✓

---

### Phase 3: Incremental Refactoring (50%)

**⚡ EXECUTE TASK TOOL:**
```
Use the appropriate development agent to execute refactoring incrementally.

subagent_type: "[language-developers:python-developer|language-developers:typescript-developer|language-developers:java-developer|language-developers:go-developer|language-developers:rust-developer]"
description: "Execute refactoring incrementally with tests green at each step"
prompt: "Execute refactoring incrementally: $*

CRITICAL: After EACH step below, run tests. Tests must stay GREEN.

Based on refactoring-plan.md, execute these refactoring patterns as appropriate:

1. **Extract Methods/Functions**
   - Break long methods into smaller, focused functions
   - Each function has single responsibility
   - Clear, descriptive names
   - RUN TESTS ✓

2. **Extract Classes**
   - Break god classes into focused classes
   - Each class has single responsibility
   - Clear interfaces
   - RUN TESTS ✓

3. **Eliminate Code Duplication**
   - Identify duplicated logic
   - Extract to shared functions/methods
   - Use DRY principle
   - RUN TESTS ✓

4. **Improve Names**
   - Replace unclear variable/function names
   - Use descriptive, self-documenting names
   - Follow naming conventions
   - RUN TESTS ✓

5. **Reduce Complexity**
   - Replace deep nesting with guard clauses
   - Simplify conditional logic
   - Reduce cyclomatic complexity
   - RUN TESTS ✓

6. **Introduce Design Patterns** (if applicable)
   - Strategy pattern for complex conditionals
   - Factory pattern for object creation
   - Observer pattern for event handling
   - Parameter objects for many parameters
   - RUN TESTS ✓

RULES:
- Make ONE small change at a time
- Run tests after EVERY change
- Keep tests GREEN throughout
- If tests fail, revert and try smaller step
- Document each change in refactoring-log.md
- NO behavior changes allowed

Expected outputs:
- Refactored code files
- refactoring-log.md documenting each step
- All tests passing after EVERY step
- Reduced code complexity
- Eliminated code smells
- SOLID principles followed
"
```

**Expected Outputs:**
- Refactored code files
- `refactoring-log.md` - Step-by-step change log
- All tests passing continuously
- Reduced complexity metrics
- Code smells eliminated

**Quality Gate: Incremental Progress**
```bash
# After each refactoring step, verify tests pass
echo "Validating refactoring progress..."

# Run all tests
if ! npm test 2>/dev/null && ! python -m pytest 2>/dev/null && ! cargo test 2>/dev/null; then
  echo "❌ Tests failing during refactoring - REVERT LAST CHANGE"
  exit 1
fi

# Verify refactoring log exists
if [ ! -f "refactoring-log.md" ]; then
  echo "❌ Refactoring log not maintained"
  exit 1
fi

echo "✅ Refactoring step complete, tests still passing"
```

**Track Progress:**
```bash
echo "85% - Code refactored incrementally, tests green throughout"
```

**CHECKPOINT**: Code refactored incrementally, tests green throughout ✓

---

### Phase 4: Quality Validation (10%)

**Run all quality gates in parallel:**

#### Quality Gate 1: Code Review

**⚡ EXECUTE TASK TOOL:**
```
Use the code-reviewer agent to validate refactored code quality.

subagent_type: "quality-assurance:code-reviewer"
description: "Review refactored code quality"
prompt: "Review refactored code: $*

Review all refactored files:

1. **Clean Code Principles**
   - Code is cleaner and more maintainable
   - Meaningful names
   - Functions small and focused
   - No code duplication
   - Proper error handling

2. **SOLID Principles**
   - Single Responsibility Principle
   - Open/Closed Principle
   - Liskov Substitution Principle
   - Interface Segregation Principle
   - Dependency Inversion Principle

3. **Code Smells Eliminated**
   - No long methods
   - No god objects
   - No deep nesting
   - Complexity reduced
   - Clear abstractions

4. **Comparison with Original**
   - Complexity reduced (measurable)
   - Maintainability improved
   - No behavior changes
   - Performance maintained

Expected outputs:
- code-review-report.md with:
  - Improvements quantified
  - Remaining issues (if any)
  - Code quality score
  - Before/after complexity comparison
"
```

**Expected Outputs:**
- `code-review-report.md` - Code quality validation

#### Quality Gate 2: Test Verification

**⚡ EXECUTE TASK TOOL:**
```
Use the test-engineer agent to validate all tests still pass.

subagent_type: "quality-assurance:test-engineer"
description: "Verify all tests pass and coverage maintained"
prompt: "Validate testing after refactoring: $*

Validation:

1. **Test Suite Execution**
   - Run all unit tests
   - Run all integration tests
   - Run all E2E tests
   - ALL tests must pass

2. **Coverage Verification**
   - Coverage maintained or improved
   - No coverage regressions
   - All critical paths covered

3. **Performance Validation**
   - Run performance baseline tests
   - Verify no performance regressions
   - Performance maintained or improved

4. **Test Quality**
   - No flaky tests
   - Tests still meaningful
   - Tests are deterministic

Expected outputs:
- test-validation-report.md with:
  - All test results (pass/fail)
  - Coverage comparison (before/after)
  - Performance comparison (before/after)
  - Test quality assessment
"
```

**Expected Outputs:**
- `test-validation-report.md` - Test validation results

#### Quality Gate 3: Security Check

**⚡ EXECUTE TASK TOOL:**
```
Use the security-auditor agent to verify no security regressions.

subagent_type: "quality-assurance:security-auditor"
description: "Verify no security issues introduced"
prompt: "Security check for refactoring: $*

Security validation:

1. **No New Vulnerabilities**
   - No SQL injection risks
   - No XSS risks
   - Input validation maintained
   - Authentication/authorization unchanged

2. **Security Posture Maintained**
   - No secrets exposed
   - No security regressions
   - Security patterns preserved

Expected outputs:
- security-check-report.md with:
  - Security status (no issues / issues found)
  - Comparison with pre-refactoring
"
```

**Expected Outputs:**
- `security-check-report.md` - Security validation

#### Quality Gate 4: Performance Check

**⚡ EXECUTE TASK TOOL:**
```
Use the performance-analyzer agent to verify performance maintained.

subagent_type: "quality-assurance:performance-analyzer"
description: "Verify performance maintained or improved"
prompt: "Performance validation for refactoring: $*

Performance checks:

1. **Performance Maintained**
   - Compare with baseline metrics
   - No regressions allowed
   - Response times maintained
   - Memory usage acceptable

2. **Benchmarking**
   - Run performance tests
   - Compare before/after
   - Document improvements (if any)

Expected outputs:
- performance-validation-report.md with:
  - Performance metrics (before/after)
  - Regressions (if any)
  - Improvements (if any)
"
```

**Expected Outputs:**
- `performance-validation-report.md` - Performance validation

**Quality Gate Validation:**
```bash
# Validate all quality gate reports exist
REPORTS=(
  "code-review-report.md"
  "test-validation-report.md"
  "security-check-report.md"
  "performance-validation-report.md"
)

for report in "${REPORTS[@]}"; do
  if [ ! -f "$report" ]; then
    echo "❌ Quality gate report missing: $report"
    exit 1
  fi
done

# Check for critical issues
if grep -qE "CRITICAL|FAILED|REGRESSION" *.md; then
  echo "❌ Critical issues found in quality gates"
  exit 1
fi

echo "✅ All quality gates passed"
```

**Track Progress:**
```bash
echo "95% - Quality validation complete"
```

**CHECKPOINT**: All quality gates passed ✓

---

### Phase 5: Documentation & Deployment (5%)

**⚡ EXECUTE TASK TOOL:**
```
Use the technical-writer agent to document refactoring and prepare deployment.

subagent_type: "development-core:fullstack-developer"
description: "Document refactoring and prepare for deployment"
prompt: "Document refactoring and prepare deployment: $*

Documentation tasks:

1. **Update Code Comments** (if complex logic)
   - Document refactored algorithms
   - Explain design decisions
   - Note performance considerations

2. **Update README** (if public API changed)
   - Document any API changes
   - Update examples if needed

3. **Update Architecture Docs** (if design changed)
   - Document new design patterns
   - Explain refactoring rationale

4. **Create Refactoring Summary**
   - What was refactored
   - Why it was refactored
   - Impact (complexity reduction, etc.)
   - Before/after metrics

5. **Create Commit Message**
   Format:
   refactor(component): [brief description]

   Refactoring:
   - [What was improved]
   - [Complexity reduction metrics]
   - [Code smells eliminated]

   Testing:
   - All tests passing
   - Coverage maintained at X%
   - Performance within baseline

   Impact: No behavior changes, internal improvement only

Expected outputs:
- Updated documentation files (if applicable)
- refactoring-summary.md
- commit-message.txt
"
```

**Expected Outputs:**
- Updated documentation files
- `refactoring-summary.md` - Refactoring summary
- `commit-message.txt` - Prepared commit message

**Quality Gate: Documentation Validation**
```bash
# Validate documentation exists
if [ ! -f "refactoring-summary.md" ]; then
  echo "❌ Refactoring summary not created"
  exit 1
fi

if [ ! -f "commit-message.txt" ]; then
  echo "❌ Commit message not prepared"
  exit 1
fi

echo "✅ Documentation complete"
```

**Create Commit:**
```bash
# Read commit message
COMMIT_MSG=$(cat commit-message.txt)

# Create commit
git add .
git commit -m "$COMMIT_MSG"

echo "✅ Refactoring committed"
```

**Track Progress:**
```bash
echo "100% - Documentation & deployment complete"
```

**CHECKPOINT**: Deployed successfully ✓

---

## Common Refactoring Patterns

### 1. Extract Method

**When**: Method is too long (>50 lines)

```python
# Before
def process():
    # 100 lines of code

# After
def process():
    prepare_data()
    validate_input()
    execute_operation()
    save_results()
```

### 2. Extract Class

**When**: Class has too many responsibilities

```python
# Before
class User:
    def authenticate(self): ...
    def send_email(self): ...
    def log_action(self): ...

# After
class User:
    def __init__(self):
        self.auth = AuthService()
        self.mailer = EmailService()
        self.logger = LogService()
```

### 3. Inline Method/Variable

**When**: Method/variable adds no value

```python
# Before
def get_total():
    base = get_base_price()
    return base

# After
def get_total():
    return get_base_price()
```

### 4. Replace Conditional with Polymorphism

**When**: Complex type-based conditionals

```python
# Before
def calculate(type, amount):
    if type == 'A':
        return amount * 1.5
    elif type == 'B':
        return amount * 2.0

# After
class CalculatorA:
    def calculate(self, amount):
        return amount * 1.5

class CalculatorB:
    def calculate(self, amount):
        return amount * 2.0
```

### 5. Introduce Parameter Object

**When**: Many parameters (>4)

```python
# Before
def create_user(name, email, age, address, phone, city, state, zip):
    ...

# After
@dataclass
class UserData:
    name: str
    email: str
    age: int
    address: str
    phone: str
    city: str
    state: str
    zip: str

def create_user(user_data: UserData):
    ...
```

## Success Criteria

Refactoring complete when:
- ✅ All tests passing (100%)
- ✅ Coverage maintained or improved
- ✅ Code complexity reduced
- ✅ Code smells eliminated
- ✅ SOLID principles followed
- ✅ No behavior changes
- ✅ Performance maintained
- ✅ Quality gates passed
- ✅ Documentation updated
- ✅ Deployed successfully

## Example Usage

### Example 1: Extract Service

```bash
/refactor "Extract authentication logic from User model into AuthService for better testability and reusability"
```

**Time: 1-2 hours**

### Example 2: Eliminate Duplication

```bash
/refactor "Remove code duplication in payment processing - same logic exists in 5 different places"
```

**Time: 2-3 hours**

### Example 3: Simplify Complex Method

```bash
/refactor "Refactor process_order method - it's 200 lines long with cyclomatic complexity of 25"
```

**Time: 2-4 hours**

## Anti-Patterns

### DON'T
❌ Refactor without tests
❌ Change behavior during refactoring
❌ Make large changes all at once
❌ Skip running tests during refactoring
❌ Refactor and add features simultaneously
❌ Deploy without validation

### DO
✅ Write tests first if missing
✅ Keep behavior identical
✅ Small, incremental steps
✅ Run tests after each step
✅ Separate refactoring from feature work
✅ Validate thoroughly before deploying

Autonomous, safe, and thorough refactoring that improves code quality without breaking anything.

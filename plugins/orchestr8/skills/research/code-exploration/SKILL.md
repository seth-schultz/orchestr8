---
name: code-exploration
description: Expert at discovering architectural patterns, identifying anti-patterns, measuring code quality, and building organizational pattern libraries through systematic codebase analysis. Activate when analyzing codebases, discovering patterns, auditing code quality, or building pattern documentation.
---

# Code Exploration Skill

Expert knowledge in systematic codebase exploration, architectural pattern discovery, anti-pattern identification, code quality measurement, and organizational pattern library construction.


## Documentation Output Locations

This skill generates outputs in the following `.orchestr8/docs/` locations:

- **Pattern discovery reports**: `.orchestr8/docs/patterns/library/`
- **Code exploration findings**: `.orchestr8/docs/research/exploration/`
- **Technical debt audits**: `.orchestr8/docs/quality/tech-debt/`

### Output Naming Convention
All outputs follow the pattern: `[type]-[name]-YYYY-MM-DD.md`

Example outputs:
- `.orchestr8/docs/research/assumptions/validation-microservices-2025-01-15.md`
- `.orchestr8/docs/research/poc/poc-event-sourcing-2025-01-15.md`
- `.orchestr8/docs/patterns/library/pattern-factory-2025-01-15.md`

## When to Use This Skill

**Use code-exploration for:**
- ✅ Discovering architectural patterns in existing codebases
- ✅ Identifying anti-patterns and code smells
- ✅ Measuring code quality metrics and technical debt
- ✅ Building organizational pattern libraries
- ✅ Analyzing unfamiliar codebases for understanding
- ✅ Creating pattern catalogs and best practice guides
- ✅ Auditing code consistency across projects
- ✅ Extracting reusable patterns for standardization

**Less critical for:**
- ❌ Simple code review of individual files
- ❌ Syntax checking or linting
- ❌ Single-file refactoring
- ❌ Basic code formatting

## Core Exploration Methodology

### Phase 1: Structural Discovery

**Objective**: Map the high-level architecture and identify major components.

```bash
# 1. Identify project structure
tree -L 3 -d  # Directory structure
find . -name "*.config.*" | head -20  # Config files
cat package.json | jq '.dependencies'  # Dependencies

# 2. Locate architectural boundaries
find . -name "index.*" -o -name "main.*" -o -name "__init__.py"
find . -type d -name "controllers" -o -name "services" -o -name "models"

# 3. Identify layers and modules
ls -la src/  # Source organization
ls -la tests/  # Test organization
```

**Expected Outputs:**
- Component diagram (boxes and arrows)
- Module dependency graph
- Layer identification (presentation, business, data)
- Technology stack inventory

### Phase 2: Pattern Discovery

**Objective**: Identify recurring patterns, both good and bad.

**Design Pattern Detection:**

```typescript
// Singleton Detection
grep -r "private static.*instance" --include="*.ts"
grep -r "getInstance()" --include="*.ts"

// Factory Pattern Detection
grep -r "create[A-Z].*(" --include="*.ts"
find . -name "*Factory.ts"

// Observer Pattern Detection
grep -r "addEventListener\|on[A-Z].*(" --include="*.ts"
grep -r "subscribe\|emit" --include="*.ts"

// Dependency Injection Detection
grep -r "constructor.*inject" --include="*.ts"
grep -r "@Inject\|@Injectable" --include="*.ts"
```

**Architectural Pattern Detection:**

```bash
# MVC Pattern
ls src/models/ src/views/ src/controllers/

# Layered Architecture
ls src/presentation/ src/domain/ src/infrastructure/

# Microservices
find . -name "docker-compose.yml" -o -name "Dockerfile"
ls services/ microservices/

# Event-Driven
grep -r "EventEmitter\|EventBus" --include="*.ts"
find . -name "*Event.ts" -o -name "*Handler.ts"
```

**Expected Outputs:**
- List of design patterns with locations
- Architecture style classification
- Pattern usage frequency
- Pattern consistency report

### Phase 3: Anti-Pattern Identification

**Objective**: Locate code smells, anti-patterns, and technical debt.

**Common Anti-Patterns:**

```typescript
// God Object Detection (classes with too many responsibilities)
// Look for files > 500 lines or classes with > 20 methods
find . -name "*.ts" -exec wc -l {} \; | sort -rn | head -20

// Spaghetti Code (deep nesting, complex functions)
grep -r "if.*if.*if.*if" --include="*.ts"  # Deep nesting
grep -r "function.*{$" -A 100 --include="*.ts" | grep -c "^}"  # Long functions

// Magic Numbers
grep -r "[^0-9][0-9]{2,}[^0-9]" --include="*.ts" | grep -v "test"

// Hard-Coded Values
grep -r "http://\|https://" --include="*.ts" | grep -v ".env"
grep -r "password\|apiKey\|secret" --include="*.ts" | grep -v "test"

// Circular Dependencies
npm list  # Or appropriate package manager command
madge --circular src/  # Using madge tool

// Code Duplication
jscpd src/ --threshold 10  # Using jscpd tool

// Unused Code
ts-prune  # TypeScript unused exports
```

**Anti-Pattern Categories:**

| Category | Examples | Detection Method |
|----------|----------|------------------|
| **Design** | God Object, Spaghetti Code, Lava Flow | File size, complexity metrics, git blame |
| **Architecture** | Circular Dependencies, Tight Coupling | Dependency analysis, import graphs |
| **Security** | Hard-coded Secrets, SQL Injection | Pattern matching, security scanners |
| **Performance** | N+1 Queries, Premature Optimization | Query analysis, profiling |
| **Maintenance** | Dead Code, Commented Code | Static analysis, coverage reports |

**Expected Outputs:**
- Anti-pattern inventory with severity
- Technical debt estimation (hours/days)
- Refactoring priority list
- Risk assessment per anti-pattern

### Phase 4: Quality Metrics

**Objective**: Quantify code quality with measurable metrics.

**Code Metrics to Collect:**

```bash
# Lines of Code (LOC)
cloc src/ --json > metrics/loc.json

# Complexity Metrics (Cyclomatic, Cognitive)
npx complexity-report src/ --format json > metrics/complexity.json

# Test Coverage
npm test -- --coverage --json > metrics/coverage.json

# Type Safety (TypeScript)
tsc --noEmit --strict 2>&1 | tee metrics/type-errors.txt

# Code Quality (ESLint, SonarQube)
eslint src/ --format json > metrics/eslint.json
sonar-scanner  # Outputs to SonarQube dashboard

# Dependency Health
npm audit --json > metrics/vulnerabilities.json
npx depcheck --json > metrics/unused-deps.json
```

**Quality Score Calculation:**

```typescript
interface QualityMetrics {
  complexity: {
    average: number;        // Target: < 10
    max: number;            // Target: < 20
    filesOverThreshold: number;
  };
  coverage: {
    lines: number;          // Target: > 80%
    branches: number;       // Target: > 75%
    functions: number;      // Target: > 80%
  };
  maintainability: {
    averageFileSize: number;  // Target: < 300 lines
    duplication: number;      // Target: < 5%
    technicalDebt: string;    // Hours or days
  };
  security: {
    vulnerabilities: {
      critical: number;     // Target: 0
      high: number;         // Target: 0
      medium: number;       // Target: < 5
      low: number;
    };
  };
}

function calculateQualityScore(metrics: QualityMetrics): number {
  const scores = {
    complexity: Math.max(0, 100 - (metrics.complexity.average - 5) * 10),
    coverage: (metrics.coverage.lines + metrics.coverage.branches + metrics.coverage.functions) / 3,
    maintainability: Math.max(0, 100 - (metrics.maintainability.duplication * 10)),
    security: metrics.security.vulnerabilities.critical === 0 ? 100 : 0
  };

  return Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;
}
```

**Expected Outputs:**
- Quality score (0-100)
- Detailed metrics report
- Trend analysis (if historical data)
- Comparison to industry benchmarks

### Phase 5: Pattern Library Construction

**Objective**: Build a reusable pattern library for the organization.

**Pattern Documentation Template:**

```markdown
# Pattern: [Pattern Name]

## Category
[Design | Architectural | Integration | Testing]

## Intent
[One-line purpose]

## Motivation
[Why this pattern exists in our codebase]

## Applicability
Use when:
- [Scenario 1]
- [Scenario 2]

Avoid when:
- [Anti-scenario 1]
- [Anti-scenario 2]

## Structure
```
[UML diagram or code structure]
```

## Participants
- **Class/Component A**: [Responsibility]
- **Class/Component B**: [Responsibility]

## Collaborations
[How participants work together]

## Implementation

### Example 1: [Real codebase example]
```typescript
// From: src/services/UserService.ts
[Actual code from project]
```

### Example 2: [Another real example]
```typescript
// From: src/controllers/AuthController.ts
[Actual code from project]
```

## Consequences

**Benefits:**
- ✅ [Benefit 1]
- ✅ [Benefit 2]

**Tradeoffs:**
- ⚠️ [Tradeoff 1]
- ⚠️ [Tradeoff 2]

## Related Patterns
- [Pattern A] - [Relationship]
- [Pattern B] - [Relationship]

## Known Uses
- `src/services/UserService.ts` (line 42-78)
- `src/services/OrderService.ts` (line 125-156)
- `src/services/PaymentService.ts` (line 89-103)

## Metrics
- **Frequency**: Used in 15 files
- **Consistency**: 85% adherence to standard implementation
- **Quality**: Average complexity: 7, Test coverage: 92%

## Last Updated
2025-01-15
```

**Pattern Library Structure:**

```
patterns/
├── design-patterns/
│   ├── creational/
│   │   ├── singleton.md
│   │   ├── factory.md
│   │   └── builder.md
│   ├── structural/
│   │   ├── adapter.md
│   │   ├── decorator.md
│   │   └── facade.md
│   └── behavioral/
│       ├── observer.md
│       ├── strategy.md
│       └── command.md
├── architectural-patterns/
│   ├── layered-architecture.md
│   ├── event-driven.md
│   ├── microservices.md
│   └── hexagonal.md
├── integration-patterns/
│   ├── api-gateway.md
│   ├── circuit-breaker.md
│   └── retry-backoff.md
└── anti-patterns/
    ├── god-object.md
    ├── spaghetti-code.md
    └── circular-dependency.md
```

**Expected Outputs:**
- Complete pattern library
- Pattern usage statistics
- Pattern evolution tracking
- Pattern migration guides

## Code Exploration Workflows

### Workflow 1: New Codebase Analysis

**Goal**: Understand an unfamiliar codebase quickly.

**Steps:**
1. **Structure Discovery** (10 min)
   - Map directories and files
   - Identify entry points
   - List dependencies

2. **Pattern Recognition** (20 min)
   - Find architectural patterns
   - Identify design patterns
   - Note coding conventions

3. **Quality Assessment** (15 min)
   - Run quality metrics
   - Check test coverage
   - Scan for vulnerabilities

4. **Documentation** (15 min)
   - Create architecture diagram
   - Document patterns found
   - Note improvement areas

**Total Time**: ~60 minutes
**Deliverable**: Codebase analysis report

### Workflow 2: Pattern Library Creation

**Goal**: Build organization-wide pattern library.

**Steps:**
1. **Pattern Discovery** (30 min)
   - Scan all projects
   - Identify recurring patterns
   - Categorize by type

2. **Pattern Extraction** (60 min)
   - Extract real examples
   - Generalize implementations
   - Create pattern templates

3. **Documentation** (90 min)
   - Write pattern docs
   - Add UML diagrams
   - Include usage metrics

4. **Validation** (30 min)
   - Review with team
   - Test examples
   - Publish library

**Total Time**: ~3.5 hours
**Deliverable**: Comprehensive pattern library

### Workflow 3: Technical Debt Audit

**Goal**: Quantify and prioritize technical debt.

**Steps:**
1. **Anti-Pattern Scan** (20 min)
   - Run automated scanners
   - Manual code review
   - Catalog findings

2. **Debt Quantification** (30 min)
   - Estimate refactoring effort
   - Calculate risk scores
   - Assess business impact

3. **Prioritization** (20 min)
   - Sort by risk/effort ratio
   - Group related items
   - Create roadmap

4. **Reporting** (20 min)
   - Generate debt report
   - Create dashboards
   - Present to stakeholders

**Total Time**: ~90 minutes
**Deliverable**: Technical debt report with roadmap

## Tools and Techniques

### Static Analysis Tools

**JavaScript/TypeScript:**
- ESLint - Code quality and style
- TypeScript Compiler - Type safety
- SonarQube - Code quality platform
- Madge - Dependency analysis
- JSCPD - Copy-paste detection
- ts-prune - Unused code detection

**Python:**
- Pylint - Code quality
- Mypy - Type checking
- Radon - Complexity metrics
- Bandit - Security analysis
- Coverage.py - Test coverage

**Java:**
- PMD - Static analysis
- Checkstyle - Code style
- SpotBugs - Bug detection
- JaCoCo - Code coverage
- SonarQube - Quality platform

**General:**
- CLOC - Lines of code counter
- Git - History and authorship analysis
- GitHub Advanced Search - Cross-repo pattern search

### Visualization Tools

**Architecture Diagrams:**
```bash
# Generate dependency graphs
madge --image graph.png src/

# Create class diagrams from code
tplant --input src/**/*.ts --output diagram.puml
plantuml diagram.puml

# Architecture visualization
npx arkit -o architecture.svg
```

**Metrics Dashboards:**
- SonarQube - Quality dashboard
- Code Climate - Maintainability trends
- Codecov - Coverage visualization
- Custom D3.js visualizations

### Pattern Mining Algorithms

**Frequency Analysis:**
```typescript
// Count pattern occurrences
function findPatternFrequency(pattern: RegExp, files: string[]): Map<string, number> {
  const occurrences = new Map<string, number>();

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(pattern);
    if (matches) {
      occurrences.set(file, matches.length);
    }
  });

  return occurrences;
}

// Example: Find all Singleton instances
const singletonPattern = /private static.*instance.*getInstance/gs;
const singletons = findPatternFrequency(singletonPattern, tsFiles);
```

**Similarity Detection:**
```typescript
// Detect similar code blocks (potential for pattern extraction)
import { diff } from 'diff';

function findSimilarBlocks(files: string[], threshold: number = 0.8): Array<[string, string]> {
  const similar: Array<[string, string]> = [];

  for (let i = 0; i < files.length; i++) {
    for (let j = i + 1; j < files.length; j++) {
      const content1 = fs.readFileSync(files[i], 'utf8');
      const content2 = fs.readFileSync(files[j], 'utf8');

      const similarity = calculateSimilarity(content1, content2);
      if (similarity > threshold) {
        similar.push([files[i], files[j]]);
      }
    }
  }

  return similar;
}
```

## Quality Assessment Framework

### Multi-Dimensional Quality Model

**1. Code Health (0-100)**
```typescript
interface CodeHealth {
  complexity: number;      // Avg cyclomatic complexity (0-10 → 100-0)
  duplication: number;     // Duplication % (0-20% → 100-0)
  size: number;           // Avg file size (0-500 → 100-0)
  comments: number;       // Comment ratio (10-30% → 100)
}

function calculateCodeHealth(metrics: CodeHealth): number {
  return (
    normalizeComplexity(metrics.complexity) * 0.3 +
    normalizeDuplication(metrics.duplication) * 0.3 +
    normalizeSize(metrics.size) * 0.2 +
    normalizeComments(metrics.comments) * 0.2
  );
}
```

**2. Test Quality (0-100)**
```typescript
interface TestQuality {
  coverage: number;        // Line coverage %
  assertions: number;      // Avg assertions per test
  speed: number;          // Test suite duration (seconds)
  flakiness: number;      // Flaky test count
}

function calculateTestQuality(metrics: TestQuality): number {
  return (
    metrics.coverage * 0.4 +
    normalizeAssertions(metrics.assertions) * 0.2 +
    normalizeSpeed(metrics.speed) * 0.2 +
    (100 - metrics.flakiness * 10) * 0.2
  );
}
```

**3. Architecture Quality (0-100)**
```typescript
interface ArchitectureQuality {
  coupling: number;           // Avg coupling (0-10)
  cohesion: number;          // Avg cohesion (0-10)
  layerViolations: number;   // Count of layer violations
  circularDeps: number;      // Circular dependency count
}

function calculateArchitectureQuality(metrics: ArchitectureQuality): number {
  return (
    (10 - metrics.coupling) * 10 * 0.3 +
    metrics.cohesion * 10 * 0.3 +
    Math.max(0, 100 - metrics.layerViolations * 10) * 0.2 +
    Math.max(0, 100 - metrics.circularDeps * 20) * 0.2
  );
}
```

**4. Security Quality (0-100)**
```typescript
interface SecurityQuality {
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  secrets: number;         // Hard-coded secrets found
  inputValidation: number; // % of endpoints with validation
}

function calculateSecurityQuality(metrics: SecurityQuality): number {
  if (metrics.vulnerabilities.critical > 0) return 0;
  if (metrics.vulnerabilities.high > 0) return 20;

  return (
    Math.max(0, 100 - metrics.vulnerabilities.medium * 5) * 0.4 +
    Math.max(0, 100 - metrics.secrets * 10) * 0.3 +
    metrics.inputValidation * 0.3
  );
}
```

**Overall Quality Score:**
```typescript
function calculateOverallQuality(
  codeHealth: number,
  testQuality: number,
  architectureQuality: number,
  securityQuality: number
): number {
  return (
    codeHealth * 0.25 +
    testQuality * 0.25 +
    architectureQuality * 0.25 +
    securityQuality * 0.25
  );
}
```

## Best Practices

### DO ✅

**Exploration:**
- Start with automated tools, then manual review
- Document patterns as you discover them
- Use multiple detection methods for validation
- Prioritize high-impact findings
- Create visual representations of architecture
- Track metrics over time for trends
- Compare against industry benchmarks
- Engage team in pattern discussions

**Pattern Library:**
- Use real examples from actual codebase
- Include both good and bad examples
- Document rationale and tradeoffs
- Keep patterns updated with code evolution
- Make library searchable and accessible
- Include usage metrics and adoption rates
- Link patterns to related patterns
- Version pattern definitions

**Quality Metrics:**
- Automate metric collection
- Establish baselines before improvements
- Track trends, not just snapshots
- Use metrics to guide, not dictate
- Combine quantitative and qualitative analysis
- Focus on actionable metrics
- Share metrics transparently with team
- Set realistic improvement targets

### DON'T ❌

**Exploration:**
- Don't judge code without understanding context
- Don't rely solely on automated tools
- Don't ignore business constraints that influenced design
- Don't overlook positive patterns while hunting anti-patterns
- Don't create overly complex pattern taxonomies
- Don't forget to validate findings with team
- Don't expect perfect code everywhere
- Don't analyze in isolation from team culture

**Pattern Library:**
- Don't copy patterns from books without adaptation
- Don't create patterns that no one uses
- Don't make patterns too abstract to apply
- Don't ignore team feedback on patterns
- Don't enforce patterns dogmatically
- Don't let pattern library become stale
- Don't create patterns for hypothetical problems
- Don't skip examples and real code

**Quality Metrics:**
- Don't use metrics as weapons
- Don't optimize for metrics at expense of business value
- Don't compare teams using metrics
- Don't set arbitrary thresholds without context
- Don't ignore qualitative aspects
- Don't chase 100% in all metrics
- Don't let metrics stifle experimentation
- Don't forget metrics are means, not ends

## Anti-Patterns to Avoid

### Analysis Paralysis
**Problem**: Spending too much time analyzing, never improving.
**Solution**: Set time boxes, focus on high-impact areas, iterate.

### Metric Obsession
**Problem**: Optimizing metrics instead of actual quality.
**Solution**: Balance quantitative and qualitative assessment.

### Pattern Overload
**Problem**: Applying patterns everywhere, increasing complexity.
**Solution**: Use patterns when they solve real problems, not for their own sake.

### Ivory Tower Patterns
**Problem**: Creating pattern library divorced from reality.
**Solution**: Extract patterns from actual code, validate with team.

### Snapshot Bias
**Problem**: Single-point-in-time analysis missing trends.
**Solution**: Track metrics over time, understand trajectory.

## Integration with Development Workflow

### Continuous Quality Monitoring

```yaml
# .github/workflows/quality.yml
name: Code Quality Monitoring

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality-metrics:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Code Metrics
        run: |
          npm run lint -- --format json > metrics/eslint.json
          npm run test -- --coverage --json > metrics/coverage.json
          npx complexity-report src/ --format json > metrics/complexity.json

      - name: Upload to Quality Dashboard
        run: |
          curl -X POST https://quality-dashboard.company.com/api/metrics \
            -H "Content-Type: application/json" \
            -d @metrics/

      - name: Quality Gate Check
        run: |
          node scripts/quality-gate.js
          # Fail build if quality drops below threshold
```

### Pattern Detection in CI/CD

```yaml
# .github/workflows/pattern-check.yml
name: Pattern Conformance

on: [pull_request]

jobs:
  pattern-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Detect Anti-Patterns
        run: |
          node scripts/detect-anti-patterns.js

      - name: Verify Pattern Usage
        run: |
          node scripts/verify-patterns.js --required-patterns=singleton,factory

      - name: Comment on PR
        uses: actions/github-script@v6
        with:
          script: |
            const results = require('./pattern-results.json');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: generatePatternReport(results)
            });
```

## Example Usage

### Example 1: Discover Patterns in New Codebase

```bash
# Run code exploration
code-explorer analyze --path ./src --output patterns-report.md

# Expected output: patterns-report.md with:
# - Architecture overview
# - Design patterns found
# - Anti-patterns identified
# - Quality metrics
# - Pattern library recommendations
```

**Autonomous Process:**
1. Scan codebase structure → ~2 minutes
2. Detect design patterns → ~5 minutes
3. Identify anti-patterns → ~5 minutes
4. Calculate quality metrics → ~3 minutes
5. Generate report → ~2 minutes

**Total Time**: ~15-20 minutes

### Example 2: Build Pattern Library

```bash
# Extract patterns from codebase
pattern-extractor extract --projects ./projects/* --output pattern-library/

# Expected output: pattern-library/ with:
# - Design pattern docs (15-20 patterns)
# - Architectural pattern docs (5-10 patterns)
# - Anti-pattern catalog (10-15 patterns)
# - Usage statistics
# - Cross-references
```

**Autonomous Process:**
1. Scan all projects → ~5 minutes
2. Identify unique patterns → ~15 minutes
3. Extract examples → ~20 minutes
4. Generate documentation → ~20 minutes
5. Create visualizations → ~10 minutes

**Total Time**: ~70 minutes for 30+ patterns

### Example 3: Technical Debt Assessment

```bash
# Comprehensive technical debt audit
tech-debt-auditor audit --path ./src --severity high --output debt-report.json

# Expected output: debt-report.json with:
# - Debt inventory (categorized)
# - Effort estimates (hours/days)
# - Risk scores
# - Prioritized action plan
```

**Autonomous Process:**
1. Scan for anti-patterns → ~10 minutes
2. Run quality metrics → ~5 minutes
3. Quantify debt → ~10 minutes
4. Prioritize findings → ~5 minutes
5. Generate action plan → ~5 minutes

**Total Time**: ~35 minutes

## Remember

1. **Start Broad, Then Deep**: High-level structure first, then dive into details
2. **Automate First**: Use tools for initial discovery, manual review for validation
3. **Document Continuously**: Capture patterns as you find them
4. **Quantify Quality**: Use metrics to track progress objectively
5. **Build Libraries**: Create reusable pattern documentation for organization
6. **Balance Analysis and Action**: Don't get stuck in analysis paralysis
7. **Engage Team**: Pattern discovery is collaborative, not solo
8. **Track Trends**: Single snapshots miss the story, track over time

Code exploration transforms unknown codebases into well-understood systems, extracts valuable patterns for organizational reuse, and provides objective quality metrics to guide continuous improvement.

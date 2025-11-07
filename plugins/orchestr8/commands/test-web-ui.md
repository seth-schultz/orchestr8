---
description: Automated web UI testing with visual testing, functional testing, accessibility validation, and performance analysis
argument-hint: [app-url-or-path]
model: claude-haiku-4-5-20251001
---

# Test Web UI Workflow

Autonomous web UI testing that views, tests, debugs, and fixes frontend applications using browser automation and visual testing.

## Overview

This workflow provides end-to-end UI testing with autonomous issue detection and fixing:
1. Launch application and navigate UI
2. Visual testing (screenshots, layout, responsive)
3. Functional testing (forms, interactions, user flows)
4. Accessibility testing (WCAG 2.1 AA/AAA)
5. Performance testing (Core Web Vitals)
6. Debug detected issues
7. Generate automated test suites

## Execution Instructions

### Phase 1: Application Launch & Discovery (10%)

**⚡ EXECUTE TASK TOOL:**
```
Use the fullstack-developer or frontend-developer agent to:
1. Start application locally on appropriate port
2. Verify application is running and accessible
3. Discover application structure (pages, routes, forms)
4. Map navigation structure and interactive elements
5. Identify key user flows to test

subagent_type: "orchestr8:development:fullstack-developer"
description: "Launch application and discover structure"
prompt: "Launch and discover web application: $*

Tasks:
1. **Start Application**
   - Detect application type (React/Next.js/Vue/Angular/static)
   - Start development server on appropriate port
   - Wait for application to be ready
   - Verify accessibility with curl/wget
   - Log application URL and startup time

2. **Discover Application Structure**
   - Use Playwright to crawl application
   - Discover all links and routes
   - Identify all forms and interactive elements
   - Map buttons, inputs, images
   - Intercept and log API calls
   - Detect authentication flows

3. **Map User Flows**
   - Identify critical user journeys
   - Login/signup flows
   - Main navigation paths
   - Form submission flows
   - E-commerce flows (if applicable)
   - Search functionality

Expected outputs:
- Application running on localhost
- application-structure.json with:
  - All discovered pages/routes
  - All forms with field definitions
  - All interactive elements
  - All API endpoints detected
  - Critical user flows identified
"
```

**Expected Outputs:**
- Application running and accessible
- `application-structure.json` - Complete application map
- List of critical user flows to test

**Quality Gate: Application Ready**
```bash
# Validate application is running
if ! curl -s http://localhost:3000 > /dev/null && ! curl -s http://localhost:8080 > /dev/null; then
  echo "❌ Application not accessible"
  exit 1
fi

# Validate discovery completed
if [ ! -f "application-structure.json" ]; then
  echo "❌ Application structure not discovered"
  exit 1
fi

echo "✅ Application launched and structure discovered"
```

**Track Progress:** 10% complete

**CHECKPOINT**: Application running and structure mapped ✓

---

**🚀 PARALLEL EXECUTION OPPORTUNITY (4x speedup):** Phases 2-5 (visual, functional, accessibility, performance testing) can run in parallel since each tests different aspects independently. Use a single message with 4 Task tool calls to run all test types concurrently. Each produces separate test reports (visual-test-report.md, functional-test-report.md, a11y-test-report.md, performance-test-report.md), so no conflicts.

---

### Phase 2: Visual & Layout Testing (20%)

**⚡ EXECUTE TASK TOOL:**
```
Use the visual-testing agent to:
1. Capture screenshots of all pages (mobile/tablet/desktop)
2. Perform visual regression testing
3. Check responsive design across viewports
4. Detect layout issues (overflow, overlapping)
5. Test dark mode if applicable

subagent_type: "orchestr8:quality:playwright-specialist"
description: "Perform comprehensive visual testing"
prompt: "Visual testing for application: $*

Based on application-structure.json, perform:

1. **Visual Regression Testing**
   - Take full-page screenshots of all pages
   - Compare with baseline screenshots (if exist)
   - Use pixelmatch for pixel-level comparison
   - Detect visual regressions (>0.5% difference)
   - Generate diff images for regressions
   - Save new baselines if first run

2. **Responsive Design Testing**
   - Test on mobile viewport (375x812 - iPhone X)
   - Test on tablet viewport (768x1024 - iPad)
   - Test on desktop viewport (1920x1080)
   - Capture screenshots for each viewport
   - Detect text overflow on mobile
   - Verify mobile menu/navigation
   - Check touch target sizes

3. **Layout Integrity**
   - Measure Cumulative Layout Shift (CLS)
   - Detect overlapping elements
   - Check for horizontal scrollbars
   - Verify z-index issues
   - Test element positioning
   - Validate grid/flexbox layouts

4. **Dark Mode Testing** (if applicable)
   - Toggle dark mode
   - Capture dark mode screenshots
   - Check color contrast in dark mode
   - Verify all elements visible
   - Test theme transitions

Expected outputs:
- screenshots/ directory with all captures
- .orchestr8/docs/quality/visual-test-report.md with:
  - Visual regression results
  - Responsive design issues
  - Layout problems detected
  - Dark mode compatibility
  - Diff images for any regressions
"
```

**Expected Outputs:**
- `screenshots/` directory with all screenshots
- `.orchestr8/docs/quality/visual-test-report.md` - Visual testing results
- Baseline screenshots created/updated

**Quality Gate: Visual Testing**
```bash
# Validate screenshots captured
if [ ! -d "screenshots" ] || [ -z "$(ls -A screenshots)" ]; then
  echo "❌ Screenshots not captured"
  exit 1
fi

# Validate visual report
if [ ! -f "visual-test-report.md" ]; then
  echo "❌ Visual test report not generated"
  exit 1
fi

# Check for critical regressions
if grep -q "CRITICAL" visual-test-report.md; then
  echo "⚠️  Critical visual regressions found"
fi

echo "✅ Visual and layout testing complete"
```

**Track Progress:** 20% complete

**CHECKPOINT**: Visual and layout tests complete ✓

---

### Phase 3: Functional Testing (25%)

**⚡ EXECUTE TASK TOOL:**
```
Use the visual-testing agent to:
1. Test all user flows (login, forms, navigation)
2. Verify form validation
3. Test interactive elements (modals, dropdowns, drag-and-drop)
4. Test search and filtering
5. Verify error handling

subagent_type: "orchestr8:quality:playwright-specialist"
description: "Test all functional user flows"
prompt: "Functional testing for application: $*

Based on application-structure.json, test:

1. **Authentication Flows**
   - Test login with valid credentials
   - Test login with invalid credentials
   - Verify error messages displayed
   - Test signup/registration flow
   - Test password reset flow
   - Verify session persistence
   - Test logout functionality

2. **Form Validation**
   - Submit forms with empty fields
   - Verify required field validation
   - Test invalid email formats
   - Test invalid phone numbers
   - Test password strength validation
   - Verify error messages clear
   - Test field character limits

3. **Interactive Elements**
   - Test modal open/close (button, X, escape, outside click)
   - Test dropdown menus
   - Test tabs and accordions
   - Test drag-and-drop functionality
   - Test tooltips and popovers
   - Test date pickers
   - Test file uploads

4. **Search & Filtering**
   - Test search with various queries
   - Verify search results displayed
   - Test empty search results
   - Test filtering options
   - Test sorting functionality
   - Test pagination

5. **Navigation & Routing**
   - Test all internal links
   - Verify correct page loads
   - Test browser back/forward
   - Test deep linking
   - Verify 404 page handling

Expected outputs:
- .orchestr8/docs/quality/functional-test-report.md with:
  - All user flows tested
  - Pass/fail status for each flow
  - Errors/bugs detected
  - Screenshots of failures
  - Steps to reproduce issues
"
```

**Expected Outputs:**
- `.orchestr8/docs/quality/functional-test-report.md` - Functional testing results
- Screenshots of any failures
- Detailed reproduction steps for bugs

**Quality Gate: Functional Testing**
```bash
# Validate functional report
if [ ! -f "functional-test-report.md" ]; then
  echo "❌ Functional test report not generated"
  exit 1
fi

# Check for critical failures
FAILURES=$(grep -c "FAIL" functional-test-report.md || echo "0")
if [ "$FAILURES" -gt 0 ]; then
  echo "⚠️  $FAILURES functional test failures detected"
fi

echo "✅ Functional testing complete"
```

**Track Progress:** 45% complete

**CHECKPOINT**: Functional tests complete ✓

---

### Phase 4: Accessibility Testing (20%)

**⚡ EXECUTE TASK TOOL:**
```
Use the accessibility-tester agent to:
1. Run axe-core accessibility audit (WCAG 2.1 AA)
2. Test keyboard navigation
3. Verify screen reader compatibility
4. Check color contrast ratios
5. Validate ARIA labels and semantic HTML

subagent_type: "orchestr8:quality:playwright-specialist"
description: "Audit accessibility compliance"
prompt: "Accessibility testing for application: $*

Perform comprehensive accessibility audit:

1. **WCAG 2.1 AA Compliance**
   - Run axe-core on all pages
   - Detect violations by severity (critical/serious/moderate/minor)
   - Check all 4 WCAG principles:
     - Perceivable: alt text, captions, adaptable
     - Operable: keyboard accessible, enough time
     - Understandable: readable, predictable, input assistance
     - Robust: compatible with assistive tech
   - Generate detailed violation reports

2. **Keyboard Navigation**
   - Tab through all interactive elements
   - Verify logical tab order
   - Check visible focus indicators
   - Test keyboard shortcuts
   - Verify no keyboard traps
   - Test escape key handling
   - Verify skip links

3. **Screen Reader Compatibility**
   - Check semantic HTML usage
   - Verify ARIA labels on interactive elements
   - Check form labels and error messages
   - Verify landmark regions (header, nav, main, footer)
   - Test image alt text
   - Verify heading hierarchy (h1-h6)
   - Check button/link text clarity

4. **Color Contrast**
   - Calculate contrast ratios for all text
   - Verify text meets 4.5:1 minimum
   - Verify large text meets 3:1 minimum
   - Check UI component contrast (3:1)
   - Test in dark mode if applicable
   - Identify low contrast issues

5. **Form Accessibility**
   - Verify all inputs have labels
   - Check error message association
   - Test required field indicators
   - Verify fieldset/legend for groups
   - Check autocomplete attributes

Expected outputs:
- .orchestr8/docs/accessibility/audit.md with:
  - WCAG compliance level achieved
  - All violations by severity
  - Affected elements and line numbers
  - Remediation recommendations
  - Accessibility score (0-100)
  - Keyboard navigation results
  - Screen reader compatibility issues
"
```

**Expected Outputs:**
- `.orchestr8/docs/accessibility/audit.md` - Comprehensive accessibility audit
- List of violations with remediation steps
- Accessibility score

**Quality Gate: Accessibility**
```bash
# Validate accessibility report
if [ ! -f "accessibility-report.md" ]; then
  echo "❌ Accessibility report not generated"
  exit 1
fi

# Check for critical violations
CRITICAL=$(grep -c "CRITICAL" accessibility-report.md || echo "0")
if [ "$CRITICAL" -gt 0 ]; then
  echo "❌ $CRITICAL critical accessibility violations found"
  exit 1
fi

# Check for serious violations
SERIOUS=$(grep -c "SERIOUS" accessibility-report.md || echo "0")
if [ "$SERIOUS" -gt 5 ]; then
  echo "⚠️  $SERIOUS serious accessibility violations found"
fi

echo "✅ Accessibility testing complete"
```

**Track Progress:** 65% complete

**CHECKPOINT**: Accessibility tests complete ✓

---

### Phase 5: Performance Testing (15%)

**⚡ EXECUTE TASK TOOL:**
```
Use the performance-analyzer agent to:
1. Measure Core Web Vitals (LCP, FID, CLS)
2. Analyze page load performance
3. Check JavaScript/CSS coverage
4. Detect performance bottlenecks
5. Measure Time to Interactive (TTI)

subagent_type: "orchestr8:quality:load-testing-specialist"
description: "Analyze web performance metrics"
prompt: "Performance testing for application: $*

Measure and analyze performance:

1. **Core Web Vitals**
   - Largest Contentful Paint (LCP) - target <2.5s
   - First Input Delay (FID) - target <100ms
   - Cumulative Layout Shift (CLS) - target <0.1
   - First Contentful Paint (FCP) - target <1.8s
   - Time to Interactive (TTI) - target <3.8s
   - Measure on all key pages
   - Compare against targets

2. **Page Load Performance**
   - Measure total page load time
   - Break down by resource types
   - Identify render-blocking resources
   - Check resource sizes
   - Verify compression enabled
   - Test cache headers
   - Measure DNS/TCP/SSL time

3. **JavaScript & CSS Coverage**
   - Enable code coverage in Chrome DevTools
   - Measure unused JavaScript
   - Measure unused CSS
   - Calculate coverage percentages
   - Identify large bundles
   - Suggest code splitting opportunities

4. **Performance Bottlenecks**
   - Profile JavaScript execution
   - Identify long tasks (>50ms)
   - Check main thread blocking
   - Detect memory leaks
   - Measure bundle sizes
   - Check image optimization
   - Verify lazy loading

5. **Lighthouse Audit**
   - Run Lighthouse performance audit
   - Capture performance score (0-100)
   - Review all recommendations
   - Identify quick wins

Expected outputs:
- .orchestr8/docs/performance/analysis.md with:
  - Core Web Vitals results
  - Performance scores
  - Bottlenecks identified
  - Resource analysis
  - Code coverage stats
  - Optimization recommendations
  - Before/after comparisons
"
```

**Expected Outputs:**
- `.orchestr8/docs/performance/analysis.md` - Performance analysis
- Core Web Vitals measurements
- Optimization recommendations

**Quality Gate: Performance**
```bash
# Validate performance report
if [ ! -f "performance-report.md" ]; then
  echo "❌ Performance report not generated"
  exit 1
fi

# Check Core Web Vitals (simplified)
if grep -q "LCP.*[3-9][0-9][0-9][0-9]ms" performance-report.md; then
  echo "⚠️  LCP exceeds 2500ms target"
fi

if grep -q "CLS.*0\.[2-9]" performance-report.md; then
  echo "⚠️  CLS exceeds 0.1 target"
fi

echo "✅ Performance testing complete"
```

**Track Progress:** 80% complete

**CHECKPOINT**: Performance tests complete ✓

---

### Phase 6: Browser DevTools Integration & Debugging (20%)

**⚡ EXECUTE TASK TOOL:**
```
Use the ui-debugger agent to:
1. Monitor console for errors and warnings
2. Detect network failures
3. Analyze JavaScript coverage
4. Debug detected issues
5. Suggest fixes for common problems

subagent_type: "orchestr8:quality:debugger"
description: "Debug issues using Chrome DevTools Protocol"
prompt: "Debug web application using DevTools: $*

Use Chrome DevTools Protocol to:

1. **Console Error Detection**
   - Monitor console.error messages
   - Capture JavaScript exceptions
   - Log page errors
   - Track console warnings
   - Identify source files/line numbers
   - Navigate through app to trigger errors

2. **Network Monitoring**
   - Track failed requests (4xx, 5xx)
   - Monitor request/response times
   - Check for 404 resources
   - Verify CORS errors
   - Detect slow API calls
   - Log redirects

3. **Code Coverage Analysis**
   - Enable JavaScript profiler
   - Enable CSS coverage
   - Calculate unused code percentage
   - Identify dead code
   - Suggest bundle optimizations
   - Recommend code splitting

4. **Issue Debugging**
   - For each detected issue:
     - Identify root cause
     - Locate source code
     - Suggest fix
     - Categorize severity
   - Create issue tracker file

5. **Auto-Fix Common Issues** (if --fix-issues flag)
   - Missing alt text: generate from filename
   - Missing ARIA labels: generate from context
   - Low contrast: suggest color adjustments
   - Update source files with fixes

Expected outputs:
- debugging-report.md with:
  - All console errors/warnings
  - Network failures
  - Code coverage statistics
  - Issues categorized by severity
  - Root cause analysis
  - Fix recommendations
- issues.json with structured issue data
- (if --fix-issues) List of auto-applied fixes
"
```

**Expected Outputs:**
- `debugging-report.md` - All detected issues
- `issues.json` - Structured issue data
- Auto-applied fixes (if --fix-issues flag)

**Quality Gate: Debugging**
```bash
# Validate debugging report
if [ ! -f "debugging-report.md" ]; then
  echo "❌ Debugging report not generated"
  exit 1
fi

# Check for console errors
ERRORS=$(grep -c "console.error\|JavaScript exception" debugging-report.md || echo "0")
if [ "$ERRORS" -gt 0 ]; then
  echo "⚠️  $ERRORS console errors detected"
fi

# Check for network failures
NETWORK_FAILS=$(grep -c "404\|500\|failed request" debugging-report.md || echo "0")
if [ "$NETWORK_FAILS" -gt 0 ]; then
  echo "⚠️  $NETWORK_FAILS network failures detected"
fi

echo "✅ Debugging complete, issues identified"
```

**Track Progress:** 90% complete

**CHECKPOINT**: Debugging complete, issues identified ✓

---

### Phase 7: Automated Test Generation (10%)

**⚡ EXECUTE TASK TOOL:**
```
Use the test-engineer agent to:
1. Generate Playwright/Cypress test suite
2. Create tests for all critical user flows
3. Include visual regression tests
4. Add accessibility tests
5. Generate test configuration

subagent_type: "orchestr8:quality:test-engineer"
description: "Generate automated test suite"
prompt: "Generate automated test suite for application: $*

Based on all testing performed, generate:

1. **Test Suite Structure**
   - Create tests/ directory
   - Organize by test type:
     - tests/visual/ - Visual regression tests
     - tests/functional/ - User flow tests
     - tests/accessibility/ - A11y tests
     - tests/performance/ - Performance tests
   - Add test configuration files

2. **Visual Regression Tests**
   - Generate screenshot comparison tests
   - Test all viewports (mobile/tablet/desktop)
   - Include dark mode tests
   - Use baseline screenshots

3. **Functional Tests**
   - Generate tests for each user flow from functional-test-report.md
   - Include login/signup flows
   - Test form submissions
   - Test navigation
   - Test interactive elements
   - Add proper assertions

4. **Accessibility Tests**
   - Generate axe-core integration tests
   - Add keyboard navigation tests
   - Include ARIA validation
   - Test color contrast

5. **Performance Tests**
   - Generate Lighthouse CI tests
   - Add Core Web Vitals assertions
   - Test bundle sizes
   - Monitor performance budgets

6. **Test Configuration**
   - Create playwright.config.js or cypress.config.js
   - Configure browsers
   - Set timeouts and retries
   - Add reporters
   - Configure CI integration

Expected outputs:
- tests/ directory with complete test suite
- playwright.config.js or cypress.config.js
- package.json with test scripts
- test-suite-readme.md with:
  - How to run tests
  - Test coverage summary
  - CI integration guide
"
```

**Expected Outputs:**
- `tests/` directory with automated test suite
- Test configuration files
- `test-suite-readme.md` - Test documentation

**Quality Gate: Test Generation**
```bash
# Validate test suite created
if [ ! -d "tests" ]; then
  echo "❌ Test suite not generated"
  exit 1
fi

# Check for test files
TEST_COUNT=$(find tests -name "*.spec.js" -o -name "*.spec.ts" | wc -l)
if [ "$TEST_COUNT" -lt 1 ]; then
  echo "❌ No test files generated"
  exit 1
fi

# Validate config exists
if [ ! -f "playwright.config.js" ] && [ ! -f "cypress.config.js" ]; then
  echo "⚠️  Test configuration file not found"
fi

echo "✅ Test suite generated ($TEST_COUNT test files)"
```

**Track Progress:** 100% complete

**CHECKPOINT**: Test suite generated ✓

---

## Success Criteria

Web UI testing complete when:
- ✅ Application running and accessible
- ✅ Visual regression tests passing (< 0.5% difference)
- ✅ Responsive design works on mobile/tablet/desktop
- ✅ All functional flows work correctly
- ✅ Zero critical accessibility violations
- ✅ Core Web Vitals meet targets (LCP < 2.5s, CLS < 0.1)
- ✅ No console errors
- ✅ No broken links or failed requests
- ✅ Automated test suite generated
- ✅ All reports generated and documented

---

## Example Usage

### Example 1: Test Production Application

```bash
/test-web-ui "https://myapp.com" --fix-issues --generate-tests
```

**Autonomous execution:**
1. visual-testing agent navigates to application
2. Takes screenshots and performs visual regression tests
3. Tests all user flows (login, signup, checkout, etc.)
4. accessibility-tester runs WCAG 2.1 AA audit
5. Identifies 15 issues (3 contrast, 5 missing alt text, 7 missing ARIA labels)
6. ui-debugger analyzes issues and suggests fixes
7. Auto-applies fixes for simple issues (alt text, ARIA labels)
8. Generates pull request with fixes
9. Creates comprehensive test suite (47 tests generated)

**Time: 15-30 minutes**

### Example 2: Test During Development

```bash
/test-web-ui "http://localhost:3000"
```

**Autonomous execution:**
1. Detects React dev server running
2. Performs smoke tests on all routes
3. Captures screenshots for visual review
4. Runs accessibility checks
5. Reports issues to console in real-time
6. Developer fixes issues
7. Re-runs tests automatically on file change

**Time: 5-10 minutes (continuous)**

---

## Reports Generated

- `application-structure.json` - Application discovery
- `.orchestr8/docs/quality/visual-test-report.md` - Visual and layout testing
- `.orchestr8/docs/quality/functional-test-report.md` - User flow testing
- `.orchestr8/docs/accessibility/audit.md` - WCAG compliance audit
- `.orchestr8/docs/performance/analysis.md` - Core Web Vitals and performance
- `debugging-report.md` - Console errors and network issues
- `issues.json` - Structured issue data
- `test-suite-readme.md` - Generated test documentation
- `screenshots/` - All captured screenshots

Autonomous, comprehensive web UI testing that detects, debugs, and fixes frontend issues automatically.

---
id: session-output-management
category: pattern
tags: [output, session, file-management, organization, isolation, analysis-artifacts]
capabilities:
  - Session-based output directory organization
  - Calling directory detection and isolation
  - Codebase protection from analysis artifacts
  - Session isolation for concurrent analysis runs
  - Automatic session directory creation
  - Latest session symlinking
useWhen:
  - Running analysis workflows generating reports, diagrams, or documentation artifacts
  - Analyzing external codebases from a different calling directory (e.g., run from /test, analyze /codeRepos)
  - Isolating outputs from multiple analysis sessions to prevent file conflicts
  - Preventing pollution of analyzed codebase with temporary documentation or analysis files
  - Architecture reviews, security audits, or modernization assessments requiring organized artifact storage
estimatedTokens: 800
---

# Session Output Management Pattern

## Overview

Ensures all analysis artifacts are organized in session-specific directories within the calling directory, never polluting the analyzed codebase. Critical for architecture teams running multiple analyses from a workspace directory.

## Problem Statement

**Without session management:**
```
❌ Current behavior (scattered outputs):
/test/architecture-diagrams.md
/test/.orchestr8/docs/development/architecture-review-report.md
/codeRepos/technical-debt.md          ← Written to analyzed codebase!
/codeRepos/tech_debt.md                ← Inconsistent naming
/codeRepos/security_arch.md            ← Pollutes source repo
/codeRepos/.orchestr8/arch_map.md      ← Wrong location
```

**With session management:**
```
✅ Expected behavior (organized sessions):
/test/.orchestr8/
├── session_2025-11-11T14-30-00/
│   ├── architecture-diagrams.md
│   ├── architecture-review-report.md
│   ├── technical-debt.md
│   ├── security-analysis.md
│   ├── dependency-map.yaml
│   └── migration-plan.md
├── session_2025-11-11T16-45-00/
│   ├── architecture-diagrams.md      ← Second analysis run
│   └── ... (isolated from first)
└── latest -> session_2025-11-11T16-45-00/  (symlink)

/codeRepos/                             ← Clean, no artifacts
```

## Directory Structure

### Standard Layout

```
${CALLING_DIR}/.orchestr8/
├── session_${TIMESTAMP}/
│   ├── metadata.json                  # Session info
│   ├── analysis-overview.md           # Executive summary
│   ├── architecture/
│   │   ├── diagrams.md
│   │   ├── architecture-review.md
│   │   └── adrs/
│   ├── dependencies/
│   │   ├── service-map.yaml
│   │   ├── dependency-graph.md
│   │   └── cross-cutting-concerns.md
│   ├── modernization/
│   │   ├── cloud-migration-plan.md
│   │   ├── microservices-roadmap.md
│   │   └── ha-dr-strategy.md
│   ├── security/
│   │   ├── security-findings.md
│   │   ├── vulnerability-report.md
│   │   └── compliance-assessment.md
│   ├── performance/
│   │   ├── bottlenecks.md
│   │   └── optimization-recommendations.md
│   └── technical-debt/
│       ├── debt-assessment.md
│       └── refactoring-priorities.md
└── latest -> session_${TIMESTAMP}/    # Symlink to most recent
```

### Session Metadata

**File:** `${SESSION_DIR}/metadata.json`
```json
{
  "sessionId": "session_2025-11-11T14-30-00",
  "timestamp": "2025-11-11T14:30:00.000Z",
  "callingDirectory": "/Users/architect/test",
  "analyzedCodebase": "/Users/architect/codeRepos/MyProject",
  "workflowType": "cloud-migration-planning",
  "orchestr8Version": "8.0.0-rc1",
  "analysisType": "legacy-modernization",
  "projectCount": 32,
  "serviceCount": 30,
  "outputs": [
    "architecture/architecture-review.md",
    "dependencies/service-map.yaml",
    "modernization/cloud-migration-plan.md"
  ]
}
```

## Implementation

### Phase 1: Session Initialization

**At workflow start (all analysis workflows must do this):**

```typescript
interface SessionConfig {
  workflowType: string
  analyzedCodebase?: string
  metadata?: Record<string, any>
}

async function initSession(config: SessionConfig): Promise<string> {
  // Detect calling directory (where Claude Code was invoked)
  const callingDir = process.env.CLAUDE_CODE_CWD || process.cwd()
  
  // Create timestamp-based session ID
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('.')[0]
  const sessionId = `session_${timestamp}`
  
  // Create session directory structure
  const orchestr8Dir = path.join(callingDir, '.orchestr8')
  const sessionDir = path.join(orchestr8Dir, sessionId)
  
  await fs.mkdir(sessionDir, { recursive: true })
  await fs.mkdir(path.join(sessionDir, 'architecture'), { recursive: true })
  await fs.mkdir(path.join(sessionDir, 'dependencies'), { recursive: true })
  await fs.mkdir(path.join(sessionDir, 'modernization'), { recursive: true })
  await fs.mkdir(path.join(sessionDir, 'security'), { recursive: true })
  await fs.mkdir(path.join(sessionDir, 'performance'), { recursive: true })
  await fs.mkdir(path.join(sessionDir, 'technical-debt'), { recursive: true })
  
  // Create metadata
  const metadata = {
    sessionId,
    timestamp: new Date().toISOString(),
    callingDirectory: callingDir,
    analyzedCodebase: config.analyzedCodebase,
    workflowType: config.workflowType,
    orchestr8Version: '8.0.0-rc1',
    ...config.metadata,
    outputs: []
  }
  
  await fs.writeFile(
    path.join(sessionDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  )
  
  // Update 'latest' symlink
  const latestLink = path.join(orchestr8Dir, 'latest')
  try {
    await fs.unlink(latestLink)
  } catch (err) {
    // Ignore if doesn't exist
  }
  await fs.symlink(sessionId, latestLink, 'dir')
  
  // Store session context in environment
  process.env.ORCHESTR8_SESSION_DIR = sessionDir
  process.env.ORCHESTR8_SESSION_ID = sessionId
  process.env.ORCHESTR8_CALLING_DIR = callingDir
  process.env.ORCHESTR8_ANALYZED_PATH = config.analyzedCodebase
  
  return sessionDir
}
```

### Phase 2: Output Path Management

**All file writes must use this:**

```typescript
function getOutputPath(relativePath: string): string {
  const sessionDir = process.env.ORCHESTR8_SESSION_DIR
  if (!sessionDir) {
    throw new Error(
      'Session not initialized. Call initSession() at workflow start.'
    )
  }
  return path.join(sessionDir, relativePath)
}

// Usage examples
const architectureReport = getOutputPath('architecture/architecture-review.md')
const dependencyMap = getOutputPath('dependencies/service-map.yaml')
const migrationPlan = getOutputPath('modernization/cloud-migration-plan.md')
```

### Phase 3: Codebase Protection

**Validate all file writes:**

```typescript
function isAllowedOutputPath(filepath: string): boolean {
  const sessionDir = process.env.ORCHESTR8_SESSION_DIR
  const analyzedCodebase = process.env.ORCHESTR8_ANALYZED_PATH
  
  // Normalize paths for comparison
  const normalizedPath = path.resolve(filepath)
  
  // MUST write to session directory
  if (!normalizedPath.startsWith(path.resolve(sessionDir))) {
    console.error(`❌ Blocked write outside session: ${filepath}`)
    return false
  }
  
  // MUST NOT write to analyzed codebase
  if (analyzedCodebase && normalizedPath.startsWith(path.resolve(analyzedCodebase))) {
    console.error(`❌ Blocked write to analyzed codebase: ${filepath}`)
    return false
  }
  
  return true
}

// Wrapper for safe file writes
async function safeWriteFile(filepath: string, content: string): Promise<void> {
  if (!isAllowedOutputPath(filepath)) {
    throw new Error(`Unsafe output path: ${filepath}`)
  }
  await fs.writeFile(filepath, content, 'utf-8')
  
  // Track output in metadata
  await trackOutput(filepath)
}

async function trackOutput(filepath: string): Promise<void> {
  const sessionDir = process.env.ORCHESTR8_SESSION_DIR
  const metadataPath = path.join(sessionDir, 'metadata.json')
  
  const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'))
  const relativePath = path.relative(sessionDir, filepath)
  
  if (!metadata.outputs.includes(relativePath)) {
    metadata.outputs.push(relativePath)
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))
  }
}
```

### Phase 4: Session Cleanup

**Optional cleanup for old sessions:**

```typescript
async function cleanupOldSessions(maxAgeDays: number = 30): Promise<void> {
  const callingDir = process.env.ORCHESTR8_CALLING_DIR || process.cwd()
  const orchestr8Dir = path.join(callingDir, '.orchestr8')
  
  const entries = await fs.readdir(orchestr8Dir, { withFileTypes: true })
  const cutoffTime = Date.now() - (maxAgeDays * 24 * 60 * 60 * 1000)
  
  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.startsWith('session_')) {
      continue
    }
    
    const sessionPath = path.join(orchestr8Dir, entry.name)
    const stats = await fs.stat(sessionPath)
    
    if (stats.mtimeMs < cutoffTime) {
      console.log(`🗑️  Removing old session: ${entry.name}`)
      await fs.rm(sessionPath, { recursive: true, force: true })
    }
  }
}
```

## Integration with Workflows

### Workflow Template

**All analysis workflows must follow this pattern:**

```markdown
# ${Workflow Name}

## Phase 1: Initialization (0-10%)

**Initialize session:**
\`\`\`typescript
const sessionDir = await initSession({
  workflowType: 'cloud-migration-planning',
  analyzedCodebase: '/path/to/codeRepos',
  metadata: {
    projectCount: 32,
    serviceCount: 30
  }
})

console.log(`📁 Session created: ${sessionDir}`)
\`\`\`

## Phase 2-N: Analysis & Generation

**Write outputs using getOutputPath():**
\`\`\`typescript
// Architecture analysis
const architectureReport = getOutputPath('architecture/architecture-review.md')
await safeWriteFile(architectureReport, reportContent)

// Dependency mapping
const dependencyMap = getOutputPath('dependencies/service-map.yaml')
await safeWriteFile(dependencyMap, yamlContent)
\`\`\`

## Final Phase: Summary

**Generate session summary:**
\`\`\`typescript
const summaryPath = getOutputPath('analysis-overview.md')
const summary = generateSummary(sessionDir)
await safeWriteFile(summaryPath, summary)

console.log(`✅ Analysis complete. Results in: ${sessionDir}`)
console.log(`   Quick access: ${path.join(callingDir, '.orchestr8', 'latest')}`)
\`\`\`
```

## Workflow Integration Examples

### Example 1: Cloud Migration Planning

```typescript
// Phase 1: Initialize
const sessionDir = await initSession({
  workflowType: 'cloud-migration-planning',
  analyzedCodebase: '/Users/architect/codeRepos/LegacyApp',
  metadata: {
    targetCloud: 'Azure',
    hadrRequired: true
  }
})

// Phase 2: Analysis
const assessment = await analyzeLegacyArchitecture()
await safeWriteFile(
  getOutputPath('architecture/legacy-assessment.md'),
  assessment
)

// Phase 3: Migration Plan
const migrationPlan = await generateMigrationPlan(assessment)
await safeWriteFile(
  getOutputPath('modernization/cloud-migration-plan.md'),
  migrationPlan
)

// Phase 4: HA/DR Strategy
const hadrStrategy = await generateHADRStrategy()
await safeWriteFile(
  getOutputPath('modernization/ha-dr-strategy.md'),
  hadrStrategy
)
```

### Example 2: Service Dependency Analysis

```typescript
// Phase 1: Initialize
const sessionDir = await initSession({
  workflowType: 'dependency-analysis',
  analyzedCodebase: '/Users/architect/codeRepos',
  metadata: {
    solutionCount: 2,
    serviceCount: 30
  }
})

// Phase 2: Discover services
const services = await discoverServices()

// Phase 3: Map dependencies
const dependencyMap = await mapServiceDependencies(services)
await safeWriteFile(
  getOutputPath('dependencies/service-map.yaml'),
  yaml.dump(dependencyMap)
)

// Phase 4: Visualize
const diagram = await generateDependencyDiagram(dependencyMap)
await safeWriteFile(
  getOutputPath('dependencies/dependency-graph.md'),
  diagram
)
```

## User Communication

### Start of Workflow

```
🚀 Starting ${workflow-name} analysis...

📁 Session directory: /Users/architect/test/.orchestr8/session_2025-11-11T14-30-00/
🔍 Analyzing codebase: /Users/architect/codeRepos/LegacyApp
📊 Outputs will be organized in session directory
```

### During Workflow

```
✅ Architecture analysis complete → architecture/architecture-review.md
✅ Dependency mapping complete → dependencies/service-map.yaml
⏳ Generating migration plan...
```

### End of Workflow

```
✅ Analysis complete!

📂 Session: /Users/architect/test/.orchestr8/session_2025-11-11T14-30-00/

📄 Generated artifacts:
   - architecture/architecture-review.md
   - architecture/diagrams.md
   - dependencies/service-map.yaml
   - modernization/cloud-migration-plan.md
   - modernization/ha-dr-strategy.md
   - security/security-findings.md
   - technical-debt/debt-assessment.md

🔗 Quick access: /Users/architect/test/.orchestr8/latest/

💡 Tip: All outputs are in your calling directory, not in the analyzed codebase.
```

## Best Practices

### Do's ✅

✅ **Initialize session first** - Call `initSession()` at workflow start
✅ **Use getOutputPath()** - Always use for file path construction
✅ **Validate before write** - Use `safeWriteFile()` wrapper
✅ **Organize by category** - Use subdirectories (architecture/, dependencies/, etc.)
✅ **Track outputs** - Update metadata.json with all generated files
✅ **Communicate paths** - Tell user where outputs are
✅ **Use descriptive names** - `cloud-migration-plan.md` not `report.md`
✅ **Include timestamps** - In reports, include session timestamp
✅ **Symlink to latest** - Update 'latest' for easy access
✅ **Add to .gitignore** - Prevent committing session directories

### Don'ts ❌

❌ **Never write to analyzed codebase** - Protect source repositories
❌ **Never hardcode paths** - Always use getOutputPath()
❌ **Never skip initialization** - Session must be initialized
❌ **Never assume directory exists** - mkdir with recursive: true
❌ **Never commit session dirs** - Add to .gitignore
❌ **Never scatter outputs** - Keep organized in session directory
❌ **Never reuse session dirs** - Create new session for each run
❌ **Never ignore errors** - Validate all file operations

## Configuration

### .gitignore Entry

```gitignore
# orchestr8 session directories
.orchestr8/session_*/
.orchestr8/latest
```

### Environment Variables

```bash
# Set by initSession()
ORCHESTR8_SESSION_DIR=/Users/architect/test/.orchestr8/session_2025-11-11T14-30-00
ORCHESTR8_SESSION_ID=session_2025-11-11T14-30-00
ORCHESTR8_CALLING_DIR=/Users/architect/test
ORCHESTR8_ANALYZED_PATH=/Users/architect/codeRepos/LegacyApp
```

## Troubleshooting

### Issue: "Session not initialized"

**Cause:** Workflow attempted to write before calling initSession()

**Fix:** Call initSession() in Phase 1 of workflow

### Issue: "Blocked write outside session"

**Cause:** Attempted to write to path outside session directory

**Fix:** Use getOutputPath() for all file paths

### Issue: "Blocked write to analyzed codebase"

**Cause:** Attempted to write documentation to source repository

**Fix:** This is intentional protection - use session directory

## Success Criteria

✅ All analysis outputs in session directory
✅ No files written to analyzed codebase
✅ Session isolation works across concurrent runs
✅ Latest symlink always points to most recent session
✅ Metadata tracks all generated outputs
✅ User knows exactly where to find results
✅ Old sessions can be cleaned up safely

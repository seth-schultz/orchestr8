---
id: session-output-typescript-implementation
category: example
tags: [session-management, typescript, implementation, file-organization, output-management]
capabilities:
  - Complete TypeScript implementation of session output management
  - Session initialization with directory structure
  - Safe file writing with path validation
  - Output tracking and metadata management
  - Session cleanup utilities
useWhen:
  - Implementing session output management in TypeScript workflows
  - Need complete code examples for session directory creation
  - Building safe file write wrappers with path validation
  - Creating session tracking and cleanup utilities
estimatedTokens: 1200
relatedResources:
  - orchestr8://patterns/session-output-management
---

# Session Output Management - TypeScript Implementation

Complete TypeScript implementation of the session output management pattern with initialization, safe file operations, and cleanup utilities.

## Session Initialization

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

## Output Path Management

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

## Safe File Writing

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

## Session Cleanup

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

## Usage Examples

### Cloud Migration Planning

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

### Service Dependency Analysis

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

## Session Metadata Example

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

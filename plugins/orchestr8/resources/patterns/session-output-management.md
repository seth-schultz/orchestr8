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
estimatedTokens: 420
relatedResources:
  - orchestr8://examples/patterns/session-output-typescript-implementation
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

## Core Concepts

### 1. Session Initialization

All analysis workflows must initialize a session at startup:
- Create timestamp-based session directory
- Set up standard subdirectory structure
- Create metadata.json with session info
- Update 'latest' symlink
- Store session paths in environment variables

### 2. Output Path Management

All file writes use `getOutputPath(relativePath)`:
- Constructs path within session directory
- Throws error if session not initialized
- Ensures consistent organization

### 3. Codebase Protection

All file writes validated before execution:
- MUST write to session directory
- MUST NOT write to analyzed codebase
- Track all outputs in metadata.json

### 4. Session Isolation

Each workflow run creates new session:
- Concurrent runs don't interfere
- Historical sessions preserved
- Easy comparison between runs

## Implementation Approach

### Phase 1: Session Initialization
- Detect calling directory
- Create timestamp-based session ID
- Create directory structure
- Write metadata.json
- Update 'latest' symlink
- Set environment variables

### Phase 2: Output Path Management
- Implement `getOutputPath()` helper
- All file writes use this helper
- Automatic path construction

### Phase 3: Codebase Protection
- Implement `isAllowedOutputPath()` validator
- Wrap file writes with `safeWriteFile()`
- Track outputs in metadata

### Phase 4: Session Cleanup
- Optional: Implement cleanup utility
- Remove sessions older than N days
- Preserve recent sessions

## Integration with Workflows

All analysis workflows must:
1. Initialize session in Phase 1
2. Use `getOutputPath()` for all file paths
3. Use `safeWriteFile()` for all writes
4. Generate session summary at end

See complete TypeScript implementation:
```
orchestr8://examples/patterns/session-output-typescript-implementation
```

## User Communication

### Workflow Start
```
🚀 Starting ${workflow-name} analysis...

📁 Session directory: /Users/architect/test/.orchestr8/session_2025-11-11T14-30-00/
🔍 Analyzing codebase: /Users/architect/codeRepos/LegacyApp
📊 Outputs will be organized in session directory
```

### Workflow End
```
✅ Analysis complete!

📂 Session: /Users/architect/test/.orchestr8/session_2025-11-11T14-30-00/

📄 Generated artifacts:
   - architecture/architecture-review.md
   - dependencies/service-map.yaml
   - modernization/cloud-migration-plan.md

🔗 Quick access: /Users/architect/test/.orchestr8/latest/
```

## Best Practices

### Do's ✅
- Initialize session first
- Use getOutputPath() for all file paths
- Validate before write with safeWriteFile()
- Organize by category (architecture/, dependencies/, etc.)
- Track outputs in metadata.json
- Communicate paths to user
- Use descriptive filenames
- Symlink to latest for easy access

### Don'ts ❌
- Never write to analyzed codebase
- Never hardcode paths
- Never skip initialization
- Never assume directories exist
- Never commit session directories
- Never scatter outputs
- Never reuse session directories

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
ORCHESTR8_SESSION_DIR=/path/to/.orchestr8/session_2025-11-11T14-30-00
ORCHESTR8_SESSION_ID=session_2025-11-11T14-30-00
ORCHESTR8_CALLING_DIR=/path/to/calling/directory
ORCHESTR8_ANALYZED_PATH=/path/to/analyzed/codebase
```

## Troubleshooting

**"Session not initialized"**
- Cause: File write attempted before initSession()
- Fix: Call initSession() in Phase 1

**"Blocked write outside session"**
- Cause: Path outside session directory
- Fix: Use getOutputPath() for all paths

**"Blocked write to analyzed codebase"**
- Cause: Attempted to write to source repo
- Fix: This is intentional protection - use session directory

## Success Criteria

✅ All outputs in session directory
✅ No files written to analyzed codebase
✅ Session isolation works across concurrent runs
✅ Latest symlink points to most recent session
✅ Metadata tracks all outputs
✅ User knows where to find results
✅ Old sessions can be cleaned up safely

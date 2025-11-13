---
id: git-monorepo-strategies
category: pattern
tags: [git, monorepo, workspace, build-tools, dependency-management, lerna, nx, turborepo, pnpm-workspace, scaling]
capabilities:
  - Monorepo structure and organization patterns
  - Workspace management with npm/pnpm/yarn workspaces
  - Selective CI/CD with changed file detection
  - Code sharing and dependency management in monorepos
  - Monorepo build optimization and caching
  - Cross-package versioning and publishing
useWhen:
  - Multi-package projects requiring shared code, dependencies, and build tools with centralized configuration and dependency management
  - Microservices or component libraries needing atomic cross-package changes, unified versioning, and coordinated releases across modules
  - Frontend applications with shared UI components, utilities, and design systems requiring consistent versioning and dependency resolution
  - Full-stack applications with frontend, backend, and shared packages needing type safety across boundaries and code reuse
  - Build performance optimization through intelligent caching, incremental builds, and parallel task execution with Turborepo or Nx
  - CI/CD pipeline optimization requiring selective testing and building only affected packages based on git diff analysis
  - Team scaling with multiple squads working on different packages but sharing infrastructure, tooling, and code standards
  - Code generation scenarios where types, schemas, or APIs are shared between client and server packages with build orchestration
  - Documentation and example projects alongside source code requiring workspace organization and cross-package linking capabilities
  - Migration from multi-repo to monorepo requiring gradual package consolidation, dependency untangling, and workflow adaptation
  - Large-scale refactoring requiring atomic changes across multiple packages with type safety and guaranteed compatibility verification
  - Shared tooling and configuration such as ESLint, TypeScript, Prettier, Jest configs that need inheritance and override patterns
  - Polyglot monorepos with different language ecosystems requiring build orchestration, selective CI, and dependency graph management
  - Version management complexity requiring independent package versioning, fixed versioning, or hybrid strategies with Lerna or Changesets
  - Git operations optimization with sparse checkout, partial clone, and worktree strategies for large monorepo performance
relatedResources:
  - orchestr8://patterns/git-collaboration-workflow
  - orchestr8://patterns/git-release-management
  - orchestr8://skills/git-workflow
  - orchestr8://patterns/architecture-microservices
  - orchestr8://skills/cicd-pipeline-optimization
  - orchestr8://workflows/workflow-setup-cicd
  - orchestr8://agents/devops-expert-cicd
  - orchestr8://skills/docker-best-practices
  - orchestr8://workflows/workflow-new-project
  - orchestr8://patterns/phased-delivery
estimatedTokens: 1000
---

# Git Monorepo Strategies Pattern

## Overview

Monorepo strategies enable managing multiple related projects, packages, or services in a single Git repository. This approach facilitates code sharing, atomic cross-package changes, and unified tooling while requiring careful organization, build optimization, and Git workflow adaptation for scale.

## When to Use This Pattern

Use monorepo strategies when:
- Multiple packages share significant code and dependencies
- You need atomic changes across package boundaries
- Unified versioning and releases are beneficial
- Build caching and optimization provide significant value
- Team coordination overhead of multi-repo exceeds monorepo complexity

## Implementation

### Monorepo Structure Patterns

**Package-Based Organization** (Recommended for libraries)
```
my-monorepo/
├── packages/
│   ├── core/                 # Core utilities
│   │   ├── package.json
│   │   └── src/
│   ├── ui-components/        # UI library
│   │   ├── package.json
│   │   └── src/
│   ├── api-client/           # API client
│   │   ├── package.json
│   │   └── src/
│   └── types/                # Shared TypeScript types
│       ├── package.json
│       └── src/
├── apps/
│   ├── web/                  # Web application
│   │   ├── package.json
│   │   └── src/
│   └── mobile/               # Mobile app
│       ├── package.json
│       └── src/
├── tools/                    # Build tools and scripts
├── package.json              # Root package.json
└── pnpm-workspace.yaml       # Workspace config
```

**Service-Based Organization** (Recommended for microservices)
```
platform-monorepo/
├── services/
│   ├── auth-service/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── src/
│   ├── payment-service/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── src/
│   └── notification-service/
│       ├── Dockerfile
│       ├── package.json
│       └── src/
├── libs/
│   ├── shared-db/            # Shared database utilities
│   ├── shared-auth/          # Shared auth logic
│   └── common-types/         # TypeScript definitions
├── infrastructure/
│   ├── k8s/                  # Kubernetes manifests
│   └── terraform/            # Infrastructure as code
└── package.json
```

### Workspace Configuration

**pnpm Workspaces** (Recommended - fast, efficient)
```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'services/*'
```

```json
// Root package.json
{
  "name": "my-monorepo",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "dev": "turbo run dev --parallel"
  },
  "devDependencies": {
    "turbo": "^1.10.0",
    "typescript": "^5.0.0"
  }
}

// Package reference in apps/web/package.json
{
  "name": "@myorg/web",
  "dependencies": {
    "@myorg/ui-components": "workspace:*",
    "@myorg/core": "workspace:*"
  }
}
```

**npm Workspaces** (Built into npm 7+)
```json
// Root package.json
{
  "name": "my-monorepo",
  "workspaces": [
    "packages/*",
    "apps/*"
  ]
}
```

**Yarn Workspaces**
```json
// Root package.json
{
  "private": true,
  "workspaces": {
    "packages": [
      "packages/*",
      "apps/*"
    ],
    "nohoist": [
      "**/react-native",
      "**/react-native/**"
    ]
  }
}
```

### Build Orchestration with Turborepo

```javascript
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],  // Build dependencies first
      "outputs": ["dist/**", ".next/**"],
      "cache": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "cache": true
    },
    "lint": {
      "cache": true
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**Benefits**:
- Intelligent caching (local and remote)
- Parallel execution
- Dependency graph awareness
- Only rebuilds changed packages

```bash
# Build only affected packages
turbo run build --filter=...@myorg/web

# Build with remote caching
turbo run build --token=$TURBO_TOKEN

# Force rebuild
turbo run build --force
```

### Nx for Advanced Monorepo Management

```json
// nx.json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "test", "lint"],
        "parallel": 3
      }
    }
  },
  "affected": {
    "defaultBase": "main"
  }
}
```

```bash
# Run affected tests (only changed packages)
nx affected:test --base=main

# Visualize dependency graph
nx graph

# Run with computation caching
nx run-many --target=build --all --parallel=3
```

### Selective CI/CD Pipeline

**GitHub Actions with Change Detection**
```yaml
# .github/workflows/ci.yml
name: CI
on: [pull_request]

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      packages: ${{ steps.filter.outputs.changes }}
    steps:
      - uses: actions/checkout@v3
      - uses: dorny/paths-filter@v2
        id: filter
        with:
          filters: |
            core:
              - 'packages/core/**'
            ui:
              - 'packages/ui-components/**'
            web:
              - 'apps/web/**'

  test-core:
    needs: detect-changes
    if: contains(needs.detect-changes.outputs.packages, 'core')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pnpm install
      - run: pnpm --filter @myorg/core test

  test-ui:
    needs: detect-changes
    if: contains(needs.detect-changes.outputs.packages, 'ui')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pnpm install
      - run: pnpm --filter @myorg/ui-components test
```

**Turborepo CI Optimization**
```yaml
# .github/workflows/ci.yml
- name: Setup Turborepo cache
  uses: actions/cache@v3
  with:
    path: .turbo
    key: ${{ runner.os }}-turbo-${{ github.sha }}
    restore-keys: |
      ${{ runner.os }}-turbo-

- name: Build and test
  run: |
    pnpm turbo run build test --filter=...[origin/main]
  env:
    TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
    TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
```

### Dependency Management Strategies

**Internal Package Versioning**

**Option 1: Fixed Versioning** (All packages same version)
```bash
# Using Lerna
lerna version --exact
# All packages: 1.2.3 -> 1.3.0

# Benefits: Simple, clear releases
# Drawbacks: Unnecessary version bumps
```

**Option 2: Independent Versioning** (Packages version independently)
```bash
lerna version --independent

# Results:
# @myorg/core:     2.3.0 -> 2.4.0
# @myorg/ui:       1.5.2 -> 1.5.2 (no change)
# @myorg/api:      3.1.0 -> 4.0.0 (breaking)

# Benefits: Semantic versioning per package
# Drawbacks: Complex dependency management
```

**Option 3: Workspace Protocol** (pnpm)
```json
{
  "dependencies": {
    "@myorg/core": "workspace:*",     // Any version
    "@myorg/types": "workspace:^",    // Compatible version
    "@myorg/utils": "workspace:~"     // Patch updates only
  }
}
```

### Code Sharing Patterns

**Shared Configuration**
```javascript
// packages/eslint-config/index.js
module.exports = {
  extends: ['airbnb', 'prettier'],
  rules: {
    'no-console': 'warn'
  }
};

// apps/web/.eslintrc.js
module.exports = {
  extends: '@myorg/eslint-config'
};
```

**Shared TypeScript Types**
```typescript
// packages/types/src/api.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

// services/auth-service/src/handlers.ts
import { User } from '@myorg/types';

// apps/web/src/components/UserProfile.tsx
import { User } from '@myorg/types';
```

## Examples

### Atomic Cross-Package Refactoring

```bash
# Rename interface across packages atomically
git checkout -b refactor/rename-user-interface

# Changes in multiple packages
# packages/types/src/api.ts
# services/auth-service/src/auth.ts
# apps/web/src/components/UserCard.tsx

# Single commit, single PR
git add .
git commit -m "refactor: rename UserData to User across all packages"

# TypeScript ensures all references updated
pnpm build  # Fails if any package has type errors
```

### Publishing Strategy

```bash
# Using Changesets (recommended)
pnpm changeset add  # Interactive prompt for changes

# Generates .changeset/random-id.md
# ---
# "@myorg/ui-components": minor
# "@myorg/web": patch
# ---
# Added Button color variants

# On release
pnpm changeset version  # Updates versions and CHANGELOG
pnpm build
pnpm changeset publish  # Publishes to npm
git push --follow-tags
```

## Trade-offs

### Monorepo vs Multi-Repo (Polyrepo)

| Aspect | Monorepo | Multi-Repo |
|--------|----------|------------|
| **Code Sharing** | Easy, direct imports | Publish/consume packages |
| **Atomic Changes** | Single PR/commit | Multiple PRs, coordination |
| **Build Time** | Slower without caching | Faster per repo |
| **CI Complexity** | Higher (selective builds) | Lower (isolated) |
| **Tooling Required** | Nx, Turborepo, Lerna | Standard tools |
| **Git Performance** | Slower at scale | Fast |
| **Dependency Conflicts** | Centralized resolution | Isolated per repo |
| **Onboarding** | Higher initial complexity | Simpler per repo |
| **Refactoring** | Easier cross-package | Harder, version deps |

### Build Tool Comparison

| Tool | Best For | Strengths | Limitations |
|------|----------|-----------|-------------|
| **Turborepo** | All monorepos | Simple, fast caching | Less features than Nx |
| **Nx** | Large enterprises | Code gen, graph, plugins | Steeper learning curve |
| **Lerna** | Publishing | Versioning, publishing | Limited build features |
| **Rush** | Large orgs | Robust, scalable | Complex setup |

## Best Practices

1. **Use Workspace Protocol**: Reference local packages with `workspace:*` in pnpm
2. **Implement Build Caching**: Use Turborepo or Nx remote cache for CI speedup
3. **Selective CI**: Only test/build affected packages based on git diff
4. **Shared Tooling**: Centralize ESLint, TypeScript, Prettier configs
5. **Enforce Boundaries**: Use Nx boundaries or import restrictions to prevent circular deps
6. **Git LFS for Assets**: Use Git Large File Storage for binary assets
7. **Sparse Checkout**: Enable sparse checkout for developers working on specific packages
8. **CODEOWNERS**: Define per-package ownership for better code review assignment
9. **Versioning Strategy**: Choose fixed vs independent based on release cadence
10. **Documentation**: Maintain architecture decision records for monorepo structure choices

## When to Avoid

- **Unrelated projects**: If packages have no shared code or release coordination
- **Different access control**: If some packages need restricted access (use multi-repo)
- **Massive scale**: Git performance degrades with extremely large repos (>100GB)
- **Polyglot with no overlap**: Different languages with no shared tooling benefit
- **Solo developer**: Overhead may not justify benefits for single-person projects

## Performance Optimization

**Git Performance for Large Monorepos**
```bash
# Enable Git features for large repos
git config feature.manyFiles true
git config index.version 4
git config core.untrackedCache true
git config core.fsmonitor true

# Shallow clone for CI
git clone --depth 1 --filter=blob:none --sparse

# Sparse checkout for focused work
git sparse-checkout init --cone
git sparse-checkout set packages/ui-components apps/web
```

**Build Optimization**
```bash
# Incremental TypeScript builds
# tsconfig.json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}

# Parallel builds with Turborepo
turbo run build --concurrency=10

# Remote caching
export TURBO_TOKEN=your-token
export TURBO_TEAM=your-team
turbo run build  # Uses remote cache
```

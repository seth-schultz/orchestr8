---
id: dependency-mapping-analysis
category: example
tags: [dependency-mapping, impact-analysis, circular-dependencies, graph-algorithms]
capabilities:
  - Circular dependency detection using DFS
  - Impact analysis for service changes
  - Cascade depth calculation
  - Dependency graph traversal
useWhen:
  - Detecting circular dependencies in service architecture
  - Analyzing impact of service changes
  - Planning service migrations
estimatedTokens: 350
relatedResources:
  - orchestr8://skills/service-dependency-mapping
---

# Dependency Mapping: Analysis Algorithms

TypeScript implementations for analyzing service dependency graphs.

## Circular Dependency Detection

```typescript
interface CircularDependency {
  services: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}

function detectCircularDependencies(serviceMap: ServiceMap): CircularDependency[] {
  const visited = new Set<string>()
  const stack = new Set<string>()
  const cycles: CircularDependency[] = []

  function dfs(serviceId: string, path: string[]): void {
    if (stack.has(serviceId)) {
      // Cycle detected
      const cycleStart = path.indexOf(serviceId)
      const cycle = path.slice(cycleStart).concat(serviceId)
      cycles.push({
        services: cycle,
        severity: calculateCycleSeverity(cycle),
        recommendation: generateBreakageRecommendation(serviceMap, cycle)
      })
      return
    }

    if (visited.has(serviceId)) return

    visited.add(serviceId)
    stack.add(serviceId)

    const dependencies = getDependencies(serviceMap, serviceId)
    for (const dep of dependencies) {
      dfs(dep, [...path, serviceId])
    }

    stack.delete(serviceId)
  }

  for (const service of serviceMap.services) {
    dfs(service.id, [])
  }

  return cycles
}

function calculateCycleSeverity(cycle: string[]): 'low' | 'medium' | 'high' | 'critical' {
  if (cycle.length <= 2) return 'high'; // Direct circular dependency
  if (cycle.length <= 3) return 'medium';
  return 'low'; // Long chain, easier to break
}

function generateBreakageRecommendation(serviceMap: ServiceMap, cycle: string[]): string {
  // Analyze the cycle to suggest where to break it
  // Could introduce event-driven patterns, queues, or reverse the dependency
  return "Introduce event-driven pattern or message queue to break the cycle";
}
```

## Impact Analysis

```typescript
interface ImpactAnalysis {
  affectedServices: string[]
  impactLevel: 'low' | 'medium' | 'high' | 'critical'
  cascadeDepth: number
  estimatedDowntime: string
}

function analyzeImpact(
  serviceMap: ServiceMap,
  targetService: string,
  changeType: 'breaking-change' | 'deployment' | 'database-migration'
): ImpactAnalysis {
  // 1. Find all direct dependents
  const directDependents = findDependents(serviceMap, targetService)

  // 2. Find transitive dependents (cascade)
  const allDependents = findAllDependents(serviceMap, targetService)

  // 3. Calculate impact level
  const impactLevel = calculateImpactLevel(allDependents.length, changeType)

  // 4. Estimate downtime based on deployment strategy
  const downtime = estimateDowntime(changeType, allDependents.length)

  return {
    affectedServices: allDependents,
    impactLevel,
    cascadeDepth: calculateDepth(serviceMap, targetService),
    estimatedDowntime: downtime
  }
}

function findDependents(serviceMap: ServiceMap, targetService: string): string[] {
  return serviceMap.services
    .filter(service =>
      service.dependencies.internal.some(dep => dep.service === targetService)
    )
    .map(service => service.id);
}

function findAllDependents(serviceMap: ServiceMap, targetService: string): string[] {
  const visited = new Set<string>();
  const dependents: string[] = [];

  function traverse(serviceId: string) {
    if (visited.has(serviceId)) return;
    visited.add(serviceId);

    const directDeps = findDependents(serviceMap, serviceId);
    for (const dep of directDeps) {
      dependents.push(dep);
      traverse(dep);
    }
  }

  traverse(targetService);
  return Array.from(new Set(dependents));
}

function calculateImpactLevel(affectedCount: number, changeType: string): 'low' | 'medium' | 'high' | 'critical' {
  if (changeType === 'breaking-change' && affectedCount > 5) return 'critical';
  if (affectedCount > 10) return 'critical';
  if (affectedCount > 5) return 'high';
  if (affectedCount > 2) return 'medium';
  return 'low';
}

function estimateDowntime(changeType: string, affectedCount: number): string {
  if (changeType === 'deployment' && affectedCount <= 3) return '< 1 hour';
  if (changeType === 'deployment') return '1-2 hours';
  if (changeType === 'database-migration') return '2-4 hours';
  return '4+ hours';
}

function calculateDepth(serviceMap: ServiceMap, targetService: string): number {
  let maxDepth = 0;

  function traverse(serviceId: string, depth: number) {
    maxDepth = Math.max(maxDepth, depth);
    const dependents = findDependents(serviceMap, serviceId);
    for (const dep of dependents) {
      traverse(dep, depth + 1);
    }
  }

  traverse(targetService, 0);
  return maxDepth;
}
```

---
id: neo4j-graph-algorithms
category: example
tags: [neo4j, graph-algorithms, gds, community-detection, pathfinding, centrality]
capabilities:
  - Graph projections for algorithm execution
  - PageRank for node importance
  - Community detection with Louvain
  - Shortest path finding with Dijkstra
  - Centrality measures and clustering
useWhen:
  - Analyzing graph structure and patterns
  - Finding communities or clusters in networks
  - Computing node importance or influence
  - Pathfinding and route optimization
estimatedTokens: 680
relatedResources:
  - orchestr8://agents/neo4j-specialist
---

# Neo4j Graph Algorithms (GDS Library)

## Overview
Graph Data Science (GDS) library provides production-grade graph algorithms for analytics, machine learning, and network analysis.

## Implementation

```cypher
// Create in-memory graph projection
CALL gds.graph.project(
    'myGraph',
    ['User', 'Product'],
    {
        PURCHASED: {
            orientation: 'NATURAL',
            properties: ['amount']
        },
        FOLLOWS: {
            orientation: 'NATURAL'
        }
    }
)

// PageRank - node importance
CALL gds.pageRank.write('myGraph', {
    writeProperty: 'pageRank',
    dampingFactor: 0.85,
    maxIterations: 20
})
YIELD nodePropertiesWritten, ranIterations

// Community Detection - Louvain
CALL gds.louvain.write('myGraph', {
    writeProperty: 'community',
    includeIntermediateCommunities: true
})
YIELD communityCount, modularity

// Node Similarity - find similar users
CALL gds.nodeSimilarity.stream('myGraph', {
    topK: 10
})
YIELD node1, node2, similarity
RETURN gds.util.asNode(node1).name as user1,
       gds.util.asNode(node2).name as user2,
       similarity
ORDER BY similarity DESC

// Shortest path (Dijkstra)
MATCH (source:User {id: 'user123'}), (target:User {id: 'user456'})
CALL gds.shortestPath.dijkstra.stream('myGraph', {
    sourceNode: source,
    targetNode: target,
    relationshipWeightProperty: 'amount'
})
YIELD path
RETURN path

// Betweenness Centrality - find influential nodes
CALL gds.betweenness.stream('myGraph')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name as user, score
ORDER BY score DESC
LIMIT 10

// Triangle Count - clustering coefficient
CALL gds.triangleCount.write('myGraph', {
    writeProperty: 'triangles'
})
YIELD nodeCount, triangleCount

// Connected Components - find isolated subgraphs
CALL gds.wcc.write('myGraph', {
    writeProperty: 'componentId'
})
YIELD componentCount, componentDistribution

// Clean up projection
CALL gds.graph.drop('myGraph')
```

## Usage Notes

**Graph Projections:**
- Create in-memory graph for faster algorithm execution
- Define node labels and relationship types to include
- Specify relationship orientation (NATURAL, REVERSE, UNDIRECTED)
- Include properties needed for weighted algorithms

**PageRank:**
- Measures node importance based on incoming relationships
- Damping factor (0.85 typical) controls random walk probability
- Iterative algorithm - convergence after ~20 iterations
- Write results back to graph or stream for immediate use

**Community Detection:**
- Louvain algorithm identifies densely connected groups
- Maximizes modularity score
- `includeIntermediateCommunities` tracks hierarchical structure
- Useful for customer segmentation, fraud detection

**Node Similarity:**
- Finds nodes with similar relationship patterns
- `topK` limits results to top N most similar
- Based on Jaccard or Overlap similarity
- Useful for user/product similarity

**Shortest Path:**
- Dijkstra finds optimal path with weighted relationships
- Use relationship weights for distance/cost optimization
- Returns complete path with nodes and relationships
- A* variant available for geographical data

**Centrality Measures:**
- Betweenness: Identifies nodes on many shortest paths (bridges)
- Useful for finding influential users or bottlenecks
- Can be computationally expensive on large graphs

**Connected Components:**
- Weakly Connected Components (WCC) finds disconnected subgraphs
- Useful for identifying isolated communities
- Each component gets unique ID
- Helps understand graph structure

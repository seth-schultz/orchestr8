---
id: neo4j-recommendation-engine
category: example
tags: [neo4j, graph-database, recommendations, collaborative-filtering, cypher]
capabilities:
  - Collaborative filtering recommendations
  - Content-based similarity matching
  - Social network recommendations
  - Trending items analysis
  - Personalized PageRank
useWhen:
  - Building recommendation engines with graph data
  - Implementing collaborative filtering
  - Finding similar items based on relationships
  - Analyzing social connections for recommendations
estimatedTokens: 550
relatedResources:
  - orchestr8://agents/neo4j-specialist
---

# Neo4j Recommendation Engine Patterns

## Overview
Graph-based recommendation patterns using Neo4j Cypher for collaborative filtering, content-based filtering, and social recommendations.

## Implementation

```cypher
// Collaborative filtering - users who bought X also bought Y
MATCH (u:User {id: 'user123'})-[:PURCHASED]->(p:Product)
MATCH (p)<-[:PURCHASED]-(other:User)-[:PURCHASED]->(recommendation:Product)
WHERE NOT (u)-[:PURCHASED]->(recommendation)
RETURN recommendation.name, COUNT(*) as score
ORDER BY score DESC
LIMIT 10

// Content-based recommendations - similar products
MATCH (p:Product {id: 'prod456'})-[:BELONGS_TO]->(c:Category)
MATCH (similar:Product)-[:BELONGS_TO]->(c)
WHERE p <> similar
AND abs(p.price - similar.price) < 50
RETURN similar.name, similar.price
ORDER BY abs(p.price - similar.price)
LIMIT 10

// Social recommendations - friends' purchases
MATCH (u:User {id: 'user123'})-[:FOLLOWS*1..2]->(friend:User)
MATCH (friend)-[:PURCHASED]->(p:Product)
WHERE NOT (u)-[:PURCHASED]->(p)
RETURN p.name, COUNT(DISTINCT friend) as friendsPurchased
ORDER BY friendsPurchased DESC
LIMIT 10

// Trending products
MATCH (p:Product)<-[r:PURCHASED]-()
WHERE r.date > datetime() - duration({days: 7})
RETURN p.name, COUNT(r) as recentPurchases
ORDER BY recentPurchases DESC
LIMIT 10

// Personalized PageRank recommendations
CALL gds.pageRank.stream('myGraph', {
    sourceNodes: [$userId],
    dampingFactor: 0.85
})
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).name as product, score
ORDER BY score DESC
LIMIT 10
```

## Usage Notes

**Collaborative Filtering:**
- Finds patterns: "users who bought X also bought Y"
- Leverages purchase relationships between users and products
- Excludes items the user already purchased
- Score indicates recommendation strength

**Content-Based Filtering:**
- Recommends similar products based on attributes
- Uses category relationships and price similarity
- Can incorporate multiple product features
- Deterministic results based on product properties

**Social Recommendations:**
- Leverages social network (FOLLOWS relationships)
- Searches up to 2 degrees of separation (friends of friends)
- Weights recommendations by number of friends who purchased
- Combines social proof with purchasing behavior

**Trending Analysis:**
- Time-window filtering (last 7 days)
- Counts recent purchases as proxy for popularity
- Can be combined with user preferences
- Useful for homepage recommendations

**PageRank:**
- Personalized for specific user as source node
- Considers graph structure and relationships
- Dampening factor controls random walk behavior
- Effective for complex multi-hop recommendations

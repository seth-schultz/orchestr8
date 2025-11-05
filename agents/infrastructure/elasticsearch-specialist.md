---
name: elasticsearch-specialist
description: Expert Elasticsearch specialist for full-text search, aggregations, analyzers, and distributed search at scale. Use for search engines, log analytics, and real-time data exploration.
model: haiku
---

# Elasticsearch Specialist

Expert in Elasticsearch for powerful search, analytics, and distributed data storage.

## Index Creation & Mapping

```json
// Create index with mapping
PUT /products
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 2,
    "analysis": {
      "analyzer": {
        "autocomplete": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "autocomplete_filter"]
        }
      },
      "filter": {
        "autocomplete_filter": {
          "type": "edge_ngram",
          "min_gram": 2,
          "max_gram": 20
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "name": {
        "type": "text",
        "analyzer": "autocomplete",
        "search_analyzer": "standard",
        "fields": {
          "keyword": { "type": "keyword" }
        }
      },
      "description": {
        "type": "text",
        "analyzer": "english"
      },
      "price": { "type": "float" },
      "category": { "type": "keyword" },
      "tags": { "type": "keyword" },
      "rating": { "type": "float" },
      "created_at": { "type": "date" },
      "location": { "type": "geo_point" },
      "in_stock": { "type": "boolean" }
    }
  }
}
```

## Node.js Client

```typescript
import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: 'elastic',
    password: 'password',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Index document
async function indexProduct(product: any) {
  const result = await client.index({
    index: 'products',
    id: product.id,
    document: product,
    refresh: true, // Make immediately searchable
  });
  return result;
}

// Bulk indexing
async function bulkIndexProducts(products: any[]) {
  const operations = products.flatMap((doc) => [
    { index: { _index: 'products', _id: doc.id } },
    doc,
  ]);

  const result = await client.bulk({
    operations,
    refresh: true,
  });

  if (result.errors) {
    const erroredDocuments = result.items
      .filter((item: any) => item.index?.error)
      .map((item: any) => item.index.error);
    console.error('Bulk errors:', erroredDocuments);
  }

  return result;
}

// Full-text search
async function searchProducts(query: string, filters?: any) {
  const result = await client.search({
    index: 'products',
    query: {
      bool: {
        must: [
          {
            multi_match: {
              query,
              fields: ['name^3', 'description^1', 'tags^2'],
              type: 'best_fields',
              fuzziness: 'AUTO',
            },
          },
        ],
        filter: [
          ...(filters?.category ? [{ term: { category: filters.category } }] : []),
          ...(filters?.minPrice ? [{ range: { price: { gte: filters.minPrice } } }] : []),
          ...(filters?.inStock ? [{ term: { in_stock: true } }] : []),
        ],
      },
    },
    sort: [
      { _score: 'desc' },
      { rating: 'desc' },
    ],
    size: 20,
    from: 0,
  });

  return result.hits.hits.map((hit: any) => ({
    id: hit._id,
    score: hit._score,
    ...hit._source,
  }));
}

// Autocomplete
async function autocomplete(prefix: string) {
  const result = await client.search({
    index: 'products',
    query: {
      match: {
        name: {
          query: prefix,
          analyzer: 'autocomplete',
        },
      },
    },
    size: 10,
    _source: ['name'],
  });

  return result.hits.hits.map((hit: any) => hit._source.name);
}

// Geo search
async function searchNearby(lat: number, lon: number, radius: string) {
  const result = await client.search({
    index: 'products',
    query: {
      bool: {
        must: { match_all: {} },
        filter: {
          geo_distance: {
            distance: radius,
            location: { lat, lon },
          },
        },
      },
    },
    sort: [
      {
        _geo_distance: {
          location: { lat, lon },
          order: 'asc',
          unit: 'km',
        },
      },
    ],
  });

  return result.hits.hits;
}
```

## Aggregations

```typescript
// Faceted search with aggregations
async function facetedSearch(query: string) {
  const result = await client.search({
    index: 'products',
    query: {
      multi_match: {
        query,
        fields: ['name', 'description'],
      },
    },
    aggs: {
      categories: {
        terms: {
          field: 'category',
          size: 10,
        },
        aggs: {
          avg_price: {
            avg: { field: 'price' },
          },
        },
      },
      price_ranges: {
        range: {
          field: 'price',
          ranges: [
            { to: 50, key: 'Under $50' },
            { from: 50, to: 100, key: '$50-$100' },
            { from: 100, to: 200, key: '$100-$200' },
            { from: 200, key: 'Over $200' },
          ],
        },
      },
      rating_histogram: {
        histogram: {
          field: 'rating',
          interval: 1,
          min_doc_count: 1,
        },
      },
      top_tags: {
        terms: {
          field: 'tags',
          size: 20,
        },
      },
    },
    size: 20,
  });

  return {
    results: result.hits.hits,
    facets: result.aggregations,
  };
}

// Date histogram (time-series)
async function salesOverTime(startDate: string, endDate: string) {
  const result = await client.search({
    index: 'orders',
    query: {
      range: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
    aggs: {
      sales_over_time: {
        date_histogram: {
          field: 'created_at',
          calendar_interval: 'day',
        },
        aggs: {
          total_revenue: {
            sum: { field: 'amount' },
          },
          avg_order_value: {
            avg: { field: 'amount' },
          },
        },
      },
    },
    size: 0, // Only return aggregations
  });

  return result.aggregations;
}
```

## Advanced Queries

```typescript
// Fuzzy search with boosting
async function advancedSearch(params: {
  query: string;
  boost_recent?: boolean;
  boost_popular?: boolean;
}) {
  const must: any[] = [
    {
      multi_match: {
        query: params.query,
        fields: ['name^3', 'description'],
        fuzziness: 'AUTO',
        prefix_length: 2,
      },
    },
  ];

  const should: any[] = [];

  if (params.boost_recent) {
    should.push({
      function_score: {
        gauss: {
          created_at: {
            origin: 'now',
            scale: '30d',
            decay: 0.5,
          },
        },
      },
    });
  }

  if (params.boost_popular) {
    should.push({
      function_score: {
        field_value_factor: {
          field: 'rating',
          factor: 1.2,
          modifier: 'log1p',
        },
      },
    });
  }

  const result = await client.search({
    index: 'products',
    query: {
      bool: {
        must,
        should,
      },
    },
  });

  return result.hits.hits;
}

// Search suggestions (did you mean?)
async function getSearchSuggestions(text: string) {
  const result = await client.search({
    index: 'products',
    suggest: {
      text,
      name_suggestion: {
        term: {
          field: 'name.keyword',
          suggest_mode: 'popular',
          max_edits: 2,
        },
      },
      phrase_suggestion: {
        phrase: {
          field: 'name',
          size: 3,
          gram_size: 3,
          direct_generator: [
            {
              field: 'name',
              suggest_mode: 'always',
            },
          ],
        },
      },
    },
  });

  return result.suggest;
}

// Percolate (reverse search)
async function setupAlerts() {
  // Create percolator index
  await client.indices.create({
    index: 'alerts',
    mappings: {
      properties: {
        query: { type: 'percolator' },
        user_id: { type: 'keyword' },
        alert_name: { type: 'text' },
      },
    },
  });

  // Store alert query
  await client.index({
    index: 'alerts',
    id: 'alert1',
    document: {
      query: {
        bool: {
          must: [
            { match: { category: 'electronics' } },
            { range: { price: { lte: 100 } } },
          ],
        },
      },
      user_id: 'user123',
      alert_name: 'Cheap electronics',
    },
  });
}

async function checkAlerts(newProduct: any) {
  const result = await client.search({
    index: 'alerts',
    query: {
      percolate: {
        field: 'query',
        document: newProduct,
      },
    },
  });

  return result.hits.hits.map((hit: any) => hit._source);
}
```

## Python Client

```python
from elasticsearch import Elasticsearch
from typing import List, Dict, Any

es = Elasticsearch(
    ["https://localhost:9200"],
    basic_auth=("elastic", "password"),
    verify_certs=False
)

def search_products(query: str, filters: Dict[str, Any] = None) -> List[Dict]:
    """Full-text search with filters"""
    must = [
        {
            "multi_match": {
                "query": query,
                "fields": ["name^3", "description", "tags^2"],
                "fuzziness": "AUTO"
            }
        }
    ]

    filter_clauses = []
    if filters:
        if "category" in filters:
            filter_clauses.append({"term": {"category": filters["category"]}})
        if "min_price" in filters:
            filter_clauses.append({"range": {"price": {"gte": filters["min_price"]}}})

    body = {
        "query": {
            "bool": {
                "must": must,
                "filter": filter_clauses
            }
        },
        "sort": [{"_score": "desc"}, {"rating": "desc"}],
        "size": 20
    }

    result = es.search(index="products", body=body)
    return [{"id": hit["_id"], "score": hit["_score"], **hit["_source"]}
            for hit in result["hits"]["hits"]]

def bulk_index(documents: List[Dict], index: str):
    """Efficient bulk indexing"""
    from elasticsearch.helpers import bulk

    actions = [
        {
            "_index": index,
            "_id": doc.get("id"),
            "_source": doc
        }
        for doc in documents
    ]

    success, failed = bulk(es, actions, raise_on_error=False)
    print(f"Indexed {success} documents, {len(failed)} failed")
    return success, failed

def aggregations_example():
    """Complex aggregations"""
    body = {
        "size": 0,
        "aggs": {
            "categories": {
                "terms": {"field": "category", "size": 10},
                "aggs": {
                    "avg_price": {"avg": {"field": "price"}},
                    "price_stats": {"stats": {"field": "price"}}
                }
            },
            "price_ranges": {
                "range": {
                    "field": "price",
                    "ranges": [
                        {"to": 50},
                        {"from": 50, "to": 100},
                        {"from": 100}
                    ]
                }
            }
        }
    }

    result = es.search(index="products", body=body)
    return result["aggregations"]
```

## Index Management

```typescript
// Index lifecycle management
async function setupILM() {
  await client.ilm.putLifecycle({
    name: 'logs_policy',
    policy: {
      phases: {
        hot: {
          actions: {
            rollover: {
              max_size: '50GB',
              max_age: '30d',
            },
          },
        },
        warm: {
          min_age: '7d',
          actions: {
            shrink: {
              number_of_shards: 1,
            },
            forcemerge: {
              max_num_segments: 1,
            },
          },
        },
        cold: {
          min_age: '30d',
          actions: {
            freeze: {},
          },
        },
        delete: {
          min_age: '90d',
          actions: {
            delete: {},
          },
        },
      },
    },
  });
}

// Reindex with transformation
async function reindexWithMapping() {
  await client.reindex({
    source: { index: 'products_v1' },
    dest: { index: 'products_v2' },
    script: {
      source: `
        ctx._source.price = ctx._source.price * 1.1;
        ctx._source.updated_at = new Date();
      `,
      lang: 'painless',
    },
  });

  // Create alias
  await client.indices.updateAliases({
    actions: [
      { remove: { index: 'products_v1', alias: 'products' } },
      { add: { index: 'products_v2', alias: 'products' } },
    ],
  });
}

// Snapshot and restore
async function createSnapshot() {
  await client.snapshot.create({
    repository: 's3_repository',
    snapshot: `snapshot_${new Date().toISOString()}`,
    body: {
      indices: 'products,orders',
      include_global_state: false,
    },
  });
}
```

Build scalable, fast search experiences with Elasticsearch for full-text search and analytics.

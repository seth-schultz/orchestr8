---
name: algolia-specialist
description: 'Expert Algolia specialist for hosted search-as-a-service, instant search UI, personalization, and A/B testing. Use for fast, typo-tolerant search with minimal infrastructure overhead.'
model: inherit
sandbox:
  enabled: true
  require_approval: true
  approval_message: This agent executes infrastructure commands. Review carefully before approving.
  allowed_write_paths:
    - '{{PROJECT_DIR}}/**'
  allowed_read_paths:
    - '{{PROJECT_DIR}}/**'
  allowed_network_domains:
    - '*'
  allowed_commands:
    - aws
    - terraform
    - kubectl
    - docker
    - gcloud
    - az
    - helm
  escape_hatches:
    - Docker operations may escape sandbox
    - kubectl exec provides shell access
---

# Algolia Specialist

Expert in Algolia for blazing-fast hosted search with advanced ranking and personalization.

## Setup & Indexing (Node.js)

```typescript
import algoliasearch from 'algoliasearch';

const client = algoliasearch('APP_ID', 'ADMIN_API_KEY');
const index = client.initIndex('products');

// Index documents
async function indexProducts(products: any[]) {
  const objects = products.map((p) => ({
    objectID: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    brand: p.brand,
    rating: p.rating,
    reviews_count: p.reviews_count,
    image_url: p.image_url,
    in_stock: p.in_stock,
    tags: p.tags,
    created_at: p.created_at,
  }));

  const result = await index.saveObjects(objects, {
    autoGenerateObjectIDIfNotExist: false,
  });

  return result;
}

// Partial update
async function updatePrice(productId: string, newPrice: number) {
  await index.partialUpdateObject({
    objectID: productId,
    price: newPrice,
  });
}

// Delete
async function deleteProduct(productId: string) {
  await index.deleteObject(productId);
}

// Clear index
async function clearIndex() {
  await index.clearObjects();
}
```

## Index Configuration

```typescript
// Configure index settings
async function configureIndex() {
  await index.setSettings({
    // Searchable attributes (ordered by importance)
    searchableAttributes: [
      'name',
      'brand',
      'category',
      'tags',
      'description',
    ],

    // Attributes for faceting/filtering
    attributesForFaceting: [
      'filterOnly(category)',
      'searchable(brand)',
      'price',
      'rating',
      'in_stock',
    ],

    // Custom ranking (tie-breaking after text relevance)
    customRanking: [
      'desc(rating)',
      'desc(reviews_count)',
      'desc(created_at)',
    ],

    // Ranking formula weights
    ranking: [
      'typo',
      'geo',
      'words',
      'filters',
      'proximity',
      'attribute',
      'exact',
      'custom',
    ],

    // Typo tolerance
    typoTolerance: true,
    minWordSizefor1Typo: 4,
    minWordSizefor2Typos: 8,

    // Highlighting
    attributesToHighlight: ['name', 'description'],
    highlightPreTag: '<mark>',
    highlightPostTag: '</mark>',

    // Snippeting
    attributesToSnippet: ['description:20'],

    // Pagination
    hitsPerPage: 20,
    paginationLimitedTo: 1000,

    // Performance
    removeWordsIfNoResults: 'lastWords',
    advancedSyntax: true,

    // Plurals and synonyms
    queryLanguages: ['en'],
    ignorePlurals: true,

    // Advanced
    distinct: true,
    attributeForDistinct: 'name',
  });
}

// Synonyms
async function configureSynonyms() {
  await index.saveSynonyms([
    {
      objectID: 'laptop-synonyms',
      type: 'synonym',
      synonyms: ['laptop', 'notebook', 'portable computer'],
    },
    {
      objectID: 'phone-synonyms',
      type: 'synonym',
      synonyms: ['phone', 'smartphone', 'mobile'],
    },
    {
      objectID: 'tv-synonyms',
      type: 'synonym',
      synonyms: ['tv', 'television', 'smart tv'],
    },
  ]);
}

// Rules (query-based customization)
async function configureRules() {
  await index.saveRule({
    objectID: 'boost-premium',
    conditions: [
      {
        pattern: 'premium',
        anchoring: 'contains',
      },
    ],
    consequence: {
      params: {
        filters: 'category:premium OR tags:premium',
        optionalFilters: ['brand:Apple<score=2>', 'rating>4<score=1>'],
      },
    },
  });

  // Promote specific products
  await index.saveRule({
    objectID: 'promote-summer-sale',
    conditions: [
      {
        pattern: 'summer',
        anchoring: 'contains',
      },
    ],
    consequence: {
      promote: [
        { objectID: 'product-123', position: 0 },
        { objectID: 'product-456', position: 1 },
      ],
    },
  });

  // Hide out of stock
  await index.saveRule({
    objectID: 'hide-out-of-stock',
    conditions: [
      {
        pattern: '{query}',
        anchoring: 'is',
      },
    ],
    consequence: {
      params: {
        filters: 'in_stock:true',
      },
    },
  });
}
```

## Search Queries

```typescript
// Basic search
async function searchProducts(query: string, options?: any) {
  const result = await index.search(query, {
    attributesToRetrieve: ['name', 'price', 'image_url', 'rating'],
    hitsPerPage: 20,
    page: 0,
    ...options,
  });

  return {
    hits: result.hits,
    nbHits: result.nbHits,
    page: result.page,
    nbPages: result.nbPages,
    processingTimeMS: result.processingTimeMS,
  };
}

// Faceted search
async function facetedSearch(query: string, filters?: any) {
  const facetFilters: string[][] = [];

  if (filters?.category) {
    facetFilters.push([`category:${filters.category}`]);
  }
  if (filters?.brands && filters.brands.length > 0) {
    facetFilters.push(filters.brands.map((b: string) => `brand:${b}`));
  }

  const result = await index.search(query, {
    facets: ['category', 'brand', 'price', 'rating'],
    facetFilters,
    numericFilters: [
      ...(filters?.minPrice ? [`price >= ${filters.minPrice}`] : []),
      ...(filters?.maxPrice ? [`price <= ${filters.maxPrice}`] : []),
      ...(filters?.minRating ? [`rating >= ${filters.minRating}`] : []),
    ],
    maxValuesPerFacet: 20,
  });

  return {
    hits: result.hits,
    facets: result.facets,
    nbHits: result.nbHits,
  };
}

// Geo search
async function searchNearby(query: string, lat: number, lng: number, radius: number) {
  const result = await index.search(query, {
    aroundLatLng: `${lat},${lng}`,
    aroundRadius: radius, // meters
    getRankingInfo: true,
  });

  return result.hits.map((hit: any) => ({
    ...hit,
    _geoloc: hit._geoloc,
    _rankingInfo: hit._rankingInfo,
  }));
}

// Multi-index search
async function multiIndexSearch(query: string) {
  const results = await client.multipleQueries([
    { indexName: 'products', query, params: { hitsPerPage: 5 } },
    { indexName: 'articles', query, params: { hitsPerPage: 5 } },
    { indexName: 'users', query, params: { hitsPerPage: 5 } },
  ]);

  return {
    products: results.results[0].hits,
    articles: results.results[1].hits,
    users: results.results[2].hits,
  };
}

// Browse all records
async function browseAll(callback: (hits: any[]) => void) {
  await index.browseObjects({
    query: '',
    batch: (hits) => {
      callback(hits);
    },
  });
}
```

## InstantSearch UI (React)

```typescript
import React from 'react';
import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  Pagination,
  Stats,
  ClearRefinements,
  RangeInput,
  SortBy,
  Configure,
  Highlight,
  Panel,
} from 'react-instantsearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';

const searchClient = algoliasearch('APP_ID', 'SEARCH_API_KEY');

function ProductHit({ hit }: any) {
  return (
    <div className="product-card">
      <img src={hit.image_url} alt={hit.name} />
      <h3>
        <Highlight attribute="name" hit={hit} />
      </h3>
      <p className="price">${hit.price}</p>
      <p className="rating">⭐ {hit.rating} ({hit.reviews_count})</p>
      <Highlight attribute="description" hit={hit} />
    </div>
  );
}

export function SearchInterface() {
  return (
    <InstantSearch searchClient={searchClient} indexName="products">
      <Configure hitsPerPage={20} />

      <div className="search-container">
        <SearchBox placeholder="Search products..." />
        <Stats />
      </div>

      <div className="search-layout">
        <aside className="filters">
          <ClearRefinements />

          <Panel header="Category">
            <RefinementList attribute="category" limit={10} />
          </Panel>

          <Panel header="Brand">
            <RefinementList attribute="brand" searchable limit={10} />
          </Panel>

          <Panel header="Price Range">
            <RangeInput attribute="price" />
          </Panel>

          <Panel header="Rating">
            <RefinementList attribute="rating" />
          </Panel>

          <Panel header="Availability">
            <RefinementList attribute="in_stock" />
          </Panel>
        </aside>

        <main className="results">
          <div className="sort">
            <SortBy
              items={[
                { label: 'Relevance', value: 'products' },
                { label: 'Price: Low to High', value: 'products_price_asc' },
                { label: 'Price: High to Low', value: 'products_price_desc' },
                { label: 'Top Rated', value: 'products_rating_desc' },
              ]}
            />
          </div>

          <Hits hitComponent={ProductHit} />
          <Pagination />
        </main>
      </div>
    </InstantSearch>
  );
}
```

## Personalization

```typescript
// Set user token
const searchClient = algoliasearch('APP_ID', 'SEARCH_API_KEY');
searchClient.setUserToken('user-123');

// Search with personalization
async function personalizedSearch(query: string) {
  const result = await index.search(query, {
    enablePersonalization: true,
    userToken: 'user-123',
  });

  return result.hits;
}

// Track events (for personalization)
import { InsightsClient } from 'search-insights';

const insights = InsightsClient('APP_ID', 'SEARCH_API_KEY');
insights('init', { userToken: 'user-123' });

// Click event
function trackClick(objectID: string, position: number, queryID: string) {
  insights('clickedObjectIDsAfterSearch', {
    eventName: 'Product Clicked',
    index: 'products',
    objectIDs: [objectID],
    positions: [position],
    queryID,
  });
}

// Conversion event
function trackConversion(objectID: string, queryID: string) {
  insights('convertedObjectIDsAfterSearch', {
    eventName: 'Product Purchased',
    index: 'products',
    objectIDs: [objectID],
    queryID,
  });
}

// View event
function trackView(objectID: string) {
  insights('viewedObjectIDs', {
    eventName: 'Product Viewed',
    index: 'products',
    objectIDs: [objectID],
  });
}
```

## A/B Testing

```typescript
// Create A/B test via API
async function createABTest() {
  const abTest = await client.addABTest({
    name: 'Search Ranking Test',
    variants: [
      {
        index: 'products',
        trafficPercentage: 50,
        description: 'Control - Current ranking',
      },
      {
        index: 'products',
        trafficPercentage: 50,
        description: 'Variant - Boost reviews',
        customSearchParameters: {
          customRanking: [
            'desc(reviews_count)',
            'desc(rating)',
          ],
        },
      },
    ],
    endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  });

  return abTest;
}

// Get A/B test results
async function getABTestResults(abTestID: number) {
  const abTest = await client.getABTest(abTestID);
  return abTest;
}
```

## Python Client

```python
from algoliasearch.search_client import SearchClient

client = SearchClient.create('APP_ID', 'ADMIN_API_KEY')
index = client.init_index('products')

def search_products(query: str, filters: dict = None):
    """Search with filters"""
    search_params = {
        'attributesToRetrieve': ['name', 'price', 'rating', 'image_url'],
        'hitsPerPage': 20
    }

    if filters:
        if 'category' in filters:
            search_params['facetFilters'] = [f"category:{filters['category']}"]
        if 'min_price' in filters:
            search_params['numericFilters'] = [f"price >= {filters['min_price']}"]

    results = index.search(query, search_params)
    return results['hits']

def batch_update(objects: list):
    """Bulk update objects"""
    index.save_objects(objects)

def configure_replicas():
    """Create sorted replicas"""
    index.set_settings({
        'replicas': [
            'products_price_asc',
            'products_price_desc',
            'products_rating_desc'
        ]
    })

    # Configure replica
    replica = client.init_index('products_price_asc')
    replica.set_settings({
        'ranking': ['asc(price)', 'typo', 'words', 'proximity', 'attribute', 'exact']
    })
```

## Analytics

```typescript
// Get search analytics
async function getTopSearches() {
  const analytics = await index.getTopSearches();
  return analytics.searches;
}

async function getNoResultsSearches() {
  const analytics = await index.getSearchesNoResults();
  return analytics.searches;
}

async function getTopHits() {
  const analytics = await index.getTopHits();
  return analytics.hits;
}

async function getClickThroughRate() {
  const analytics = await index.getSearchesNoClicks();
  return analytics.searches;
}
```

Build instant, typo-tolerant search experiences with Algolia's hosted search service.

## Output Locations

This agent saves all documentation outputs to `.orchestr8/docs/` with consistent categorization.

**Output Directory**: `.orchestr8/docs/infrastructure/`

**Naming Convention**: `[type]-[name]-YYYY-MM-DD.md`

### Output Examples:
- **Report**: `.orchestr8/docs/infrastructure/[component]-YYYY-MM-DD.md`

All outputs are automatically saved with:
- Clear component/feature identifier
- Current date in YYYY-MM-DD format
- Appropriate category for easy discovery and organization

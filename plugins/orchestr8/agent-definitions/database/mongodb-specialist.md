---
name: mongodb-specialist
description: Expert MongoDB specialist for aggregation pipelines, sharding, replication sets, Atlas cloud, indexing strategies, and NoSQL data modeling. Use for MongoDB optimization, scaling, and production deployments.
model: haiku
---

# MongoDB Specialist

Expert in MongoDB administration, aggregation pipelines, sharding, replication, and Atlas cloud deployments.

## Aggregation Pipelines

```javascript
// Complex aggregation example
db.orders.aggregate([
    // Stage 1: Match recent orders
    { $match: {
        created_at: { $gte: new Date('2024-01-01') },
        status: 'completed'
    }},

    // Stage 2: Lookup user data
    { $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user'
    }},

    // Stage 3: Unwind user array
    { $unwind: '$user' },

    // Stage 4: Group by user
    { $group: {
        _id: '$user_id',
        userName: { $first: '$user.name' },
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$total' },
        avgOrderValue: { $avg: '$total' }
    }},

    // Stage 5: Sort by total spent
    { $sort: { totalSpent: -1 } },

    // Stage 6: Limit results
    { $limit: 10 },

    // Stage 7: Project final shape
    { $project: {
        userName: 1,
        totalOrders: 1,
        totalSpent: { $round: ['$totalSpent', 2] },
        avgOrderValue: { $round: ['$avgOrderValue', 2] }
    }}
]);

// Time series aggregation
db.metrics.aggregate([
    { $match: { timestamp: { $gte: ISODate('2024-01-01') } }},
    { $group: {
        _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
        },
        avgValue: { $avg: '$value' },
        maxValue: { $max: '$value' },
        count: { $sum: 1 }
    }},
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }}
]);
```

## Indexing Strategies

```javascript
// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.orders.createIndex({ user_id: 1, created_at: -1 });

// Compound index
db.products.createIndex({ category: 1, price: -1, name: 1 });

// Text index for search
db.articles.createIndex({ title: 'text', content: 'text' });

// Text search query
db.articles.find({ $text: { $search: 'mongodb performance' }});

// Geospatial index
db.locations.createIndex({ coordinates: '2dsphere' });

// Find nearby locations
db.locations.find({
    coordinates: {
        $near: {
            $geometry: { type: 'Point', coordinates: [-73.97, 40.77] },
            $maxDistance: 5000  // meters
        }
    }
});

// TTL index (auto-delete after expiry)
db.sessions.createIndex({ created_at: 1 }, { expireAfterSeconds: 3600 });

// Partial index
db.users.createIndex(
    { email: 1 },
    { partialFilterExpression: { status: 'active' }}
);

// Check index usage
db.collection.aggregate([{ $indexStats: {} }]);
```

## Sharding for Scale

```javascript
// Enable sharding on database
sh.enableSharding('mydb');

// Shard collection by user_id (hashed)
sh.shardCollection('mydb.users', { user_id: 'hashed' });

// Shard by range (time-series data)
sh.shardCollection('mydb.events', { created_at: 1 });

// Add shard chunks
sh.addTagRange('mydb.events',
    { created_at: MinKey },
    { created_at: ISODate('2023-01-01') },
    'historical'
);

// Check shard distribution
db.users.getShardDistribution();

// Move chunks between shards
sh.moveChunk('mydb.users', { user_id: 12345 }, 'shard0001');

// Balancer control
sh.stopBalancer();
sh.startBalancer();
sh.isBalancerRunning();
```

## Replication & High Availability

```javascript
// Initialize replica set
rs.initiate({
    _id: 'myReplicaSet',
    members: [
        { _id: 0, host: 'mongo1:27017', priority: 2 },
        { _id: 1, host: 'mongo2:27017', priority: 1 },
        { _id: 2, host: 'mongo3:27017', arbiterOnly: true }
    ]
});

// Check replica set status
rs.status();
rs.conf();

// Add member
rs.add('mongo4:27017');

// Remove member
rs.remove('mongo4:27017');

// Force election
rs.stepDown();

// Read preference (application level)
db.collection.find().readPref('secondaryPreferred');
```

## Performance Optimization

```javascript
// Explain query
db.users.find({ email: 'test@example.com' }).explain('executionStats');

// Check for collection scans (bad)
db.users.find({ name: 'John' }).explain('executionStats').executionStats.totalDocsExamined;

// Profiling
db.setProfilingLevel(2);  // 0=off, 1=slow, 2=all
db.system.profile.find().sort({ ts: -1 }).limit(5);

// Find slow queries
db.system.profile.find({
    millis: { $gt: 100 }
}).sort({ millis: -1 });

// Database stats
db.stats();
db.collection.stats();

// Current operations
db.currentOp();

// Kill long-running operation
db.killOp(opid);
```

## Change Streams (Real-time)

```javascript
// Watch collection for changes
const changeStream = db.orders.watch();

changeStream.on('change', (change) => {
    console.log('Change detected:', change);
    // change.operationType: 'insert', 'update', 'delete', 'replace'
});

// Filter change stream
const pipeline = [
    { $match: { 'fullDocument.status': 'completed' }}
];
const changeStream = db.orders.watch(pipeline);

// Resume after disconnect
const resumeToken = changeStream.resumeAfter;
const newStream = db.orders.watch([], { resumeAfter: resumeToken });
```

## MongoDB Atlas

```javascript
// Connection string
const uri = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydb?retryWrites=true&w=majority';

// Node.js connection with Mongoose
const mongoose = require('mongoose');

mongoose.connect(uri, {
    maxPoolSize: 50,
    minPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
});

// Atlas Search (full-text search)
db.movies.aggregate([
    {
        $search: {
            index: 'default',
            text: {
                query: 'action adventure',
                path: ['title', 'plot']
            }
        }
    },
    { $limit: 10 },
    { $project: { title: 1, plot: 1, score: { $meta: 'searchScore' }}}
]);

// Atlas Vector Search (AI/embeddings)
db.documents.createSearchIndex('vector_index', {
    fields: [{
        type: 'knnVector',
        path: 'embedding',
        numDimensions: 1536,
        similarity: 'cosine'
    }]
});

// Vector similarity search
db.documents.aggregate([
    {
        $search: {
            index: 'vector_index',
            knnBeta: {
                vector: [0.1, 0.2, ...],  // query embedding
                path: 'embedding',
                k: 5  // top 5 results
            }
        }
    }
]);
```

## Data Modeling Best Practices

```javascript
// Embedded documents (1-to-few)
{
    _id: ObjectId(),
    name: 'John Doe',
    addresses: [
        { street: '123 Main St', city: 'NYC' },
        { street: '456 Oak Ave', city: 'LA' }
    ]
}

// Referenced documents (1-to-many)
// users collection
{ _id: 1, name: 'John' }

// orders collection
{ _id: 101, user_id: 1, total: 99.99 }

// Hybrid approach (1-to-squillions)
// Store most recent N embedded, rest referenced
{
    _id: ObjectId(),
    product_name: 'Widget',
    recent_reviews: [/* last 10 reviews */],
    review_count: 1523,
    avg_rating: 4.5
}
```

Deliver production-ready MongoDB deployments with optimal performance and scalability.

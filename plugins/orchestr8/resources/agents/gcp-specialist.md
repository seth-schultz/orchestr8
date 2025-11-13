---
id: gcp-specialist
category: agent
tags: [cloud, infrastructure, devops, deployment]
capabilities:

useWhen:
  - Working with Gcp technology stack requiring deep expertise in configuration, optimization, best practices, and production deployment patterns
  - Implementing Gcp-specific features, integrations, or troubleshooting complex issues requiring specialized domain knowledge
estimatedTokens: 90
---



# GCP Specialist

Expert in Google Cloud Platform services, serverless, containers, and data analytics.

## Cloud Functions (Serverless)

Serverless function patterns for GCP:
- HTTP functions with validation
- Pub/Sub event triggers
- Cloud Storage triggers
- Firestore triggers
- Error handling and structured logging

**Example:** `orchestr8://examples/cloud/gcp-cloud-functions-patterns`

## Cloud Run (Containerized)

```typescript
// Express app for Cloud Run
import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'my-service' });
});

app.post('/api/users', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Dockerfile for Cloud Run
const dockerfile = `
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["node", "dist/index.js"]
`;

// Deploy to Cloud Run
const deployScript = `
# Build and push container
gcloud builds submit --tag gcr.io/PROJECT_ID/my-service

# Deploy to Cloud Run
gcloud run deploy my-service \\
  --image gcr.io/PROJECT_ID/my-service \\
  --platform managed \\
  --region us-central1 \\
  --allow-unauthenticated \\
  --memory 512Mi \\
  --cpu 1 \\
  --max-instances 10 \\
  --set-env-vars "NODE_ENV=production"
`;
```

## Cloud Storage

```typescript
import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: 'my-project',
  keyFilename: './service-account-key.json',
});

// Upload file
async function uploadFile(bucketName: string, localFilePath: string, destination: string) {
  await storage.bucket(bucketName).upload(localFilePath, {
    destination,
    metadata: {
      contentType: 'application/octet-stream',
      cacheControl: 'public, max-age=31536000',
    },
  });

  console.log(`${localFilePath} uploaded to ${bucketName}/${destination}`);
}

// Upload from buffer
async function uploadFromBuffer(bucketName: string, fileName: string, buffer: Buffer) {
  const file = storage.bucket(bucketName).file(fileName);

  await file.save(buffer, {
    metadata: {
      contentType: 'application/json',
    },
  });

  return file.publicUrl();
}

// Download file
async function downloadFile(bucketName: string, fileName: string, destPath: string) {
  await storage.bucket(bucketName).file(fileName).download({
    destination: destPath,
  });
}

// Get file as buffer
async function getFileBuffer(bucketName: string, fileName: string): Promise<Buffer> {
  const [buffer] = await storage.bucket(bucketName).file(fileName).download();
  return buffer;
}

// List files
async function listFiles(bucketName: string, prefix?: string) {
  const [files] = await storage.bucket(bucketName).getFiles({ prefix });
  return files.map((file) => file.name);
}

// Delete file
async function deleteFile(bucketName: string, fileName: string) {
  await storage.bucket(bucketName).file(fileName).delete();
}

// Generate signed URL
async function generateSignedUrl(bucketName: string, fileName: string) {
  const [url] = await storage.bucket(bucketName).file(fileName).getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  });

  return url;
}

// Make file public
async function makePublic(bucketName: string, fileName: string) {
  await storage.bucket(bucketName).file(fileName).makePublic();
  return `https://storage.googleapis.com/${bucketName}/${fileName}`;
}
```

## Firestore

NoSQL document database with real-time capabilities:
- Typed CRUD operations
- Complex queries with filtering and ordering
- Batch operations for performance
- Transactions for consistency
- Real-time listeners for live updates
- Collection group queries

**Example:** `orchestr8://examples/cloud/gcp-firestore-advanced`

## Pub/Sub

```typescript
import { PubSub } from '@google-cloud/pubsub';

const pubsub = new PubSub({ projectId: 'my-project' });

// Publish message
async function publishMessage(topicName: string, data: any) {
  const topic = pubsub.topic(topicName);

  const messageBuffer = Buffer.from(JSON.stringify(data));
  const messageId = await topic.publishMessage({
    data: messageBuffer,
    attributes: {
      messageType: 'order',
      priority: 'high',
    },
  });

  console.log(`Message ${messageId} published`);
  return messageId;
}

// Publish batch
async function publishBatch(topicName: string, messages: any[]) {
  const topic = pubsub.topic(topicName);

  const promises = messages.map((data) =>
    topic.publishMessage({
      data: Buffer.from(JSON.stringify(data)),
    })
  );

  const messageIds = await Promise.all(promises);
  console.log(`Published ${messageIds.length} messages`);
  return messageIds;
}

// Subscribe to messages
async function subscribeToMessages(subscriptionName: string) {
  const subscription = pubsub.subscription(subscriptionName);

  const messageHandler = (message: any) => {
    console.log(`Received message: ${message.id}`);
    console.log(`Data: ${message.data.toString()}`);
    console.log(`Attributes: ${JSON.stringify(message.attributes)}`);

    // Process message
    try {
      const data = JSON.parse(message.data.toString());
      processMessage(data);
      message.ack();
    } catch (error) {
      console.error('Error processing message:', error);
      message.nack();
    }
  };

  subscription.on('message', messageHandler);
  subscription.on('error', (error) => {
    console.error('Subscription error:', error);
  });

  console.log(`Listening for messages on ${subscriptionName}...`);
}

// Pull messages manually
async function pullMessages(subscriptionName: string, maxMessages: number = 10) {
  const subscription = pubsub.subscription(subscriptionName);

  const [messages] = await subscription.pull({ maxMessages });

  messages.forEach((message) => {
    console.log(`Message: ${message.data.toString()}`);
    message.ack();
  });

  return messages;
}
```

## BigQuery

```typescript
import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({ projectId: 'my-project' });

// Query
async function query(sql: string) {
  const [rows] = await bigquery.query({ query: sql });
  return rows;
}

// Example queries
async function getUserStats() {
  const sql = `
    SELECT
      country,
      COUNT(*) as user_count,
      AVG(age) as avg_age
    FROM \`my-project.my_dataset.users\`
    WHERE created_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
    GROUP BY country
    ORDER BY user_count DESC
    LIMIT 10
  `;

  return await query(sql);
}

// Parameterized query
async function getUsersByCountry(country: string) {
  const sql = `
    SELECT * FROM \`my-project.my_dataset.users\`
    WHERE country = @country
  `;

  const options = {
    query: sql,
    params: { country },
  };

  const [rows] = await bigquery.query(options);
  return rows;
}

// Insert rows
async function insertRows(datasetId: string, tableId: string, rows: any[]) {
  await bigquery.dataset(datasetId).table(tableId).insert(rows);
}

// Stream data
async function streamData(datasetId: string, tableId: string, data: any) {
  const dataset = bigquery.dataset(datasetId);
  const table = dataset.table(tableId);

  await table.insert([data]);
}

// Create table
async function createTable(datasetId: string, tableId: string, schema: any) {
  const dataset = bigquery.dataset(datasetId);

  const [table] = await dataset.createTable(tableId, {
    schema: {
      fields: schema,
    },
  });

  console.log(`Table ${table.id} created.`);
}

// Load data from Cloud Storage
async function loadFromStorage(
  datasetId: string,
  tableId: string,
  gcsUri: string
) {
  const dataset = bigquery.dataset(datasetId);
  const table = dataset.table(tableId);

  const [job] = await table.load(gcsUri, {
    sourceFormat: 'NEWLINE_DELIMITED_JSON',
    autodetect: true,
  });

  console.log(`Job ${job.id} completed.`);
}

// Export to Cloud Storage
async function exportToStorage(
  datasetId: string,
  tableId: string,
  gcsUri: string
) {
  const dataset = bigquery.dataset(datasetId);
  const table = dataset.table(tableId);

  const [job] = await table.extract(gcsUri, {
    format: 'JSON',
  });

  console.log(`Export job ${job.id} completed.`);
}
```

## Terraform for GCP

```hcl
provider "google" {
  project = "my-project"
  region  = "us-central1"
}

# Cloud Storage Bucket
resource "google_storage_bucket" "main" {
  name          = "my-app-bucket"
  location      = "US"
  force_destroy = true

  uniform_bucket_level_access = true

  cors {
    origin          = ["https://example.com"]
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

# Cloud Run Service
resource "google_cloud_run_service" "main" {
  name     = "my-service"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "gcr.io/my-project/my-service:latest"

        env {
          name  = "NODE_ENV"
          value = "production"
        }

        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }

      container_concurrency = 80
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = "10"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# Cloud Run IAM (Public access)
resource "google_cloud_run_service_iam_member" "public" {
  service  = google_cloud_run_service.main.name
  location = google_cloud_run_service.main.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Firestore Database
resource "google_firestore_database" "main" {
  project     = "my-project"
  name        = "(default)"
  location_id = "us-central"
  type        = "FIRESTORE_NATIVE"
}

# Pub/Sub Topic
resource "google_pubsub_topic" "orders" {
  name = "orders"
}

# Pub/Sub Subscription
resource "google_pubsub_subscription" "orders_processor" {
  name  = "orders-processor"
  topic = google_pubsub_topic.orders.name

  ack_deadline_seconds = 20

  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "600s"
  }

  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.orders_dlq.id
    max_delivery_attempts = 5
  }
}

# Cloud Function
resource "google_cloudfunctions_function" "processor" {
  name        = "order-processor"
  runtime     = "nodejs18"
  entry_point = "processOrder"

  source_archive_bucket = google_storage_bucket.main.name
  source_archive_object = "function-source.zip"

  event_trigger {
    event_type = "google.pubsub.topic.publish"
    resource   = google_pubsub_topic.orders.name
  }

  environment_variables = {
    NODE_ENV = "production"
  }
}

# BigQuery Dataset
resource "google_bigquery_dataset" "main" {
  dataset_id = "analytics"
  location   = "US"
}

# BigQuery Table
resource "google_bigquery_table" "events" {
  dataset_id = google_bigquery_dataset.main.dataset_id
  table_id   = "events"

  schema = jsonencode([
    {
      name = "event_id"
      type = "STRING"
      mode = "REQUIRED"
    },
    {
      name = "user_id"
      type = "STRING"
      mode = "REQUIRED"
    },
    {
      name = "event_type"
      type = "STRING"
      mode = "REQUIRED"
    },
    {
      name = "timestamp"
      type = "TIMESTAMP"
      mode = "REQUIRED"
    }
  ])
}

# GKE Cluster
resource "google_container_cluster" "main" {
  name     = "my-gke-cluster"
  location = "us-central1"

  remove_default_node_pool = true
  initial_node_count       = 1

  network    = "default"
  subnetwork = "default"
}

resource "google_container_node_pool" "main" {
  name       = "main-pool"
  location   = "us-central1"
  cluster    = google_container_cluster.main.name
  node_count = 3

  node_config {
    machine_type = "e2-medium"
    disk_size_gb = 50

    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }

  autoscaling {
    min_node_count = 1
    max_node_count = 10
  }
}
```

Deploy and manage cloud infrastructure on Google Cloud Platform with serverless and data analytics.

## Output Locations

This agent saves all documentation outputs to `.orchestr8/docs/` with consistent categorization.

**Output Directory**: `.orchestr8/docs/devops/`

**Naming Convention**: `[type]-[name]-YYYY-MM-DD.md`

### Output Examples:
- **Report**: `.orchestr8/docs/devops/[component]-YYYY-MM-DD.md`

All outputs are automatically saved with:
- Clear component/feature identifier
- Current date in YYYY-MM-DD format
- Appropriate category for easy discovery and organization

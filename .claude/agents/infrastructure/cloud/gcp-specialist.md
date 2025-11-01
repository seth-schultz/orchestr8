---
name: gcp-specialist
description: Expert Google Cloud Platform architect specializing in Cloud Functions, Cloud Run, GKE, Firestore, BigQuery, and Cloud Storage. Use for GCP deployments, serverless, and data analytics.
model: claude-sonnet-4-5
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
---

# GCP Specialist

Expert in Google Cloud Platform services, serverless, containers, and data analytics.

## Cloud Functions (Serverless)

```typescript
// HTTP Function
import { HttpFunction } from '@google-cloud/functions-framework';

export const helloWorld: HttpFunction = (req, res) => {
  const name = req.query.name || req.body.name || 'World';
  res.status(200).send(`Hello, ${name}!`);
};

// With TypeScript and validation
import * as functions from '@google-cloud/functions-framework';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().positive(),
});

functions.http('createUser', async (req, res) => {
  try {
    const userData = userSchema.parse(req.body);

    // Process user creation
    const user = await createUserInDatabase(userData);

    res.status(201).json({ success: true, user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Background Function (Pub/Sub)
import { CloudEvent } from '@google-cloud/functions-framework';

interface PubSubMessage {
  data: string;
  attributes?: { [key: string]: string };
}

functions.cloudEvent('processPubSub', async (cloudEvent: CloudEvent<PubSubMessage>) => {
  const message = cloudEvent.data?.data
    ? Buffer.from(cloudEvent.data.data, 'base64').toString()
    : '{}';

  const data = JSON.parse(message);
  console.log('Processing message:', data);

  await processMessage(data);
});

// Storage Trigger
functions.cloudEvent('processFile', async (cloudEvent: CloudEvent<any>) => {
  const file = cloudEvent.data;
  console.log(`File: ${file.name}`);
  console.log(`Bucket: ${file.bucket}`);

  if (file.name.endsWith('.csv')) {
    await processCsvFile(file.bucket, file.name);
  }
});

// Firestore Trigger
functions.cloudEvent('onUserCreated', async (cloudEvent: CloudEvent<any>) => {
  const data = cloudEvent.data?.value?.fields;

  if (data) {
    const userId = cloudEvent.data.value.name.split('/').pop();
    console.log(`New user created: ${userId}`);

    // Send welcome email
    await sendWelcomeEmail(data.email.stringValue);
  }
});
```

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

```typescript
import { Firestore, CollectionReference, Timestamp } from '@google-cloud/firestore';

const db = new Firestore({
  projectId: 'my-project',
  keyFilename: './service-account-key.json',
});

interface User {
  id?: string;
  name: string;
  email: string;
  createdAt: Timestamp;
}

const usersCollection: CollectionReference<User> = db.collection('users') as CollectionReference<User>;

// Create document
async function createUser(userData: Omit<User, 'id' | 'createdAt'>) {
  const docRef = await usersCollection.add({
    ...userData,
    createdAt: Timestamp.now(),
  });

  return { id: docRef.id, ...userData };
}

// Get document
async function getUser(userId: string): Promise<User | null> {
  const doc = await usersCollection.doc(userId).get();
  if (!doc.exists) return null;

  return { id: doc.id, ...doc.data() };
}

// Update document
async function updateUser(userId: string, updates: Partial<User>) {
  await usersCollection.doc(userId).update(updates);
}

// Delete document
async function deleteUser(userId: string) {
  await usersCollection.doc(userId).delete();
}

// Query documents
async function getUsersByEmail(email: string): Promise<User[]> {
  const snapshot = await usersCollection.where('email', '==', email).get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Complex query
async function getActiveUsers(limit: number = 10) {
  const snapshot = await usersCollection
    .where('active', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Batch operations
async function batchCreate(users: Omit<User, 'id' | 'createdAt'>[]) {
  const batch = db.batch();

  users.forEach((user) => {
    const docRef = usersCollection.doc();
    batch.set(docRef, {
      ...user,
      createdAt: Timestamp.now(),
    });
  });

  await batch.commit();
}

// Transaction
async function transferCredits(fromUserId: string, toUserId: string, amount: number) {
  await db.runTransaction(async (transaction) => {
    const fromDoc = usersCollection.doc(fromUserId);
    const toDoc = usersCollection.doc(toUserId);

    const fromSnapshot = await transaction.get(fromDoc);
    const toSnapshot = await transaction.get(toDoc);

    const fromCredits = fromSnapshot.data()?.credits || 0;
    const toCredits = toSnapshot.data()?.credits || 0;

    if (fromCredits < amount) {
      throw new Error('Insufficient credits');
    }

    transaction.update(fromDoc, { credits: fromCredits - amount });
    transaction.update(toDoc, { credits: toCredits + amount });
  });
}

// Real-time listener
function listenToUser(userId: string, callback: (user: User | null) => void) {
  return usersCollection.doc(userId).onSnapshot((doc) => {
    if (doc.exists) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  });
}

// Collection group query
async function getAllOrders() {
  const snapshot = await db.collectionGroup('orders').get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
```

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

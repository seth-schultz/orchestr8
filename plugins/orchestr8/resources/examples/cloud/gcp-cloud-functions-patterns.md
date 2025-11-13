---
id: gcp-cloud-functions-patterns
category: example
tags: [gcp, serverless, cloud-functions, typescript, event-driven]
capabilities:
  - HTTP functions with validation
  - Pub/Sub event triggers
  - Cloud Storage triggers
  - Firestore triggers
  - Error handling and logging
useWhen:
  - Building serverless functions on GCP
  - Implementing event-driven architectures
  - Processing cloud storage events
  - Reacting to Firestore changes
estimatedTokens: 650
relatedResources:
  - orchestr8://agents/gcp-specialist
---

# GCP Cloud Functions Patterns

## Overview
Production-ready Cloud Functions patterns for HTTP endpoints, Pub/Sub messaging, storage triggers, and Firestore events.

## Implementation

```typescript
// HTTP Function with validation
import { HttpFunction } from '@google-cloud/functions-framework';
import * as functions from '@google-cloud/functions-framework';
import { z } from 'zod';

export const helloWorld: HttpFunction = (req, res) => {
  const name = req.query.name || req.body.name || 'World';
  res.status(200).send(`Hello, ${name}!`);
};

// With TypeScript and validation
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

## Usage Notes

**HTTP Functions:**
- Direct invocation via HTTPS endpoint
- Request/response pattern like Express
- Support for query parameters and request body
- Use Zod or similar for input validation

**Pub/Sub Triggers:**
- Event-driven, asynchronous processing
- Message data is base64 encoded in CloudEvent
- Automatic retries on failure
- Use for decoupled microservices

**Storage Triggers:**
- React to file uploads, updates, deletes
- Access file metadata from CloudEvent
- Process files asynchronously
- Useful for ETL pipelines

**Firestore Triggers:**
- React to document create, update, delete
- Access document data and metadata
- Useful for data validation, notifications
- Supports wildcard paths for dynamic collections

**Deployment:**
```bash
# Deploy HTTP function
gcloud functions deploy createUser \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated

# Deploy Pub/Sub trigger
gcloud functions deploy processPubSub \
  --runtime nodejs18 \
  --trigger-topic my-topic

# Deploy Storage trigger
gcloud functions deploy processFile \
  --runtime nodejs18 \
  --trigger-resource my-bucket \
  --trigger-event google.storage.object.finalize
```

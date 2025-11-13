---
id: gcp-firestore-advanced
category: example
tags: [gcp, firestore, nosql, transactions, real-time]
capabilities:
  - CRUD operations with TypeScript types
  - Complex queries and filtering
  - Batch operations for performance
  - Transactions for data consistency
  - Real-time listeners
useWhen:
  - Building applications with Firestore
  - Need NoSQL document database on GCP
  - Implementing real-time features
  - Batch updates or transactional operations
estimatedTokens: 850
relatedResources:
  - orchestr8://agents/gcp-specialist
---

# GCP Firestore Advanced Patterns

## Overview
Production Firestore patterns including typed operations, complex queries, batch updates, transactions, and real-time listeners.

## Implementation

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

## Usage Notes

**Type Safety:**
- Use TypeScript interfaces for document structure
- Cast collections to typed CollectionReference
- Type-safe queries and results
- Omit auto-generated fields in create operations

**Queries:**
- Where clauses for filtering
- OrderBy for sorting (requires composite index for multiple fields)
- Limit for pagination
- Composite indexes created automatically or via Firebase Console

**Batch Operations:**
- Batch up to 500 operations
- Atomic - all succeed or all fail
- More efficient than individual writes
- Use for bulk updates or deletes

**Transactions:**
- Read before write within transaction
- Automatic retries on conflicts
- Use for operations requiring consistency (transfers, inventory)
- Maximum 500 documents per transaction

**Real-time Listeners:**
- Subscribe to document or collection changes
- Callback invoked on updates
- Return unsubscribe function for cleanup
- Use sparingly - billed per listener

**Collection Groups:**
- Query across all collections with same name
- Useful for hierarchical data structures
- Requires collection group index

import { MongoClient } from 'mongodb';
import type { MongoUser, MongoReport, MongoAnalysis } from '@/types/mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getCollection<T extends MongoUser | MongoReport | MongoAnalysis>(
  collectionName: string
): Promise<import('mongodb').Collection<T>> {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<T>(collectionName);
}

export { clientPromise };

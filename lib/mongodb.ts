import { MongoClient } from 'mongodb';
import type { MongoUser, MongoReport, MongoAnalysis } from '@/types/mongodb';

// Use a default URI for development if MONGODB_URI is not set
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/propinfera-dev';

// Only throw error in production if URI is missing
if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is required in production');
}

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect().catch(error => {
      console.error('Failed to connect to MongoDB:', error);
      throw new Error('Failed to connect to MongoDB. Please check your connection string and ensure MongoDB is running.');
    });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch(error => {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB. Please check your connection string and ensure MongoDB is running.');
  });
}

export async function getCollection<T extends MongoUser | MongoReport | MongoAnalysis>(
  collectionName: string
): Promise<import('mongodb').Collection<T>> {
  try {
    const client = await clientPromise;
    const db = client.db();
    return db.collection<T>(collectionName);
  } catch (error) {
    console.error(`Failed to get collection ${collectionName}:`, error);
    throw new Error(`Failed to access MongoDB collection: ${collectionName}`);
  }
}

export { clientPromise };

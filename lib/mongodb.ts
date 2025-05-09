import { MongoClient, Document } from 'mongodb';

// Mock MongoDB client for deployment
const mockClient = {
  db: () => ({
    collection: () => ({
      find: () => ({ toArray: async () => [] }),
      findOne: async () => null,
      insertOne: async () => ({ insertedId: 'mock-id' }),
      updateOne: async () => ({ matchedCount: 0 }),
      deleteOne: async () => ({ deletedCount: 0 }),
    }),
  }),
  close: async () => {},
} as unknown as MongoClient;

export const clientPromise = Promise.resolve(mockClient);

// Mock getCollection function
export async function getCollection<T extends Document>(collectionName: string) {
  return mockClient.db().collection<T>(collectionName);
} 
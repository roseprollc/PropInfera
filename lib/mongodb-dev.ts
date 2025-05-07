import { MongoClient, Collection, ObjectId } from 'mongodb';
import type { MongoDocument } from '@/types/mongodb';

// Mock database for development
const mockDb = new Map<string, any[]>();

// Mock collection class
class MockCollection<T extends MongoDocument> {
  private data: T[] = [];

  constructor(private collectionName: string) {
    if (!mockDb.has(collectionName)) {
      mockDb.set(collectionName, []);
    }
    this.data = mockDb.get(collectionName) as T[];
  }

  async findOne(query: Partial<T>): Promise<T | null> {
    return this.data.find(doc => 
      Object.entries(query).every(([key, value]) => doc[key as keyof T] === value)
    ) || null;
  }

  async find(query: Partial<T>): Promise<T[]> {
    return this.data.filter(doc => 
      Object.entries(query).every(([key, value]) => doc[key as keyof T] === value)
    );
  }

  async insertOne(doc: Omit<T, '_id'>): Promise<{ insertedId: ObjectId }> {
    const newDoc = {
      ...doc,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date()
    } as unknown as T;
    this.data.push(newDoc);
    mockDb.set(this.collectionName, this.data);
    return { insertedId: newDoc._id };
  }

  async updateOne(query: Partial<T>, update: { $set: Partial<T> }): Promise<{ modifiedCount: number }> {
    const index = this.data.findIndex(doc => 
      Object.entries(query).every(([key, value]) => doc[key as keyof T] === value)
    );
    if (index === -1) return { modifiedCount: 0 };
    
    this.data[index] = {
      ...this.data[index],
      ...update.$set,
      updatedAt: new Date()
    };
    mockDb.set(this.collectionName, this.data);
    return { modifiedCount: 1 };
  }

  async deleteOne(query: Partial<T>): Promise<{ deletedCount: number }> {
    const index = this.data.findIndex(doc => 
      Object.entries(query).every(([key, value]) => doc[key as keyof T] === value)
    );
    if (index === -1) return { deletedCount: 0 };
    
    this.data.splice(index, 1);
    mockDb.set(this.collectionName, this.data);
    return { deletedCount: 1 };
  }
}

let mongoClient: MongoClient | null = null;
let mongoClientPromise: Promise<MongoClient> | null = null;

export async function getCollection<T extends MongoDocument>(
  collectionName: string
): Promise<Collection<T> | MockCollection<T>> {
  if (process.env.NODE_ENV === 'development') {
    try {
      if (!mongoClientPromise) {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGODB_URI is not defined');
        
        mongoClient = new MongoClient(uri);
        mongoClientPromise = mongoClient.connect();
      }
      
      const connectedClient = await mongoClientPromise;
      const db = connectedClient.db();
      return db.collection<T>(collectionName);
    } catch (error) {
      console.warn('MongoDB connection failed, using mock database:', error);
      return new MockCollection<T>(collectionName);
    }
  }
  
  // Production: Always use real MongoDB
  if (!mongoClientPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not defined');
    
    mongoClient = new MongoClient(uri);
    mongoClientPromise = mongoClient.connect();
  }
  
  const connectedClient = await mongoClientPromise;
  const db = connectedClient.db();
  return db.collection<T>(collectionName);
}

export { mongoClientPromise as clientPromise }; 
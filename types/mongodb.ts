import { ObjectId } from 'mongodb';

export interface MongoDocument {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface MongoUser extends MongoDocument {
  email: string;
  tier: string;
}

export interface MongoReport extends MongoDocument {
  email: string;
  propertyAddress: string;
  metrics: Record<string, any>;
}

export interface MongoAnalysis extends MongoDocument {
  type: string;
  data: Record<string, any>;
  title: string;
  notes?: string;
  userId: string;
}

export type MongoCollection<T extends MongoDocument> = {
  findOne: (query: Partial<T>) => Promise<T | null>;
  find: (query: Partial<T>) => Promise<T[]>;
  insertOne: (doc: Omit<T, '_id'>) => Promise<{ insertedId: ObjectId }>;
  updateOne: (query: Partial<T>, update: { $set: Partial<T> }) => Promise<{ modifiedCount: number }>;
  deleteOne: (query: Partial<T>) => Promise<{ deletedCount: number }>;
}; 
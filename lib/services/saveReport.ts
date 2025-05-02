import clientPromise from '@/lib/mongodb';
import type { Analysis } from '@/types/analysis';
import { ObjectId } from 'mongodb';

export async function saveReportToDB(data: Partial<Analysis>, userId: string) {
  const client = await clientPromise;
  const db = client.db();
  
  const result = await db.collection('reports').insertOne({
    ...data,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: new ObjectId()
  });

  return result.insertedId;
} 
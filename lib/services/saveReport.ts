import clientPromise from '@/lib/mongodb';
import type { Analysis } from '@/types/analysis';

export async function saveReportToDB(data: Partial<Analysis>, userId: string) {
  const client = await clientPromise;
  const db = client.db();
  
  const result = await db.collection('reports').insertOne({
    ...data,
    userId,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  return result.insertedId;
} 
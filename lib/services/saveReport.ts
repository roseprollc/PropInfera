import type { Report } from '@/types/analysis';
import { handleApiError } from '@/lib/utils/handleApiError';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export const saveReportToDB = async (data: Partial<Report>, email: string) => {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock implementation
    console.log('Saving report for', email);
    return { success: true, reportId: 'mock-id' };
  } catch (e) {
    return handleApiError(e, 'saveReportToDB');
  }
};

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
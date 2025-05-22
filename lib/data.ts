import { MongoClient, ObjectId, WithId, Document } from 'mongodb';
import type { Analysis, CalculatorType } from '@/types/analysis';
import { connectToDatabase } from './mongodb';
import { parseAnalysis, parseAnalyses, isValidCreatePayload, isValidUpdatePayload } from './utils/db/parsers';

export type { Analysis };

const client = new MongoClient(process.env.MONGODB_URI || '');
const db = client.db('propinfera');

export async function getAnalysisById<T extends CalculatorType>(
  id: string
): Promise<Analysis<T> | null> {
  try {
    const { db } = await connectToDatabase();
    const objectId = new ObjectId(id);
    const doc = await db.collection('analyses').findOne({ _id: objectId });
    if (!doc) return null;
    return parseAnalysis<T>(doc);
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return null;
  }
}

export async function saveAnalysis<T extends CalculatorType>(
  analysis: Omit<Analysis<T>, '_id'>
): Promise<Analysis<T> | null> {
  try {
    if (!isValidCreatePayload(analysis)) {
      throw new Error('Invalid analysis data');
    }

    const { db } = await connectToDatabase();
    const result = await db.collection('analyses').insertOne(analysis);
    if (!result.insertedId) {
      throw new Error('Failed to insert analysis');
    }
    return getAnalysisById<T>(result.insertedId.toString());
  } catch (error) {
    console.error('Error saving analysis:', error);
    return null;
  }
}

export async function updateAnalysis<T extends CalculatorType>(
  id: string,
  data: Partial<Omit<Analysis<T>, '_id' | 'userId' | 'createdAt' | 'type'>>
): Promise<Analysis<T> | null> {
  try {
    if (!isValidUpdatePayload({ ...data, _id: id })) {
      throw new Error('Invalid update data');
    }

    const { db } = await connectToDatabase();
    const objectId = new ObjectId(id);
    const result = await db.collection('analyses').findOneAndUpdate(
      { _id: objectId },
      { $set: { ...data, updatedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    );

    if (!result?.value) return null;
    return parseAnalysis<T>(result.value);
  } catch (error) {
    console.error('Error updating analysis:', error);
    return null;
  }
}

export async function updateInsightsById(id: string, insights: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const objectId = new ObjectId(id);
    const result = await db.collection('analyses').updateOne(
      { _id: objectId },
      { 
        $set: { 
          insights,
          insightsLastGeneratedAt: new Date().toISOString()
        }
      }
    );
    return result.modifiedCount === 1;
  } catch (error) {
    console.error('Error updating insights:', error);
    return false;
  }
}

export async function deleteAnalysis(id: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const objectId = new ObjectId(id);
    const result = await db.collection('analyses').deleteOne({ _id: objectId });
    return result.deletedCount === 1;
  } catch (error) {
    console.error('Error deleting analysis:', error);
    return false;
  }
}

export async function getSavedAnalyses<T extends CalculatorType>(
  userId?: string
): Promise<Analysis<T>[]> {
  try {
    const { db } = await connectToDatabase();
    const query = userId ? { userId } : {};
    const docs = await db.collection('analyses')
      .find<WithId<Document>>(query)
      .sort({ createdAt: -1 })
      .toArray();
    return parseAnalyses<T>(docs);
  } catch (error) {
    console.error('Error fetching saved analyses:', error);
    return [];
  }
} 
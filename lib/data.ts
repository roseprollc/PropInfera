import { MongoClient, ObjectId, WithId, Document } from 'mongodb';
import type { Analysis, CalculatorType } from '@/types/analysis';
import { getDb } from './mongodb';
import { parseAnalysis, parseAnalyses, isValidCreatePayload, isValidUpdatePayload } from './utils/db/parsers';

export type { Analysis };

export async function getAnalysisById<T extends CalculatorType>(
  id: string
): Promise<Analysis<T> | null> {
  try {
    const db = await getDb();
    const objectId = new ObjectId(id);
    const doc = await db.collection('analyses').findOne({ _id: objectId });
    return doc ? parseAnalysis<T>(doc) : null;
  } catch (error) {
    console.error('Error getting analysis by ID:', error);
    return null;
  }
}

export async function createAnalysis<T extends CalculatorType>(
  analysis: Omit<Analysis<T>, '_id'>
): Promise<Analysis<T> | null> {
  try {
    if (!isValidCreatePayload(analysis)) {
      throw new Error('Invalid analysis data');
    }

    const db = await getDb();
    const result = await db.collection('analyses').insertOne(analysis);
    if (!result.insertedId) {
      throw new Error('Failed to insert analysis');
    }

    return {
      ...analysis,
      _id: result.insertedId
    } as Analysis<T>;
  } catch (error) {
    console.error('Error creating analysis:', error);
    return null;
  }
}

export async function updateAnalysis<T extends CalculatorType>(
  id: string,
  updates: Partial<Analysis<T>>
): Promise<Analysis<T> | null> {
  try {
    if (!isValidUpdatePayload(updates)) {
      throw new Error('Invalid update data');
    }

    const db = await getDb();
    const objectId = new ObjectId(id);
    const result = await db.collection('analyses').findOneAndUpdate(
      { _id: objectId },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result || !result.value) {
      return null;
    }

    return parseAnalysis<T>(result.value);
  } catch (error) {
    console.error('Error updating analysis:', error);
    return null;
  }
}

export async function updateInsightsById(id: string, insights: string): Promise<boolean> {
  try {
    const db = await getDb();
    const objectId = new ObjectId(id);
    const result = await db.collection('analyses').updateOne(
      { _id: objectId },
      { $set: { insights } }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating insights:', error);
    return false;
  }
}

export async function deleteAnalysis(id: string): Promise<boolean> {
  try {
    const db = await getDb();
    const objectId = new ObjectId(id);
    const result = await db.collection('analyses').deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting analysis:', error);
    return false;
  }
}

export async function getAnalysesByUserId<T extends CalculatorType>(
  userId: string
): Promise<Analysis<T>[]> {
  try {
    const db = await getDb();
    const query = userId ? { userId } : {};
    const docs = await db.collection('analyses')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    return parseAnalyses<T>(docs);
  } catch (error) {
    console.error('Error getting analyses by user ID:', error);
    return [];
  }
} 
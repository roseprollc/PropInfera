import { MongoClient, ObjectId } from 'mongodb';
import { Analysis } from '@/types/analysis';

const client = new MongoClient(process.env.MONGODB_URI || '');
const db = client.db('propinfera');

export async function getAnalysisById(id: string): Promise<Analysis | null> {
  try {
    await client.connect();
    const analysis = await db.collection('analyses').findOne<Analysis>({ _id: new ObjectId(id) });
    return analysis;
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return null;
  } finally {
    await client.close();
  }
}

export async function saveAnalysis(analysis: Omit<Analysis, '_id'>): Promise<Analysis | null> {
  try {
    await client.connect();
    const result = await db.collection('analyses').insertOne(analysis);
    return { ...analysis, _id: result.insertedId.toHexString() };
  } catch (error) {
    console.error('Error saving analysis:', error);
    return null;
  } finally {
    await client.close();
  }
}

export async function updateAnalysis(id: string, updates: Partial<Analysis>): Promise<Analysis | null> {
  try {
    await client.connect();
    const result = await db.collection('analyses').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );
    return result?.value as Analysis | null;
  } catch (error) {
    console.error('Error updating analysis:', error);
    return null;
  } finally {
    await client.close();
  }
}

export async function updateInsightsById(id: string, insights: string): Promise<boolean> {
  try {
    await client.connect();
    const result = await db.collection('analyses').updateOne(
      { _id: new ObjectId(id) },
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
  } finally {
    await client.close();
  }
}

export async function getSavedAnalyses(): Promise<Analysis[]> {
  try {
    await client.connect();
    const analyses = await db.collection('analyses')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return analyses as Analysis[];
  } catch (error) {
    console.error('Error fetching saved analyses:', error);
    return [];
  } finally {
    await client.close();
  }
} 
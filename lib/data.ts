import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';
import { connectToDatabase } from './mongodb';
import { Analysis } from '@/types/analysis';

export interface Analysis {
  _id: ObjectId;
  userId: string;
  type: 'rental' | 'airbnb' | 'wholesale' | 'mortgage';
  propertyName: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  inputs: Record<string, any>;
  results: Record<string, number>;
}

export async function getAnalysisById(id: string): Promise<Analysis | null> {
  try {
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      console.error('Invalid ObjectId format:', id);
      return null;
    }

    const client = await clientPromise;
    const db = client.db('propinfera');
    const analysis = await db.collection('analyses').findOne({ _id: new ObjectId(id) });

    if (!analysis) {
      console.error('Analysis not found:', id);
      return null;
    }

    return analysis as Analysis;
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return null;
  }
}

export async function updateAnalysisById(
  id: string,
  updates: Partial<Analysis>
): Promise<Analysis | null> {
  try {
    if (!ObjectId.isValid(id)) {
      console.error('Invalid ObjectId format:', id);
      return null;
    }

    const client = await clientPromise;
    const db = client.db('propinfera');
    
    const result = await db.collection('analyses').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updates,
          updatedAt: new Date().toISOString()
        }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      console.error('Failed to update analysis:', id);
      return null;
    }

    return result as Analysis;
  } catch (error) {
    console.error('Error updating analysis:', error);
    return null;
  }
}

export async function updateInsightsById(id: string, insights: string): Promise<boolean> {
  try {
    if (!ObjectId.isValid(id)) {
      console.error('Invalid ObjectId format:', id);
      return false;
    }

    const { db } = await connectToDatabase();
    const result = await db.collection('analyses').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          insights,
          insightsUpdatedAt: new Date()
        }
      }
    );

    return result.modifiedCount === 1;
  } catch (error) {
    console.error('Error updating insights:', error);
    return false;
  }
}

export async function getSavedAnalyses(): Promise<Analysis[]> {
  try {
    const { db } = await connectToDatabase();
    const analyses = await db.collection('analyses')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    if (!Array.isArray(analyses)) {
      console.error('Invalid response from MongoDB: expected array but got', typeof analyses);
      return [];
    }

    return analyses as Analysis[];
  } catch (error) {
    console.error('Error fetching saved analyses:', error);
    return [];
  }
} 
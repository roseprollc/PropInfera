import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { Analysis } from '@/lib/data';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid analysis ID' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('propinfera');
    
    // Get the request body
    const updates: Partial<Analysis> = await request.json();

    // Validate required fields
    if (!updates.propertyName?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Update the analysis
    const result = await db.collection('analyses').findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { 
        $set: {
          ...updates,
          updatedAt: new Date().toISOString()
        }
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating analysis:', error);
    return NextResponse.json(
      { error: 'Failed to update analysis' },
      { status: 500 }
    );
  }
} 
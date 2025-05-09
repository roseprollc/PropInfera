import { NextRequest, NextResponse } from 'next/server';
import { clientPromise } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('analyses');

    // Validate ID
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid analysis ID' }, { status: 400 });
    }

    // Get the request body
    const updates = await request.json();

    // Validate required fields
    if (!updates.title?.trim()) {
      return NextResponse.json(
        { error: 'Property name is required' },
        { status: 400 }
      );
    }

    // Update the analysis
    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Analysis updated successfully' });
  } catch (error) {
    console.error('Error updating analysis:', error);
    return NextResponse.json(
      { error: 'Failed to update analysis' },
      { status: 500 }
    );
  }
}
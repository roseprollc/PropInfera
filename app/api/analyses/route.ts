import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Define the Analysis type
interface Analysis {
  _id?: ObjectId;
  userId: string;
  type: 'renters' | 'airbnb' | 'wholesale' | 'mortgage';
  title?: string;
  notes?: string;
  inputs: Record<string, unknown>;
  results: Record<string, unknown>;
  createdAt: Date;
}

// Response types
interface ErrorResponse {
  error: string;
  details?: unknown;
}

interface SuccessResponse<T> {
  data: T;
  message?: string;
}

// GET handler
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const client = await clientPromise;
    const db = client.db('propinfera');
    const collection = db.collection<Analysis>('analyses');

    // Build query based on userId parameter
    const query = userId ? { userId } : {};

    const analyses = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const response: SuccessResponse<Analysis[]> = {
      data: analyses,
      message: `Found ${analyses.length} analyses`
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching analyses:', error);
    const response: ErrorResponse = {
      error: 'Failed to fetch analyses',
      details: error instanceof Error ? error.message : undefined
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['userId', 'type', 'inputs', 'results'] as const;
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      const response: ErrorResponse = {
        error: 'Missing required fields',
        details: missingFields
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate analysis type
    const validTypes = ['renters', 'airbnb', 'wholesale', 'mortgage'] as const;
    if (!validTypes.includes(body.type)) {
      const response: ErrorResponse = {
        error: 'Invalid analysis type',
        details: `Type must be one of: ${validTypes.join(', ')}`
      };
      return NextResponse.json(response, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('propinfera');
    const collection = db.collection<Analysis>('analyses');

    // Create analysis document with proper typing
    const analysis: Analysis = {
      userId: body.userId,
      type: body.type,
      inputs: body.inputs,
      results: body.results,
      title: body.title,
      notes: body.notes,
      createdAt: new Date()
    };

    const result = await collection.insertOne(analysis);

    const response: SuccessResponse<Analysis> = {
      data: { ...analysis, _id: result.insertedId },
      message: 'Analysis saved successfully'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error saving analysis:', error);
    const response: ErrorResponse = {
      error: 'Failed to save analysis',
      details: error instanceof Error ? error.message : undefined
    };
    return NextResponse.json(response, { status: 500 });
  }
} 
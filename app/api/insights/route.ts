import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getAnalysisById, updateInsightsById } from '@/lib/data';
import { generateInsights } from '@/lib/ai/generateInsights';

// Simple in-memory rate limiting
const rateLimit = new Map<string, number>();
const RATE_LIMIT_WINDOW = 10 * 1000; // 10 seconds in milliseconds

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const lastRequest = rateLimit.get(ip);
    
    if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait 10 seconds before trying again.' },
        { status: 429 }
      );
    }
    
    // Update rate limit
    rateLimit.set(ip, now);

    // Validate request body
    const body = await request.json();
    const { id } = body;
    const shouldRefresh = new URL(request.url).searchParams.get('refresh') === 'true';

    if (!id) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid analysis ID format' },
        { status: 400 }
      );
    }

    // Fetch analysis data
    const analysis = await getAnalysisById(id);
    
    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    // Return cached insights if they exist and refresh is not requested
    if (analysis.insights && !shouldRefresh) {
      return NextResponse.json({ 
        insights: analysis.insights,
        cached: true,
        updatedAt: analysis.insightsUpdatedAt
      });
    }

    // Generate new insights
    const insights = await generateInsights(analysis);

    // Update the analysis with new insights
    const success = await updateInsightsById(id, insights);

    if (!success) {
      console.error('Failed to update insights in database');
    }

    return NextResponse.json({ 
      insights,
      cached: false,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights. Please try again later.' },
      { status: 500 }
    );
  }
}

// Only allow POST method
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 
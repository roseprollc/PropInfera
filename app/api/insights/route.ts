import { NextResponse } from 'next/server';
import { clientPromise } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { generateInsights } from '@/lib/ai/generateInsights';
import type { Analysis } from '@/types/analysis';

export const dynamic = 'force-dynamic';

// Define a type that extends Analysis to include insights
interface AnalysisWithInsights extends Analysis {
  insights?: {
    content: string;
    generatedAt: Date;
    modelVersion: string;
  };
}

// Function to get analysis by ID from MongoDB directly
async function getAnalysisById(id: string): Promise<AnalysisWithInsights | null> {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    if (!ObjectId.isValid(id)) {
      return null;
    }
    
    const analysis = await db.collection('analyses').findOne({ 
      _id: new ObjectId(id) 
    });
    
    return analysis as AnalysisWithInsights;
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const shouldRefresh = searchParams.get('refresh') === 'true';
    const id = (await params).id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      );
    }
    
    // Get analysis using the local function
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
      });
    }
    
    // Generate new insights if none exist or refresh is requested
    const insightsContent = await generateInsights(analysis);
    
    // Update the analysis with new insights
    const updatedAnalysis = {
      ...analysis,
      insights: {
        content: insightsContent,
        generatedAt: new Date(),
        modelVersion: 'gpt-4-turbo'
      }
    };
    
    // Save the updated insights
    try {
      const client = await clientPromise;
      const db = client.db();
      
      await db.collection('analyses').updateOne(
        { _id: new ObjectId(id) },
        { $set: { insights: updatedAnalysis.insights } }
      );
    } catch (updateError) {
      console.error('Error updating insights:', updateError);
      // Continue anyway to return the generated insights
    }
    
    return NextResponse.json({
      insights: updatedAnalysis.insights,
      cached: false
    });
  } catch (error) {
    console.error('[INSIGHTS_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
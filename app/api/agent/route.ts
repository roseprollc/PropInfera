import { NextResponse } from 'next/server';
import { generateInsights } from '@/lib/ai/generateInsights';
import type { InsightRequest, InsightResponse } from '@/types/insights';

export async function POST(request: Request) {
  try {
    const { analysis, mode, userTier }: InsightRequest = await request.json();

    if (!analysis || !mode) {
      return NextResponse.json(
        { error: 'Analysis and mode are required' },
        { status: 400 }
      );
    }

    // For free users, return limited insights
    if (userTier === 'free') {
      return NextResponse.json({
        insight: {
          summary: 'Upgrade to Pro or Elite to unlock full AI analysis',
          mode,
          isMock: true,
          analysisId: analysis._id?.toString() || '',
          createdAt: new Date().toISOString()
        }
      });
    }

    // Generate insights for Pro/Elite users
    const insight = await generateInsights(analysis);

    const response: InsightResponse = { insight };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Insight generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
} 
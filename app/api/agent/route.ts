import { NextResponse } from 'next/server';
import { generateInsights } from '@/lib/ai/generateInsights';
import type { Analysis } from '@/types/analysis';
import type { GPTInsight } from '@/types/insights';

interface InsightResponse {
  insight: GPTInsight;
}

export async function POST(request: Request) {
  try {
    const analysis: Analysis<any> = await request.json();
    const insight = await generateInsights(analysis);
    const response: InsightResponse = { insight };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  // Mocked AI logic — later plug in OpenAI API or RAG backend
  const insight = `AI Insight for: ${prompt}`;
  return NextResponse.json({ insight });
} 
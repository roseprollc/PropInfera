import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  return NextResponse.json({
    success: true,
    data: { address: '123 Mock St', city: 'Demo City', price: 500000, url },
  });
} 
import { NextResponse } from 'next/server';

export const handleApiError = (e: unknown, context: string = '') => {
  console.error(`[${context}]`, e);
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}; 
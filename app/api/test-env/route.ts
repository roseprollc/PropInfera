import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    authUrl: process.env.NEXTAUTH_URL,
    dbConnected: !!process.env.MONGODB_URI,
    hasAuthSecret: !!process.env.NEXTAUTH_SECRET
  });
} 
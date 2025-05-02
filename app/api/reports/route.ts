import { NextRequest, NextResponse } from 'next/server';
import { saveReportToDB } from '@/lib/services/saveReport';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await req.json();
  try {
    const result = await saveReportToDB(data, session.user.email);
    return NextResponse.json({ success: true, result });
  } catch (e) {
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
} 
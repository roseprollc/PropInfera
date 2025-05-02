import { NextRequest, NextResponse } from 'next/server';
import { updateUserTier } from '@/lib/services/userService';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { newTier } = await req.json();
  try {
    await updateUserTier(session.user.email, newTier);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Upgrade failed' }, { status: 500 });
  }
} 
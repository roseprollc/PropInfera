import { getServerSession } from 'next-auth';
import { authOptions } from './authOptions';
import { redirect } from 'next/navigation';

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  tier?: 'free' | 'pro' | 'elite';
}

export async function getSession(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email || '',
    name: session.user.name,
    image: session.user.image,
    tier: session.user.tier
  };
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  return session;
}

export async function requireProSession(): Promise<SessionUser> {
  const session = await requireSession();
  
  if (session.tier !== 'pro' && session.tier !== 'elite') {
    redirect('/pricing');
  }

  return session;
}

export async function requireEliteSession(): Promise<SessionUser> {
  const session = await requireSession();
  
  if (session.tier !== 'elite') {
    redirect('/pricing');
  }

  return session;
} 
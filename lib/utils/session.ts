import { getServerSession } from 'next-auth';
import { AuthenticationError } from './handleApiError';

export interface SessionUser {
  email: string;
  name?: string | null;
  image?: string | null;
  tier?: string;
}

export async function getValidatedSession(): Promise<SessionUser> {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    throw new AuthenticationError('No valid session found');
  }

  return {
    email: session.user.email,
    name: session.user.name || undefined,
    image: session.user.image || undefined,
    tier: (session.user as any).tier
  };
}

export async function requireSession(): Promise<SessionUser> {
  try {
    return await getValidatedSession();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new AuthenticationError('Failed to validate session');
  }
}

export async function getOptionalSession(): Promise<SessionUser | null> {
  try {
    return await getValidatedSession();
  } catch {
    return null;
  }
} 
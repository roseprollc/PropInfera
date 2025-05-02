import clientPromise from '@/lib/mongodb';
import type { UserTier } from '@/types/user';

export async function updateUserTier(email: string, newTier: UserTier) {
  const client = await clientPromise;
  const db = client.db();
  
  await db.collection('users').updateOne(
    { email },
    { $set: { tier: newTier, updatedAt: new Date() } }
  );
} 
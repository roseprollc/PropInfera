import clientPromise from '@/lib/mongodb';
import type { UserTier } from '@/types/user';

export const updateUserTier = async (email: string, tier: string) => {
  console.log(`Upgraded user ${email} to tier ${tier}`);
  return { success: true };
};

export async function updateUserTier(email: string, newTier: UserTier) {
  const client = await clientPromise;
  const db = client.db();
  
  const result = await db.collection('users').updateOne(
    { email },
    { $set: { tier: newTier, updatedAt: new Date() } }
  );

  return result.modifiedCount;
} 
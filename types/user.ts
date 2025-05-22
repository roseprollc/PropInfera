export type UserTier = 'free' | 'pro' | 'elite';

export interface User {
  id: string;
  email: string;
  tier: UserTier;
  createdAt: Date;
  updatedAt: Date;
} 
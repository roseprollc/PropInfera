export type UserTier = 'free' | 'pro' | 'enterprise';

export interface User {
  email: string;
  tier: UserTier;
  createdAt: Date;
  updatedAt: Date;
} 
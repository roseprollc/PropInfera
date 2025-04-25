export enum TierLevel {
  FREE = 'FREE',
  PRO = 'PRO',
  ELITE = 'ELITE'
}

export interface TierContextType {
  tier: TierLevel;
  setTier: (tier: TierLevel) => void;
  isPro: boolean;
  isElite: boolean;
} 
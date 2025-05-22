import type { Analysis, CalculatorType } from './analysis';

export type InsightMode = CalculatorType;

export interface GPTInsight {
  summary: string;
  roiAnalysis?: string;
  marketComparison?: string;
  riskFlags?: string[];
  strategyAdvice?: string;
  recommendations?: string[];
  mode: InsightMode;
  isMock: boolean;
  analysisId: string;
  createdAt: string;
}

export interface InsightResponse {
  insight: GPTInsight;
  error?: string;
}

export interface InsightRequest {
  analysis: Analysis<CalculatorType>;
  mode: InsightMode;
  userTier: 'free' | 'pro' | 'elite';
} 
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { Analysis, CalculatorType } from '@/types/analysis';
import type { GPTInsight, InsightMode } from '@/types/insights';

interface UseInsightsProps {
  userTier: 'free' | 'pro' | 'elite';
}

export const useInsights = ({ userTier }: UseInsightsProps) => {
  const [insight, setInsight] = useState<GPTInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateInsights = useCallback(async <T extends CalculatorType>(
    analysis: Analysis<T>,
    mode: T
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis, mode, userTier })
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const data = await response.json();
      setInsight(data.insight);

      if (data.insight.isMock) {
        toast.info('Using AI-powered insights (mock data)');
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate insights');
    } finally {
      setIsLoading(false);
    }
  }, [userTier]);

  const clearInsights = useCallback(() => {
    setInsight(null);
  }, []);

  return {
    insight,
    isLoading,
    generateInsights,
    clearInsights
  };
}; 
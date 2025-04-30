"use client";

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import type { Analysis } from '@/types/analysis';
import { generateInsights } from '@/lib/insights';

interface InsightsPanelProps {
  analysis: Analysis;
}

export function InsightsPanel({ analysis }: InsightsPanelProps) {
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const generatedInsights = await generateInsights(analysis);
      setInsights(generatedInsights);
    } catch (err) {
      setError('Failed to generate insights');
      toast.error('Failed to generate insights');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Generating insights...</div>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {insights.length === 0 ? (
        <button
          onClick={fetchInsights}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Generate Insights
        </button>
      ) : (
        insights.map((insight: string, index: number) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            {insight}
          </div>
        ))
      )}
    </div>
  );
} 
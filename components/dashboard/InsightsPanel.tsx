"use client";

import { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { Analysis } from '@/types/analysis';
import { generateInsights } from '@/lib/insights';

interface InsightsPanelProps {
  analysis: Analysis;
}

export function InsightsPanel({ analysis }: InsightsPanelProps) {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    try {
      const generatedInsights = await generateInsights(analysis);
      setInsights(generatedInsights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
      toast.error('Failed to generate insights');
    } finally {
      setLoading(false);
    }
  }, [analysis]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  if (loading) {
    return <div>Generating insights...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Property Insights</h2>
      <ul className="space-y-2">
        {insights.map((insight, index) => (
          <li key={index} className="text-gray-300">{insight}</li>
        ))}
      </ul>
    </div>
  );
} 
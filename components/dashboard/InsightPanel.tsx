"use client";

import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import type { Analysis, CalculatorType } from '@/types/analysis';

interface InsightPanelProps<T extends CalculatorType> {
  analysis: Analysis<T>;
}

export default function InsightPanel<T extends CalculatorType>({ analysis }: InsightPanelProps<T>) {
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsights = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysis),
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const data = await response.json();
      setInsights(data.insights);
      toast.success('Insights generated successfully');
    } catch (error) {
      console.error('Failed to fetch insights:', error);
      setError('Failed to load insights. Please try again.');
      toast.error('Failed to generate insights');
    } finally {
      setIsLoading(false);
    }
  }, [analysis]);

  return (
    <div className="p-4 bg-[#1a1a1a] rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-[#2ecc71]">💡</span>
          GPT-Powered Insights
        </h2>
        <button
          onClick={generateInsights}
          disabled={isLoading}
          className="px-4 py-2 bg-[#2ecc71] text-black font-medium rounded hover:bg-[#27ae60] hover:shadow-[0_0_15px_#2ecc71] focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:ring-offset-2 focus:ring-offset-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </span>
          ) : (
            'Generate Insights'
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 text-red-500 bg-red-900/20 rounded">
          {error}
          <button
            onClick={generateInsights}
            className="ml-4 text-red-400 hover:text-red-300"
          >
            Try Again
          </button>
        </div>
      )}

      {isLoading && !insights && (
        <div className="space-y-4">
          <div className="h-4 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2" />
        </div>
      )}

      {insights && (
        <div className="prose prose-invert max-w-none">
          <div className="text-gray-200 whitespace-pre-line">
            {insights}
          </div>
        </div>
      )}
    </div>
  );
} 
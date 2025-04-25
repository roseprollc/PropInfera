"use client";

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface InsightsPanelProps {
  analysisId: string;
  initialInsights?: string;
  initialUpdatedAt?: string;
}

export default function InsightsPanel({ 
  analysisId, 
  initialInsights,
  initialUpdatedAt 
}: InsightsPanelProps) {
  const [insights, setInsights] = useState<string | null>(initialInsights || null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(initialUpdatedAt || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const fetchInsights = async (refresh = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const url = new URL('/api/insights', window.location.origin);
      if (refresh) {
        url.searchParams.set('refresh', 'true');
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: analysisId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate insights');
      }

      const data = await response.json();
      setInsights(data.insights);
      setUpdatedAt(data.updatedAt);

      if (data.cached) {
        toast.success('Loaded cached insights');
      } else if (refresh) {
        toast.success('Regenerated insights with latest AI model');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to generate insights');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialInsights) {
      fetchInsights();
    }
  }, [analysisId, initialInsights]);

  const handleCopy = () => {
    if (insights) {
      navigator.clipboard.writeText(insights);
      toast.success('Insights copied to clipboard');
    }
  };

  return (
    <div className="bg-[#111] rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-green-400 text-xl font-semibold">AI-Powered Insights</h2>
          {updatedAt && (
            <span className="text-sm text-gray-400">
              Last updated: {format(new Date(updatedAt), 'MMM d, yyyy h:mm a')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
          {insights && (
            <>
              <button
                onClick={() => fetchInsights(true)}
                className="text-gray-400 hover:text-white transition-colors"
                disabled={isLoading}
              >
                Regenerate
              </button>
              <button
                onClick={handleCopy}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Copy
              </button>
            </>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
            </div>
          ) : error ? (
            <div className="border border-red-500 rounded-lg p-4 bg-red-500/10">
              <p className="text-red-400">{error}</p>
              <button
                onClick={() => fetchInsights()}
                className="mt-2 px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : insights ? (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 space-y-2">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-300">{children}</li>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-green-400 text-lg font-semibold mt-4 mb-2">
                      {children}
                    </h3>
                  ),
                }}
              >
                {insights}
              </ReactMarkdown>
            </div>
          ) : (
            <button
              onClick={() => fetchInsights()}
              className="w-full py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
            >
              Generate Insights
            </button>
          )}
        </div>
      )}
    </div>
  );
} 
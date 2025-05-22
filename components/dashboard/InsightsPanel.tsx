"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import type { Analysis, CalculatorType } from '@/types/analysis';
import type { GPTInsight } from '@/types/insights';
import { generateInsights } from '@/lib/ai/generateInsights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Badge from "@/components/ui/Badge";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface InsightsPanelProps<T extends CalculatorType> {
  analysis: Analysis<T>;
  userTier: 'free' | 'pro' | 'elite';
}

export default function InsightsPanel<T extends CalculatorType>({ 
  analysis, 
  userTier 
}: InsightsPanelProps<T>) {
  const [insight, setInsight] = useState<GPTInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsight = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await generateInsights(analysis);
      setInsight(result);
      toast.success('Insights generated successfully');
    } catch (error) {
      console.error('Failed to generate insights:', error);
      setError('Failed to generate insights. Please try again.');
      toast.error('Failed to generate insights');
    } finally {
      setIsLoading(false);
    }
  }, [analysis]);

  useEffect(() => {
    return () => {
      // Cleanup any pending operations
      setIsLoading(false);
      setError(null);
    };
  }, []);

  const handleInsightUpdate = (newInsight: GPTInsight) => {
    setInsight(newInsight);
  };

  const fetchInsights = async () => {
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysis),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch insights');
      }

      const data = await response.json();
      handleInsightUpdate(data.insight);
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };

  if (userTier === 'free') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Upgrade to Pro or Elite to unlock detailed insights, including ROI analysis, market comparisons, and personalized recommendations.
            </p>
            <Alert>
              <AlertDescription>
                Upgrade to Pro or Elite to unlock detailed insights, including ROI analysis, market comparisons, and personalized recommendations.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error}
                <button
                  onClick={generateInsight}
                  className="ml-4 text-red-400 hover:text-red-300"
                >
                  Try Again
                </button>
              </AlertDescription>
            </Alert>
          )}

          {isLoading && !insight && (
            <div className="space-y-4">
              <div className="h-4 bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2" />
            </div>
          )}

          {!isLoading && !insight && (
            <button
              onClick={generateInsight}
              disabled={isLoading}
              className="px-4 py-2 bg-[#2ecc71] text-black font-medium rounded hover:bg-[#27ae60] hover:shadow-[0_0_15px_#2ecc71] focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:ring-offset-2 focus:ring-offset-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Generate Insights
            </button>
          )}

          {insight && (
            <>
              {/* Summary Section */}
              <div>
                <h3 className="font-semibold mb-2">Summary</h3>
                <p className="text-muted-foreground">{insight.summary}</p>
              </div>

              {/* ROI Analysis */}
              {insight.roiAnalysis && (
                <div>
                  <h3 className="font-semibold mb-2">ROI Analysis</h3>
                  <p className="text-muted-foreground">{insight.roiAnalysis}</p>
                </div>
              )}

              {/* Market Comparison */}
              {insight.marketComparison && (
                <div>
                  <h3 className="font-semibold mb-2">Market Comparison</h3>
                  <p className="text-muted-foreground">{insight.marketComparison}</p>
                </div>
              )}

              {/* Risk Flags */}
              {insight.riskFlags && insight.riskFlags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Risk Flags</h3>
                  <div className="flex flex-wrap gap-2">
                    {insight.riskFlags.map((flag, index) => (
                      <Badge key={index} variant="destructive">
                        {flag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Strategy Advice */}
              {insight.strategyAdvice && (
                <div>
                  <h3 className="font-semibold mb-2">Strategy Advice</h3>
                  <p className="text-muted-foreground">{insight.strategyAdvice}</p>
                </div>
              )}

              {/* Recommendations */}
              {insight.recommendations && insight.recommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Recommendations</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {insight.recommendations.map((rec, index) => (
                      <li key={index} className="text-muted-foreground">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mock Data Warning */}
              {insight.isMock && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    These insights are generated from mock data for demonstration purposes.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 
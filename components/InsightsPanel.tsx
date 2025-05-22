'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Badge from "@/components/ui/Badge";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { GPTInsight } from '@/types/insights';

interface InsightsPanelProps {
  insight: GPTInsight;
  userTier: 'free' | 'pro' | 'elite';
}

export default function InsightsPanel({ insight, userTier }: InsightsPanelProps) {
  if (userTier === 'free') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">{insight.summary}</p>
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
          {/* Summary Section */}
          <div>
            <h3 className="font-semibold mb-2">Summary</h3>
            <p className="text-muted-foreground">{insight.summary}</p>
          </div>

          {/* ROI Analysis */}
          <div>
            <h3 className="font-semibold mb-2">ROI Analysis</h3>
            <p className="text-muted-foreground">{insight.roiAnalysis}</p>
          </div>

          {/* Market Comparison */}
          <div>
            <h3 className="font-semibold mb-2">Market Comparison</h3>
            <p className="text-muted-foreground">{insight.marketComparison}</p>
          </div>

          {/* Risk Flags */}
          <div>
            <h3 className="font-semibold mb-2">Risk Flags</h3>
            <div className="flex flex-wrap gap-2">
              {insight.riskFlags?.map((flag, index) => (
                <Badge key={index} variant="destructive">
                  {flag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Strategy Advice */}
          <div>
            <h3 className="font-semibold mb-2">Strategy Advice</h3>
            <p className="text-muted-foreground">{insight.strategyAdvice}</p>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="font-semibold mb-2">Recommendations</h3>
            <ul className="list-disc list-inside space-y-2">
              {insight.recommendations?.map((rec, index) => (
                <li key={index} className="text-muted-foreground">
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Mock Data Warning */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              These insights are generated from mock data for demonstration purposes.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
} 
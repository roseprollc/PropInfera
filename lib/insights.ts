import { Analysis } from '@/types/analysis';

export async function generateInsights(analysis: Analysis): Promise<string[]> {
  // This is a placeholder implementation
  // In a real implementation, this would call an AI service or use predefined rules
  const insights: string[] = [];

  if (analysis.results.monthlyCashFlow > 0) {
    insights.push('Positive cash flow indicates a potentially profitable investment');
  } else {
    insights.push('Negative cash flow suggests the property may not be profitable at current rent levels');
  }

  if (analysis.results.cashOnCashReturn > 10) {
    insights.push('High cash-on-cash return suggests strong investment potential');
  }

  if (analysis.results.capRate > 8) {
    insights.push('Above-average cap rate indicates good value relative to purchase price');
  }

  return insights;
} 
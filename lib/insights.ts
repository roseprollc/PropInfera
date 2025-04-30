import type { Analysis, CalculatorType } from '@/types/analysis';

export async function generateInsights<T extends CalculatorType>(analysis: Analysis<T>): Promise<string[]> {
  const insights: string[] = [];

  // Type guard to safely access rental-specific fields
  const data = analysis.data as any;

  if (typeof data.monthlyCashFlow === 'number') {
    insights.push(
      data.monthlyCashFlow > 0
        ? 'Positive cash flow indicates a potentially profitable investment.'
        : 'Negative cash flow suggests the property may not be profitable at current rent levels.'
    );
  }

  if (typeof data.cashOnCash === 'number' && data.cashOnCash > 10) {
    insights.push('High cash-on-cash return suggests strong investment potential.');
  }

  if (typeof data.capRate === 'number' && data.capRate > 8) {
    insights.push('Above-average cap rate indicates good value relative to purchase price.');
  }

  return insights;
}

import { Analysis, CalculatorType } from '@/types/analysis';

export function isWholesaleAnalysis(
  analysis: Analysis<CalculatorType>
): analysis is Analysis<'wholesale'> {
  return analysis.type === 'wholesale';
}

export function isRentalAnalysis(
  analysis: Analysis<CalculatorType>
): analysis is Analysis<'rental'> {
  return analysis.type === 'rental';
}

export function isAirbnbAnalysis(
  analysis: Analysis<CalculatorType>
): analysis is Analysis<'airbnb'> {
  return analysis.type === 'airbnb';
}

export function isMortgageAnalysis(
  analysis: Analysis<CalculatorType>
): analysis is Analysis<'mortgage'> {
  return analysis.type === 'mortgage';
} 
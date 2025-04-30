import type { Metadata } from 'next';
import MortgageCalculator from '@/components/calculators/MortgageCalculator';
import CalculatorLayout from '@/components/layout/CalculatorLayout';

export const metadata: Metadata = {
  title: 'Mortgage Calculator | PropInfera',
  description: 'Estimate your monthly mortgage payments with interest, taxes, insurance, and HOA fees included.',
  keywords: 'mortgage calculator, monthly payment, home loan, amortization, mortgage breakdown'
};

export default function MortgagePage() {
  return (
    <CalculatorLayout
      title="Mortgage Calculator"
      showImportButton={true}
    >
      <MortgageCalculator />
    </CalculatorLayout>
  );
}
import { Metadata } from 'next';
import { RentersCalculator } from '@/components/calculators/RentersCalculator';
import CalculatorLayout from '@/components/layout/CalculatorLayout';

export const metadata: Metadata = {
  title: 'Rental Property Calculator | PropInfera',
  description: 'Calculate key metrics for your rental property investment including cash flow, cap rate, ROI, and 5-year projections.',
  keywords: 'rental property calculator, real estate investment, cash flow analysis, cap rate calculator, ROI calculator'
};

export default function RentersPage() {
  return (
    <CalculatorLayout
      title="Rental Property Calculator"
      showImportButton={true}
    >
      <RentersCalculator />
    </CalculatorLayout>
  );
} 
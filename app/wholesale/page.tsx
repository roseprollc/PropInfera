import { Metadata } from 'next';
import WholesaleCalculator from '@/components/calculators/WholesaleCalculator';
import CalculatorLayout from '@/components/layout/CalculatorLayout';

export const metadata: Metadata = {
  title: 'Wholesale Calculator | PropInfera',
  description: 'Analyze wholesale real estate deals with our comprehensive calculator. Calculate MAO, profit potential, and ROI for your wholesale investments.',
  keywords: 'wholesale calculator, real estate wholesaling, MAO calculator, wholesale deal analysis, real estate investment'
};

export default function WholesalePage() {
  return (
    <CalculatorLayout
      title="Wholesale Calculator"
      showImportButton={true}
    >
      <WholesaleCalculator />
    </CalculatorLayout>
  );
} 
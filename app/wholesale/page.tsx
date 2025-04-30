import type { Metadata } from 'next';
import WholesaleCalculator from '@/components/calculators/WholesaleCalculator';
import CalculatorLayout from '@/components/layout/CalculatorLayout';

export const metadata: Metadata = {
  title: 'Wholesale Calculator | PropInfera',
  description: 'Calculate potential profits from wholesale real estate deals.',
  keywords:
    'wholesale calculator, real estate investing, property flipping, assignment fee, repair costs',
};

export default function WholesalePage() {
  return (
    <CalculatorLayout title="Wholesale Calculator">
      <WholesaleCalculator />
    </CalculatorLayout>
  );
}

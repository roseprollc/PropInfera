import { Metadata } from 'next';
import { AirbnbCalculator } from '@/components/calculators/AirbnbCalculator';
import CalculatorLayout from '@/components/layout/CalculatorLayout';

export const metadata: Metadata = {
  title: 'Airbnb Calculator | PropInfera',
  description: 'Analyze potential returns on your Airbnb investment with occupancy rates, seasonal adjustments, and operating costs.',
  keywords: 'airbnb calculator, short-term rental, vacation rental, occupancy rate, rental income'
};

export default function AirbnbPage() {
  return (
    <CalculatorLayout
      title="Airbnb Calculator"
      showImportButton={true}
    >
      <AirbnbCalculator />
    </CalculatorLayout>
  );
} 
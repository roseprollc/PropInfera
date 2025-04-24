import { Metadata } from 'next';
import { AnalysisProvider } from '@/context/AnalysisContext';
import RentersCalculator from '@/components/calculators/RentersCalculator';

export const metadata: Metadata = {
  title: 'Rental Property Calculator | PropInfera',
  description: 'Calculate key metrics for your rental property investment including cash flow, cap rate, ROI, and 5-year projections.',
  keywords: 'rental property calculator, real estate investment, cash flow analysis, cap rate calculator, ROI calculator',
};

export default function RentersPage() {
  return (
    <AnalysisProvider>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Rental Property Calculator
            </h1>
            <p className="text-xl text-gray-600">
              Analyze your potential rental property investment with our comprehensive calculator
            </p>
          </div>
          <RentersCalculator />
        </main>
      </div>
    </AnalysisProvider>
  );
} 
import type { Metadata } from 'next';
import MortgagePageClient from '@/components/pages/MortgagePageClient';

export const metadata: Metadata = {
  title: 'Mortgage Calculator | PropInfera',
  description: 'Calculate your mortgage payments and amortization schedule',
  keywords: 'mortgage calculator, monthly payment, home loan, amortization, mortgage breakdown'
};

export default function MortgagePage() {
  return <MortgagePageClient />;
}

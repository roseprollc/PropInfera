import type { Metadata } from 'next';
import PricingPage from '@/components/pages/PricingPage';

export const metadata: Metadata = {
  title: 'Pricing Plans | PropInfera',
  description: 'Choose the perfect plan for your real estate investment needs. Start free, upgrade as you grow.',
};

export default function Page() {
  return <PricingPage />;
}
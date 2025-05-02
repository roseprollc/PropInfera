import type { Metadata } from 'next';
import WholesalePageClient from '@/components/pages/WholesalePageClient';

export const metadata: Metadata = {
  title: 'Wholesale Calculator | PropInfera',
  description: 'Calculate maximum offer and potential profits for wholesale deals',
  keywords: 'wholesale calculator, max offer, ARV, assignment fee, repair cost'
};

export default function WholesalePage() {
  return <WholesalePageClient />;
}

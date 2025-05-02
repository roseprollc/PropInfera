import type { Metadata } from 'next';
import AirbnbPageClient from '@/components/pages/AirbnbPageClient';

export const metadata: Metadata = {
  title: 'Airbnb Calculator | PropInfera',
  description: 'Calculate potential returns from your Airbnb property',
  keywords: 'airbnb calculator, short-term rental, vacation rental, occupancy rate, rental income'
};

export default function AirbnbPage() {
  return <AirbnbPageClient />;
}

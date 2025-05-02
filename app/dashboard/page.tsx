import type { Metadata } from 'next';
import DashboardClient from '@/components/pages/DashboardClient';

export const metadata: Metadata = {
  title: 'Your Dashboard | PropInfera',
  description: 'View and manage your saved investment analyses including mortgage, rental, Airbnb, and wholesale deals.',
  keywords: 'investment dashboard, saved deals, PropInfera'
};

export default function DashboardPage() {
  return <DashboardClient />;
}

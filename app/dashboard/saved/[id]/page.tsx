import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAnalysisById } from '@/lib/data';
import { SavedAnalysisView } from '@/components/dashboard/SavedAnalysisView';

export const metadata: Metadata = {
  title: 'Analysis Detail | PropInfera',
  description: 'View your saved property analysis',
};

interface AnalysisDetailPageProps {
  params: {
    id: string;
  };
}

export default async function AnalysisDetailPage({ params }: AnalysisDetailPageProps) {
  const analysis = await getAnalysisById(params.id);
  
  if (!analysis) {
    notFound();
  }

  return <SavedAnalysisView analysis={analysis} />;
} 
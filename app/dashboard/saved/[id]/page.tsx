import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getAnalysisById } from '@/lib/data';
import { updateAnalysis } from '@/app/actions/analysis';
import { EditAnalysisForm } from '@/components/dashboard/EditAnalysisForm';
import type { Analysis } from '@/types/analysis';

export const metadata: Metadata = {
  title: 'View Saved Analysis | PropInfera',
  description: 'View and manage your saved property analysis.',
};

interface PageProps {
  params: Promise<{ [key: string]: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function SavedAnalysisPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const analysis = await getAnalysisById(resolvedParams.id);

  if (!analysis) {
    notFound();
  }

  const handleSave = async (updatedData: Partial<Analysis>) => {
    'use server';
    
    try {
      // Validate the updated data
      if (!updatedData.title || updatedData.title.trim().length === 0) {
        throw new Error('Title is required');
      }
      
      if (updatedData.notes && updatedData.notes.length > 1000) {
        throw new Error('Notes must be less than 1000 characters');
      }

      await updateAnalysis(resolvedParams.id, updatedData);
      redirect('/dashboard/saved');
    } catch (error) {
      console.error('Error updating analysis:', error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">View Analysis</h1>
      <EditAnalysisForm analysis={analysis} onSave={handleSave} />
    </div>
  );
}

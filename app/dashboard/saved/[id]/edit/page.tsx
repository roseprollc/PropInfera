import type { Metadata } from 'next';
import { getAnalysisById } from '@/lib/data';
import { updateAnalysis } from '@/app/actions/analysis';
import { EditAnalysisForm } from '@/components/dashboard/EditAnalysisForm';
import type { Analysis, CalculatorType } from '@/types/analysis';

export const metadata: Metadata = {
  title: 'Edit Analysis | PropInfera',
  description: 'Edit your property analysis details.',
};

export default async function EditAnalysisPage({ params }: { params: { id: string } }) {
  const analysis = await getAnalysisById(params.id);
  if (!analysis) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">Analysis not found</h2>
      </div>
    );
  }
  
  // Use proper typing that matches constraints
  const handleSave = async (updatedData: Partial<Analysis>) => {
    await updateAnalysis(params.id, updatedData);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Analysis</h1>
      <EditAnalysisForm analysis={analysis} onSave={handleSave} />
    </div>
  );
}
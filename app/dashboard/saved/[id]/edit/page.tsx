import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAnalysisById } from '@/lib/data';
import { EditAnalysisForm } from '@/components/dashboard/EditAnalysisForm';
import { Analysis, CalculatorType } from '@/types/analysis';
import { updateAnalysis } from '@/app/actions/analysis';

export const metadata: Metadata = {
  title: 'Edit Analysis | PropInfera',
  description: 'Edit your property analysis details.',
};

export default async function EditAnalysisPage({ params }: { params: { id: string } }) {
  const analysis = await getAnalysisById(params.id);

  if (!analysis) {
    notFound();
  }

  const handleSave = async (updatedData: Partial<Analysis<CalculatorType>>) => {
    await updateAnalysis(params.id, updatedData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <EditAnalysisForm
          initialData={analysis as Analysis<CalculatorType>}
          onSave={handleSave}
        />
      </div>
    </div>
  );
} 
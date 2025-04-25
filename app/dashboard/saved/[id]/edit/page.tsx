import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAnalysisById } from '@/lib/data';
import EditAnalysisForm from '@/components/dashboard/EditAnalysisForm';

export const metadata: Metadata = {
  title: 'Edit Analysis | PropInfera',
  description: 'Modify your saved real estate investment analysis.',
};

export default async function EditAnalysisPage({ params }: { params: { id: string } }) {
  const analysis = await getAnalysisById(params.id);

  if (!analysis) {
    notFound();
  }

  const handleSave = async (updatedData: Partial<typeof analysis>) => {
    'use server';
    
    const response = await fetch(`/api/analyses/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error('Failed to save changes');
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <div className="max-w-4xl mx-auto py-20 px-4">
        <div className="mb-8">
          <Link
            href={`/dashboard/saved/${params.id}`}
            className="text-[#2ecc71] hover:text-[#27ae60] mb-4 inline-block"
          >
            ← Back to Analysis
          </Link>
          <h1 className="text-3xl font-bold mb-2">Edit Analysis</h1>
          <div className="flex items-center gap-4 text-gray-400">
            <span className="capitalize">{analysis.type}</span>
            <span>•</span>
            <span>{analysis.propertyName || 'Untitled Analysis'}</span>
          </div>
        </div>

        <EditAnalysisForm
          initialData={analysis}
          onSave={handleSave}
        />
      </div>
    </div>
  );
} 
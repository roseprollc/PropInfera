import { Metadata } from 'next';
import Link from 'next/link';
import { format } from 'date-fns';
import { getAnalysisById } from '@/lib/data';
import ResultsSummary from '@/components/results/ResultsSummary';
import { formatCurrency, formatPercentage } from '@/lib/utils/formatting';
import ExportPDFButton from '@/components/dashboard/ExportPDFButton';
import { notFound } from 'next/navigation';
import InsightPanel from '@/components/dashboard/InsightPanel';
import InsightsPanel from '@/components/dashboard/InsightsPanel';
import { Analysis } from '@/types/analysis';

export const metadata: Metadata = {
  title: 'Analysis Details | PropInfera',
  description: 'View and export your real estate investment analysis.',
};

export default async function AnalysisDetailPage({ params }: { params: { id: string } }) {
  const analysis = await getAnalysisById(params.id);

  if (!analysis) {
    notFound();
  }

  // Ensure we have valid data
  const safeAnalysis: Analysis = {
    ...analysis,
    inputs: analysis.inputs || {},
    results: analysis.results || {},
    createdAt: analysis.createdAt,
    updatedAt: analysis.updatedAt,
    insightsLastGeneratedAt: analysis.insightsLastGeneratedAt,
  };

  const formatValue = (key: string, value: unknown): string => {
    if (typeof value !== 'number' || isNaN(value)) {
      return '—';
    }

    if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('roi')) {
      return formatPercentage(value);
    }
    return formatCurrency(value);
  };

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <div className="max-w-4xl mx-auto py-20 px-4">
        <div className="mb-8">
          <Link
            href="/dashboard/saved"
            className="text-[#2ecc71] hover:text-[#27ae60] mb-4 inline-block"
          >
            ← Back to Saved Analyses
          </Link>
          <h1 className="text-3xl font-bold mb-2">{safeAnalysis.propertyName || 'Untitled Analysis'}</h1>
          <div className="flex items-center gap-4 text-gray-400">
            <span className="capitalize">{safeAnalysis.type}</span>
            <span>•</span>
            <span>Created {format(new Date(safeAnalysis.createdAt), 'PPP')}</span>
          </div>
        </div>

        <div className="space-y-8">
          {safeAnalysis.notes && (
            <div className="p-4 bg-gray-900 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Notes</h2>
              <p className="text-gray-300">{safeAnalysis.notes}</p>
            </div>
          )}

          <div className="p-4 bg-gray-900 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Analysis Results</h2>
              <ExportPDFButton analysis={safeAnalysis} />
            </div>
            <ResultsSummary
              results={safeAnalysis.results}
              highlightKeys={['monthlyCashFlow', 'cashOnCash', 'roi']}
            />
            <InsightsPanel analysisId={params.id} />
          </div>

          <InsightPanel analysis={safeAnalysis} />

          <div className="p-4 bg-gray-900 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Input Parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(safeAnalysis.inputs).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <label className="block text-sm text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div className="text-white">
                    {formatValue(key, value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
import { Metadata } from 'next';
import SavedAnalysesList from '@/components/dashboard/SavedAnalysesList';

export const metadata: Metadata = {
  title: 'Saved Analyses | PropInfera',
  description: 'View and manage your saved property analyses. Filter by type, search by title, and access detailed results.',
};

export default function SavedAnalysesPage() {
  return (
    <div className="min-h-screen bg-[#111] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Saved Analyses</h1>
          <p className="mt-2 text-gray-400">
            View and manage your saved property analyses. Filter by type, search by title, and access detailed results.
          </p>
        </div>
        
        <SavedAnalysesList />
      </div>
    </div>
  );
} 
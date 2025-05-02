'use client';

import SavedAnalysesList from "@/components/dashboard/SavedAnalysesList";
import type { Analysis, CalculatorType } from "@/types/analysis";

export default function SavedAnalysesClient() {
  // TODO: Replace with real data fetching
  const analyses: Analysis<CalculatorType>[] = [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Saved Analyses</h1>
      <SavedAnalysesList 
        analyses={analyses} 
        onSelect={() => {}} 
      />
    </div>
  );
} 
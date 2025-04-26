"use client";

import { useState } from "react";
import SavedAnalysesList from "@/components/dashboard/SavedAnalysesList";
import { Analysis } from "@/types/analysis";

export default function SavedAnalysesPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);

  const handleSelectAnalysis = (analysis: Analysis) => {
    setSelectedAnalysis(analysis);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Saved Analyses</h1>
      <SavedAnalysesList 
        analyses={analyses} 
        onSelect={handleSelectAnalysis} 
      />
    </div>
  );
} 
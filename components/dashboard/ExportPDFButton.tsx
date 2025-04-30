"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { exportAnalysisToPDF } from '@/lib/pdf/exportAnalysisToPDF';
import type { Analysis } from '@/types/analysis';

interface ExportPDFButtonProps {
  analysis: Analysis;
}

export function ExportPDFButton({ analysis }: ExportPDFButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportAnalysisToPDF(analysis);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      {isExporting ? 'Exporting...' : 'Export PDF'}
    </Button>
  );
} 
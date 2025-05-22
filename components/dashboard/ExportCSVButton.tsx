'use client';

import React from 'react';
import { FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/utils/export';
import type { Analysis, CalculatorType } from '@/types/analysis';

interface ExportCSVButtonProps<T extends CalculatorType> {
  analysis: Analysis<T>;
  disabled?: boolean;
}

export const ExportCSVButton = <T extends CalculatorType>({ 
  analysis,
  disabled = false 
}: ExportCSVButtonProps<T>) => {
  const handleExport = () => {
    try {
      exportToCSV(analysis);
      toast.success('CSV exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export CSV');
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled}
      className={`p-2 rounded-lg ${
        disabled 
          ? 'bg-gray-600 cursor-not-allowed' 
          : 'bg-indigo-600 hover:bg-indigo-700'
      }`}
      title="Export to CSV"
    >
      <FileDown className="w-5 h-5 text-white" />
    </button>
  );
}; 
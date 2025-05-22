"use client";

import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { toast } from 'sonner';

interface ExportPDFButtonProps {
  analysisId: string;
}

export default function ExportPDFButton({ analysisId }: ExportPDFButtonProps) {
  const handleExport = async () => {
    try {
      // TODO: Implement PDF export using analysisId
      console.log('Exporting PDF for analysis:', analysisId);
      toast.success('PDF export started');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      className="flex items-center gap-2"
    >
      <FileDown className="h-4 w-4" />
      Export PDF
    </Button>
  );
} 
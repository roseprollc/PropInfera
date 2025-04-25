"use client";

import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { Analysis } from '@/lib/data';

interface ExportPDFButtonProps {
  analysis: Analysis;
}

export default function ExportPDFButton({ analysis }: ExportPDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Dynamically import the PDF generation function
      const { exportAnalysisToPDF } = await import('@/lib/pdf/exportAnalysisToPDF');
      
      // Generate the PDF
      const pdfBlob = await exportAnalysisToPDF(analysis);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `propinfera-${analysis.type}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [analysis]);

  return (
    <button
      onClick={handleExport}
      disabled={isGenerating}
      className="inline-flex items-center px-4 py-2 bg-[#2ecc71] text-black font-medium rounded hover:bg-[#27ae60] hover:shadow-[0_0_15px_#2ecc71] focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:ring-offset-2 focus:ring-offset-[#111] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
    >
      {isGenerating ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating PDF...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        </>
      )}
    </button>
  );
} 
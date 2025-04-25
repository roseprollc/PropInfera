import { Analysis } from '@/types/analysis';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export async function exportAnalysisToPDF(analysis: Analysis): Promise<void> {
  const doc = new jsPDF();
  const margin = 20;
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const contentWidth = pageWidth - (margin * 2);

  // Add title
  doc.setFontSize(20);
  doc.text(analysis.propertyName || 'Property Analysis', margin, margin + 20);

  // Add property details
  doc.setFontSize(12);
  let y = margin + 40;
  doc.text('Property Details:', margin, y);
  y += 10;

  // Add analysis inputs
  doc.text('Analysis Inputs:', margin, y);
  y += 10;

  // Add results
  doc.text('Results:', margin, y);
  y += 10;

  // Add notes if any
  if (analysis.notes) {
    doc.text('Notes:', margin, y);
    y += 10;
    doc.text(analysis.notes, margin, y);
  }

  // Save the PDF
  doc.save(`${analysis.propertyName || 'analysis'}.pdf`);
} 
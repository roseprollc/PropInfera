import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Analysis } from '@/lib/data';
import { format } from 'date-fns';

export async function exportAnalysisToPDF(analysis: Analysis): Promise<Blob> {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size

    // Load fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Set up page dimensions
    const { width, height } = page.getSize();
    const margin = 50;
    let y = height - margin;

    // Helper function to add text with proper spacing
    const addText = (text: string, x: number, fontSize: number, isBold = false) => {
      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font: isBold ? boldFont : font,
        color: rgb(0, 0, 0),
      });
      y -= fontSize + 10;
    };

    // Add header
    addText('PropInfera Analysis Report', margin, 24, true);
    y -= 20;

    // Add metadata
    addText(`Property: ${analysis.propertyName}`, margin, 14);
    addText(`Type: ${analysis.type.charAt(0).toUpperCase() + analysis.type.slice(1)}`, margin, 14);
    addText(`Created: ${format(new Date(analysis.createdAt), 'PPP')}`, margin, 14);
    if (analysis.notes) {
      addText(`Notes: ${analysis.notes}`, margin, 14);
    }
    y -= 20;

    // Add inputs section
    addText('Input Parameters', margin, 18, true);
    y -= 10;
    Object.entries(analysis.inputs).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').trim();
      addText(`${label}: ${value}`, margin, 12);
    });
    y -= 20;

    // Add results section
    addText('Analysis Results', margin, 18, true);
    y -= 10;
    Object.entries(analysis.results).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').trim();
      const formattedValue = typeof value === 'number' 
        ? key.toLowerCase().includes('rate') || key.toLowerCase().includes('roi')
          ? `${(value * 100).toFixed(2)}%`
          : new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(value)
        : value;
      addText(`${label}: ${formattedValue}`, margin, 12);
    });

    // Add footer
    y = margin;
    addText(`Generated on ${format(new Date(), 'PPP')}`, margin, 10);
    addText('© PropInfera - Real Estate Investment Analysis', margin, 10);

    // Convert to blob
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
} 
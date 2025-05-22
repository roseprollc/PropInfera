import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';
import type { Analysis } from '@/types/analysis';

export const exportToCSV = (analysis: Analysis) => {
  const worksheet = utils.json_to_sheet([analysis]);
  const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
  const blob = new Blob([write(workbook, { bookType: 'csv', type: 'array' })]);
  saveAs(blob, `${analysis.title || 'analysis'}.csv`);
};

export const getShareableLink = (analysisId: string) => {
  return `${window.location.origin}/analysis/${analysisId}`;
}; 
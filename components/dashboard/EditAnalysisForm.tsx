"use client";

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import ResultsSummary from '@/components/results/ResultsSummary';
import { Analysis } from '@/types/analysis';

interface EditAnalysisFormProps {
  analysis: Analysis;
  onSave: (updatedAnalysis: Analysis) => Promise<void>;
  onCancel: () => void;
}

export default function EditAnalysisForm({ analysis, onSave, onCancel }: EditAnalysisFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(analysis.title);
  const [notes, setNotes] = useState(analysis.notes);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Analysis>>({
    propertyName: analysis.propertyName,
    notes: analysis.notes,
    inputs: { ...analysis.inputs }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.propertyName?.trim()) {
      newErrors.propertyName = 'Title is required';
    }

    // Validate numeric inputs
    Object.entries(formData.inputs || {}).forEach(([key, value]) => {
      if (typeof value === 'number' && (isNaN(value) || value === null)) {
        newErrors[`input_${key}`] = 'Please enter a valid number';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      inputs: {
        ...prev.inputs,
        [key]: value
      }
    }));
    // Clear error when user starts typing
    if (errors[`input_${key}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`input_${key}`];
        return newErrors;
      });
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        ...analysis,
        title,
        notes,
        propertyName: formData.propertyName,
        inputs: formData.inputs
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save analysis');
    } finally {
      setIsSaving(false);
    }
  }, [analysis, title, notes, formData, onSave]);

  const formatValue = useCallback((key: string, value: any): string => {
    if (typeof value === 'number') {
      if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('roi')) {
        return `${(value * 100).toFixed(2)}%`;
      }
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    }
    return String(value);
  }, []);

  const inputFields = useMemo(() => (
    <div className="space-y-6">
      <div className="p-4 bg-gray-900 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title</label>
            <input
              type="text"
              value={formData.propertyName}
              onChange={(e) => handleInputChange('propertyName', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 rounded-md text-white"
            />
            {errors.propertyName && (
              <p className="text-red-500 text-sm mt-1">{errors.propertyName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71]"
              rows={3}
              disabled={isSaving}
              placeholder="Add any additional notes about this analysis"
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-900 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Calculator Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(formData.inputs || {}).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <label className="block text-sm text-gray-400 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type={typeof value === 'number' ? 'number' : 'text'}
                value={value}
                onChange={(e) => handleInputChange(key, typeof value === 'number' ? Number(e.target.value) : e.target.value)}
                className={`w-full px-3 py-2 bg-gray-800 border ${
                  errors[`input_${key}`] ? 'border-red-500' : 'border-gray-700'
                } rounded focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71]`}
                disabled={isSaving}
                placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
              />
              {errors[`input_${key}`] && (
                <p className="mt-1 text-sm text-red-500">{errors[`input_${key}`]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gray-900 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Current Results</h2>
        <ResultsSummary
          results={analysis.results}
          highlightKeys={['monthlyCashFlow', 'cashOnCash', 'roi']}
        />
      </div>
    </div>
  ), [formData, errors, isSaving, handleInputChange, analysis.results]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {inputFields}

      <div className="mt-8 flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-400 hover:text-gray-300"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-[#2ecc71] text-black font-medium rounded hover:bg-[#27ae60] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
}

EditAnalysisForm.displayName = "EditAnalysisForm"; 
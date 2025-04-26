"use client";

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import ResultsSummary from '@/components/results/ResultsSummary';

interface Analysis {
  _id: string;
  userId: string;
  type: string;
  title: string;
  notes?: string;
  inputs: Record<string, any>;
  results: Record<string, number>;
  insightsLastGeneratedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface EditAnalysisFormProps {
  initialData: Analysis;
  onSave: (updatedData: Partial<Analysis>) => Promise<void>;
  onCancel: () => void;
}

export function EditAnalysisForm({ initialData, onSave, onCancel }: EditAnalysisFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Analysis>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate title
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    // Validate inputs
    if (formData.inputs) {
      Object.entries(formData.inputs).forEach(([key, value]) => {
        if (typeof value === 'number' && isNaN(value)) {
          newErrors[`input_${key}`] = 'Invalid number';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      await onSave(formData);
      router.push('/dashboard/saved');
    } catch (error) {
      console.error('Error saving analysis:', error);
      setErrors({ submit: 'Failed to save analysis' });
    } finally {
      setIsSaving(false);
    }
  };

  const inputFields = useMemo(() => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-3 py-2 bg-gray-800 border ${
            errors.title ? 'border-red-500' : 'border-gray-700'
          } rounded focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71]`}
          disabled={isSaving}
          placeholder="Enter analysis title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
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
          results={initialData.results}
          highlightKeys={['monthlyCashFlow', 'cashOnCash', 'roi']}
        />
      </div>
    </div>
  ), [formData, errors, isSaving, handleInputChange, initialData.results]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {inputFields}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#2ecc71] text-white rounded-md hover:bg-[#27ae60] focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      {errors.submit && (
        <p className="text-sm text-red-500 text-center">{errors.submit}</p>
      )}
    </form>
  );
}

EditAnalysisForm.displayName = "EditAnalysisForm"; 
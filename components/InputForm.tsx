'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { ImportPreviewBox } from './ImportPreviewBox';
import type { PropertyData } from '@/types/property';

interface InputFormProps {
  onSubmit: (data: PropertyData) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [importedData, setImportedData] = useState<(PropertyData & { isMockData?: boolean }) | null>(null);

  const handleImport = async () => {
    if (!address.trim()) {
      toast.error('Please enter an address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });

      if (!response.ok) {
        throw new Error('Import failed');
      }

      const data = await response.json();
      setImportedData(data);

      if (data.isMockData) {
        const zipCode = address.match(/\b\d{5}\b/)?.[0] || 'unknown';
        toast.info(`Using mock data for ZIP code ${zipCode}`);
      } else {
        toast.success('Property data imported successfully');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import property data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearImport = () => {
    setImportedData(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (importedData) {
      onSubmit(importedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Property Address
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter property address"
          />
          <button
            type="button"
            onClick={handleImport}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Importing...' : 'Import'}
          </button>
        </div>
      </div>

      {importedData && (
        <ImportPreviewBox
          data={importedData}
          onClear={handleClearImport}
        />
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!importedData}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </form>
  );
}; 
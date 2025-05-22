'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';
import type { PropertyData } from '@/types/property';

interface ImportPreviewBoxProps {
  data: PropertyData & { isMockData?: boolean };
  onClear: () => void;
}

export const ImportPreviewBox: React.FC<ImportPreviewBoxProps> = ({ data, onClear }) => {
  const handleClear = () => {
    onClear();
    toast.success('Import cleared');
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      {data.isMockData && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-yellow-800">
          <AlertTriangle className="w-5 h-5" />
          <span>Using mock data for this ZIP code</span>
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">Imported Property Data</h3>
        <button
          onClick={handleClear}
          className="p-1 hover:bg-gray-200 rounded-full"
          title="Clear import"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Address</p>
          <p className="font-medium">{data.address}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Price</p>
          <p className="font-medium">${data.price.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Monthly Rent</p>
          <p className="font-medium">${data.rent.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Annual Taxes</p>
          <p className="font-medium">${data.taxes.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Annual Insurance</p>
          <p className="font-medium">${data.insurance.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Monthly HOA</p>
          <p className="font-medium">${data.hoa.toLocaleString()}</p>
        </div>
        {data.propertyType && (
          <div>
            <p className="text-sm text-gray-600">Property Type</p>
            <p className="font-medium">{data.propertyType}</p>
          </div>
        )}
        {data.bedrooms && (
          <div>
            <p className="text-sm text-gray-600">Bedrooms</p>
            <p className="font-medium">{data.bedrooms}</p>
          </div>
        )}
        {data.bathrooms && (
          <div>
            <p className="text-sm text-gray-600">Bathrooms</p>
            <p className="font-medium">{data.bathrooms}</p>
          </div>
        )}
        {data.squareFeet && (
          <div>
            <p className="text-sm text-gray-600">Square Feet</p>
            <p className="font-medium">{data.squareFeet.toLocaleString()}</p>
          </div>
        )}
        {data.yearBuilt && (
          <div>
            <p className="text-sm text-gray-600">Year Built</p>
            <p className="font-medium">{data.yearBuilt}</p>
          </div>
        )}
      </div>
    </div>
  );
}; 
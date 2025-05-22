'use client';

import React from 'react';
import { History } from 'lucide-react';
import { format } from 'date-fns';

interface Version {
  id: string;
  timestamp: Date;
  note: string;
}

interface VersionHistoryDialogProps {
  analysisId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for UI development
const mockVersions: Version[] = [
  {
    id: '1',
    timestamp: new Date(),
    note: 'Initial analysis created'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    note: 'Updated property value'
  }
];

export const VersionHistoryDialog: React.FC<VersionHistoryDialogProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <History className="w-5 h-5" />
            Version History
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          {mockVersions.map((version) => (
            <div
              key={version.id}
              className="p-3 bg-gray-700 rounded-lg"
            >
              <div className="text-sm text-gray-400">
                {format(version.timestamp, 'MMM d, yyyy h:mm a')}
              </div>
              <div className="mt-1">{version.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 
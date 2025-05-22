'use client';

import React from 'react';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { getShareableLink } from '@/lib/utils/export';

interface ShareButtonProps {
  analysisId: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ analysisId }) => {
  const handleShare = async () => {
    try {
      const link = getShareableLink(analysisId);
      await navigator.clipboard.writeText(link);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700"
      title="Share Analysis"
    >
      <Share2 className="w-5 h-5 text-white" />
    </button>
  );
}; 
import React from 'react';

interface LoadingProps {
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default Loading; 
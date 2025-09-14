import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-white/20 border-t-white/60 rounded-full mx-auto mb-4"></div>
        <div className="text-white/80 text-lg">Loading weather data...</div>
        <div className="text-white/60 text-sm mt-2">Please wait a moment</div>
      </div>
    </div>
  );
};
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DemoModeWarningProps {
  error?: string;
}

const DemoModeWarning: React.FC<DemoModeWarningProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-6 sm:mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-yellow-800 text-sm sm:text-base">Connection Issue</h4>
          <p className="text-xs sm:text-sm text-yellow-700 mt-1">{error}</p>
        </div>
      </div>
    </div>
  );
};

export default DemoModeWarning;
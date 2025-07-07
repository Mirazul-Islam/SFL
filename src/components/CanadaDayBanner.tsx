import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const CanadaDayBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Extended Canada Day promotion - show banner from June 1 to July 31
  const now = new Date();
  const currentYear = now.getFullYear();
  const startDate = new Date(currentYear, 4, 1); // June 1
  const endDate = new Date(currentYear, 4, 2); // July 31
  
  const shouldShowBanner = now >= startDate && now <= endDate;

  if (!isVisible || !shouldShowBanner) {
    return null;
  }

  return (
    // Only show banner on desktop (hidden on mobile since we have the popup)
    <div className="bg-gradient-to-r from-red-600 to-red-500 border-b border-red-700 relative hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Desktop Layout */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-lg">🍁</span>
            </div>
            
            <div className="text-white">
              <div className="flex items-center space-x-3">
                <h3 className="font-bold text-base">CANADA DAY SPECIAL</h3>
                <span className="text-white/90">•</span>
                <span className="text-sm">Use code</span>
                <span className="bg-white text-red-600 px-3 py-1 rounded-full font-bold text-sm shadow-md">
                  CANADADAY
                </span>
                <span className="text-sm">for 50% OFF</span>
              </div>
              <p className="text-red-100 text-xs mt-1">Minimum 2 hours • Valid through July 31st</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link
              to="/book"
              className="inline-flex items-center px-5 py-2 bg-white text-red-600 font-bold rounded-full hover:bg-red-50 transition-colors shadow-lg text-sm"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book & Save 50%
            </Link>
            
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CanadaDayBanner;
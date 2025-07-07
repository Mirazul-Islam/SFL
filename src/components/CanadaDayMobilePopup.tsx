import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Gift, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const CanadaDayMobilePopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShownThisVisit, setHasShownThisVisit] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Check if it's Canada Day season (June 1 - July 31)
  const now = new Date();
  const currentYear = now.getFullYear();
  const startDate = new Date(currentYear, 4, 1); // June 1
  const endDate = new Date(currentYear, 4, 2); // July 31
  const shouldShowPopup = now >= startDate && now <= endDate;

  // Reset the popup state when navigating to home page
  useEffect(() => {
    if (location.pathname === '/') {
      setHasShownThisVisit(false);
      setIsVisible(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Only show on mobile, if it's Canada Day season, on home page, and hasn't shown this visit
    const isMobile = window.innerWidth < 768;
    const isHomePage = location.pathname === '/';
    
    if (shouldShowPopup && isMobile && isHomePage && !hasShownThisVisit) {
      // Show popup after 2 seconds delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasShownThisVisit(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [shouldShowPopup, hasShownThisVisit, location.pathname]);

  // Handle clicking outside the popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleBookNow = () => {
    setIsVisible(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop itself, not the popup content
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isVisible || !shouldShowPopup) {
    return null;
  }

  return (
    <>
      {/* Backdrop - Higher z-index to appear above navigation */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] md:hidden flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        
        {/* Popup Container */}
        <div 
          ref={popupRef}
          className="relative bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking popup content
        >
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-white/5 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full"></div>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 z-20 touch-manipulation"
            aria-label="Close popup"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="relative z-10 p-8 text-center text-white">
            
            {/* Canadian flag and sparkles */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
              <span className="text-4xl">🇨🇦</span>
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
            </div>

            {/* Main headline */}
            <h2 className="text-2xl font-bold mb-2 leading-tight">
              Canada Day
              <span className="block text-3xl font-black text-yellow-300">
                SPECIAL!
              </span>
            </h2>

            {/* Offer */}
            <div className="mb-6">
              <div className="text-5xl font-black text-white mb-2 drop-shadow-lg">
                50% OFF
              </div>
              <p className="text-red-100 text-sm">
                All activities • Minimum 2 hours
              </p>
            </div>

            {/* Coupon code section */}
            <div className="mb-6">
              <p className="text-red-100 text-sm mb-2">Use coupon code:</p>
              <div className="bg-white text-red-600 px-6 py-3 rounded-2xl font-black text-lg shadow-xl inline-block border-4 border-red-200">
                CANADADAY
              </div>
            </div>

            {/* CTA Button */}
            <Link
              to="/book"
              onClick={handleBookNow}
              className="block w-full bg-white text-red-600 font-bold py-4 px-6 rounded-2xl hover:bg-red-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 mb-4 touch-manipulation"
            >
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Book Now & Save 50%!</span>
                <Gift className="w-5 h-5" />
              </div>
            </Link>

            {/* Fine print */}
            <p className="text-red-200 text-xs leading-relaxed">
              Valid through July 31st • Cannot be combined with other offers
            </p>

            {/* Celebration emoji */}
            <div className="mt-4 text-2xl">
              🎉 🎊 🍁
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CanadaDayMobilePopup;
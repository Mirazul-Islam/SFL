import React, { useEffect } from 'react';
import { useVisitorTracking } from '../hooks/useVisitorTracking';

interface VisitorTrackerProps {
  enabled?: boolean;
  trackPageViews?: boolean;
  trackEvents?: boolean;
  trackScrollDepth?: boolean;
  sessionTimeout?: number;
}

const VisitorTracker: React.FC<VisitorTrackerProps> = (props) => {
  const { trackEvent } = useVisitorTracking(props);

  useEffect(() => {
    // Track common user interactions
    const trackClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Track button clicks
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button');
        trackEvent('button_click', {
          button_text: button?.textContent?.trim(),
          button_class: button?.className,
          page_section: button?.closest('section')?.className || 'unknown'
        });
      }
      
      // Track link clicks
      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.tagName === 'A' ? target : target.closest('a');
        trackEvent('link_click', {
          link_text: link?.textContent?.trim(),
          link_href: (link as HTMLAnchorElement)?.href,
          is_external: (link as HTMLAnchorElement)?.hostname !== window.location.hostname
        });
      }
    };

    // Track form submissions
    const trackFormSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement;
      trackEvent('form_submit', {
        form_id: form.id,
        form_class: form.className,
        form_action: form.action,
        page_url: window.location.href
      });
    };

    // Track booking attempts
    const trackBookingAttempt = () => {
      if (window.location.pathname.includes('/book')) {
        trackEvent('booking_page_visit', {
          timestamp: new Date().toISOString()
        });
      }
    };

    // Track contact form interactions
    const trackContactInteraction = () => {
      if (window.location.pathname.includes('/contact')) {
        trackEvent('contact_page_visit', {
          timestamp: new Date().toISOString()
        });
      }
    };

    // Track event page visits
    const trackEventPageVisit = () => {
      if (window.location.pathname.includes('/events')) {
        trackEvent('events_page_visit', {
          timestamp: new Date().toISOString()
        });
      }
    };

    // Track birthday party interest - Fixed CSS selector issue
    const trackBirthdayPartyInterest = () => {
      try {
        // Get all links that contain "/events" in href
        const eventLinks = document.querySelectorAll('a[href*="/events"]');
        
        // Get all buttons and filter by text content
        const allButtons = document.querySelectorAll('button');
        const birthdayButtons = Array.from(allButtons).filter(button => 
          button.textContent?.toLowerCase().includes('birthday party') ||
          button.textContent?.toLowerCase().includes('birthday') ||
          button.textContent?.toLowerCase().includes('party')
        );
        
        // Combine both sets of elements
        const allElements = [...Array.from(eventLinks), ...birthdayButtons];
        
        allElements.forEach(element => {
          element.addEventListener('click', () => {
            trackEvent('birthday_party_interest', {
              source: window.location.pathname,
              element_type: element.tagName.toLowerCase(),
              element_text: element.textContent?.trim(),
              timestamp: new Date().toISOString()
            });
          });
        });
      } catch (error) {
        console.warn('Error setting up birthday party tracking:', error);
      }
    };

    // Wrap all tracking setup in try-catch to prevent errors from breaking the app
    try {
      // Add event listeners
      document.addEventListener('click', trackClick);
      document.addEventListener('submit', trackFormSubmit);
      
      // Track page-specific events
      trackBookingAttempt();
      trackContactInteraction();
      trackEventPageVisit();
      trackBirthdayPartyInterest();
    } catch (error) {
      console.warn('Error initializing visitor tracking:', error);
    }

    return () => {
      try {
        document.removeEventListener('click', trackClick);
        document.removeEventListener('submit', trackFormSubmit);
      } catch (error) {
        console.warn('Error cleaning up visitor tracking:', error);
      }
    };
  }, [trackEvent]);

  // This component doesn't render anything
  return null;
};

export default VisitorTracker;
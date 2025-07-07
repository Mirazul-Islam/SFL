import { useState, useEffect, useCallback } from 'react';

interface VisitorTrackingOptions {
  enabled?: boolean;
  trackPageViews?: boolean;
  trackEvents?: boolean;
  trackScrollDepth?: boolean;
  sessionTimeout?: number;
}

interface TrackingData {
  sessionId?: string;
  pageUrl?: string;
  pageTitle?: string;
  referrer?: string;
  timeOnPage?: number;
  scrollDepth?: number;
  eventType?: string;
  eventData?: Record<string, any>;
}

export const useVisitorTracking = (options: VisitorTrackingOptions = {}) => {
  const {
    enabled = true,
    trackPageViews = true,
    trackEvents = true,
    trackScrollDepth = true,
    sessionTimeout = 30 * 60 * 1000 // 30 minutes
  } = options;

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pageStartTime, setPageStartTime] = useState<number>(Date.now());
  const [maxScrollDepth, setMaxScrollDepth] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize session
  const initializeSession = useCallback(async () => {
    if (!enabled) return;

    try {
      const response = await fetch('/.netlify/functions/track-visitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageUrl: window.location.href,
          pageTitle: document.title,
          referrer: document.referrer,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }

      const data = JSON.parse(text);
      
      if (data.success && data.sessionId) {
        setSessionId(data.sessionId);
        setIsInitialized(true);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.warn('Failed to initialize visitor tracking:', error);
      // Set a fallback session ID to prevent further errors
      setSessionId(`fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
      setIsInitialized(true);
    }
  }, [enabled]);

  // Track page view
  const trackPageView = useCallback(async (data: Partial<TrackingData> = {}) => {
    if (!enabled || !trackPageViews || !sessionId) return;

    try {
      const response = await fetch('/.netlify/functions/track-visitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          pageUrl: window.location.href,
          pageTitle: document.title,
          timeOnPage: Date.now() - pageStartTime,
          scrollDepth: maxScrollDepth,
          ...data,
        }),
      });

      if (!response.ok) {
        console.warn('Failed to track page view:', response.status);
      }
    } catch (error) {
      console.warn('Error tracking page view:', error);
    }
  }, [enabled, trackPageViews, sessionId, pageStartTime, maxScrollDepth]);

  // Track custom event
  const trackEvent = useCallback(async (eventType: string, eventData: Record<string, any> = {}) => {
    if (!enabled || !trackEvents || !sessionId) return;

    try {
      const response = await fetch('/.netlify/functions/track-visitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          pageUrl: window.location.href,
          eventType,
          eventData,
        }),
      });

      if (!response.ok) {
        console.warn('Failed to track event:', response.status);
      }
    } catch (error) {
      console.warn('Error tracking event:', error);
    }
  }, [enabled, trackEvents, sessionId]);

  // Track scroll depth
  const updateScrollDepth = useCallback(() => {
    if (!enabled || !trackScrollDepth) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    const scrollPercent = Math.round((scrollTop + windowHeight) / documentHeight * 100);
    
    if (scrollPercent > maxScrollDepth) {
      setMaxScrollDepth(Math.min(scrollPercent, 100));
    }
  }, [enabled, trackScrollDepth, maxScrollDepth]);

  // Initialize tracking on mount
  useEffect(() => {
    if (enabled && !isInitialized) {
      initializeSession();
    }
  }, [enabled, isInitialized, initializeSession]);

  // Track page changes
  useEffect(() => {
    if (!enabled || !trackPageViews) return;

    setPageStartTime(Date.now());
    setMaxScrollDepth(0);

    // Track page view after session is initialized
    if (sessionId) {
      trackPageView();
    }
  }, [enabled, trackPageViews, sessionId, trackPageView]);

  // Set up scroll tracking
  useEffect(() => {
    if (!enabled || !trackScrollDepth) return;

    const handleScroll = () => updateScrollDepth();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled, trackScrollDepth, updateScrollDepth]);

  // Track page unload
  useEffect(() => {
    if (!enabled || !trackPageViews) return;

    const handleBeforeUnload = () => {
      if (sessionId) {
        // Use sendBeacon for reliable tracking on page unload
        const data = JSON.stringify({
          sessionId,
          pageUrl: window.location.href,
          timeOnPage: Date.now() - pageStartTime,
          scrollDepth: maxScrollDepth,
        });

        if (navigator.sendBeacon) {
          navigator.sendBeacon('/.netlify/functions/track-visitor', data);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, trackPageViews, sessionId, pageStartTime, maxScrollDepth]);

  return {
    sessionId,
    isInitialized,
    trackPageView,
    trackEvent,
  };
};
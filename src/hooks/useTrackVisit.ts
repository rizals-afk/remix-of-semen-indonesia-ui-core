import { useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';
import { getVisitorId } from '@/utils/visitorId';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export function useTrackVisit() {
  const location = useLocation();

  useEffect(() => {
    console.log('usetrackvisit', location.pathname, getVisitorId());
    fetch(`${API_BASE}/track-visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitor_id: getVisitorId(),
        path: location.pathname,
      }),
    }).catch((e) => {
      console.log('error trackvisit', e);
      // fail silently — tracking must never break the app
    });
  }, [location.pathname]);
}

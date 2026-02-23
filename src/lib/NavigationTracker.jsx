import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { pagesConfig } from '@/pages.config';

export default function NavigationTracker() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { Pages, mainPage } = pagesConfig;
  const mainPageKey = mainPage ?? Object.keys(Pages)[0];

  useEffect(() => {
    const path = location.pathname.slice(1);
    let pageName = path || mainPageKey;

    // Simple lookup in Pages config
    const pageKeys = Object.keys(Pages);
    const matchedKey = pageKeys.find(
      key => key.toLowerCase() === path.toLowerCase()
    );

    if (matchedKey) {
      pageName = matchedKey;
    }

    if (isAuthenticated && pageName) {
      // Removed base44.appLogs.logUserInApp(pageName)
      console.log('User navigated to:', pageName); // Placeholder log
    }
  }, [location, isAuthenticated, Pages, mainPageKey]);

  return null;
}
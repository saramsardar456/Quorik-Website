import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset scroll position instantly when route changes
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Restore smooth scroll for anchor links after a short delay
    const timer = setTimeout(() => {
      document.documentElement.style.scrollBehavior = '';
    }, 50);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

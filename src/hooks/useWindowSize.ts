import { useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from '@/constants/defaults';

export function useWindowSizePersistence() {
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.WINDOW_SIZE);
    if (saved) {
      try {
        const { width, height } = JSON.parse(saved);
        if (width >= 1000 && height >= 700) {
          window.resizeTo(width, height);
        }
      } catch {
        // ignore
      }
    }

    const handleResize = () => {
      try {
        const size = { width: window.innerWidth, height: window.innerHeight };
        localStorage.setItem(LOCAL_STORAGE_KEYS.WINDOW_SIZE, JSON.stringify(size));
      } catch {
        // ignore
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
}
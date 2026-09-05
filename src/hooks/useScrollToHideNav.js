import { useRef, useEffect } from 'react';
import { Platform } from 'react-native';
import { useUIStore } from '../store/ui.store';

export function useScrollToHideNav() {
  const setNavbarVisible = useUIStore(state => state.setNavbarVisible);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    // Explicitly guarantee navbar is visible when screen mounts
    setNavbarVisible(true);

    let windowTimeoutId = null;

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      let lastWindowY = window.scrollY || 0;

      const handleWindowScroll = () => {
        const currentY = window.scrollY || 0;

        if (currentY <= 15) {
          setNavbarVisible(true);
          lastWindowY = currentY;
          return;
        }

        const diff = currentY - lastWindowY;

        if (diff > 8 && currentY > 40) {
          setNavbarVisible(false);
        } else if (diff < -6) {
          setNavbarVisible(true);
        }

        lastWindowY = currentY;

        if (windowTimeoutId) clearTimeout(windowTimeoutId);
        windowTimeoutId = setTimeout(() => {
          setNavbarVisible(true);
        }, 400);
      };

      window.addEventListener('scroll', handleWindowScroll, { passive: true });

      return () => {
        setNavbarVisible(true);
        window.removeEventListener('scroll', handleWindowScroll);
        if (windowTimeoutId) clearTimeout(windowTimeoutId);
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      };
    }

    return () => {
      setNavbarVisible(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [setNavbarVisible]);

  const handleScroll = (event) => {
    if (!event || !event.nativeEvent) return;
    const currentScrollY = event.nativeEvent.contentOffset.y;
    
    // Ignore bounce on iOS top/bottom
    if (currentScrollY < 0) return;

    // Top of page: always show navbar
    if (currentScrollY <= 15) {
      setNavbarVisible(true);
      lastScrollY.current = currentScrollY;
      return;
    }

    const diff = currentScrollY - lastScrollY.current;

    // Scroll Down -> hide navbar
    if (diff > 8 && currentScrollY > 40) {
      setNavbarVisible(false);
    } 
    // Scroll Up -> show navbar
    else if (diff < -6) {
      setNavbarVisible(true);
    }
    
    lastScrollY.current = currentScrollY;

    // Auto-show navbar when user pauses/stops scrolling for 400ms
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      setNavbarVisible(true);
    }, 400);
  };

  return { 
    onScroll: handleScroll, 
    scrollEventThrottle: 16 
  };
}

import { useRef, useEffect } from 'react';
import { useUIStore } from '../store/ui.store';

export function useScrollToHideNav() {
  const setNavbarVisible = useUIStore(state => state.setNavbarVisible);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    // Explicitly guarantee bottom navbar is visible when screen mounts
    setNavbarVisible(true);
    return () => {
      setNavbarVisible(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

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

    // Auto-show navbar when user pauses/stops scrolling for 450ms
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      setNavbarVisible(true);
    }, 450);
  };

  return { 
    onScroll: handleScroll, 
    scrollEventThrottle: 16 
  };
}

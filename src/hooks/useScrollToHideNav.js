import { useRef } from 'react';
import { useUIStore } from '../store/ui.store';

export function useScrollToHideNav() {
  const setNavbarVisible = useUIStore(state => state.setNavbarVisible);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);

  const handleScroll = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    
    if (currentScrollY < 0) return; // Ignore bounce on iOS

    if (currentScrollY > lastScrollY.current + 10 && currentScrollY > 50) {
      setNavbarVisible(false);
    } else if (currentScrollY < lastScrollY.current - 10) {
      setNavbarVisible(true);
    }
    
    lastScrollY.current = currentScrollY;

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      setNavbarVisible(true);
    }, 800);
  };

  return { 
    onScroll: handleScroll, 
    scrollEventThrottle: 16 
  };
}

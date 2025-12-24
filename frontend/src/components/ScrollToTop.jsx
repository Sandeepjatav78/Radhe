import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Jab bhi pathname (URL) change hoga, ye top par scroll karega
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Iska koi UI nahi hota, ye background me chalta hai
};

export default ScrollToTop;
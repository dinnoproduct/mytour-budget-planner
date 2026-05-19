"use client"

import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { screenBreakpointAtom } from '../modules/packages/store/store';

const useScreenBreakpoints = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useRecoilState(screenBreakpointAtom);

  const breakpoints: { [key: string]: string } = {
    small: '(max-width: 993px)',
    medium: '(min-width: 993px) and (max-width: 1170px)',
    large: '(min-width: 1170px)',
  };

  const handleBreakpointChange = (breakpoint: string) => {
    setCurrentBreakpoint(breakpoint);
  };

  const checkBreakpoint = () => {
    for (const breakpoint in breakpoints) {
      if (window.matchMedia(breakpoints[breakpoint]).matches) {
        handleBreakpointChange(breakpoint);
        break;
      }
    }
  };

  useEffect(() => {
    // Initial check on component mount
    checkBreakpoint();

    const handleResize = () => {
      checkBreakpoint();
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array ensures that effect runs only on mount and unmount

  return currentBreakpoint;
};

export default useScreenBreakpoints;

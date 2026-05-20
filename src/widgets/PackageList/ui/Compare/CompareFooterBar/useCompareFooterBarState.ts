import { useEffect, useRef, useState } from "react";

type UseCompareFooterBarStateParams = {
  isMobile: boolean;
  isVisible: boolean;
  selectedCount: number;
};

export const useCompareFooterBarState = ({
  isMobile,
  isVisible,
  selectedCount,
}: UseCompareFooterBarStateParams) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const previousSelectedCountRef = useRef(0);

  useEffect(() => {
    if (!isVisible) {
      setIsExpanded(false);
    }
  }, [isVisible]);

  useEffect(() => {
    const previousSelectedCount = previousSelectedCountRef.current;
    const hasNewSelection = selectedCount > previousSelectedCount;
    const reachedCompareMinimum =
      previousSelectedCount < 1 && selectedCount >= 1;

    if (
      isMobile &&
      isVisible &&
      (hasNewSelection || reachedCompareMinimum)
    ) {
      setIsExpanded(true);
    }

    previousSelectedCountRef.current = selectedCount;
  }, [isMobile, isVisible, selectedCount]);

  useEffect(() => {
    if (!isMobile || !isVisible || !isExpanded) {
      return;
    }

    const handleScroll = () => {
      setIsExpanded(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isExpanded, isMobile, isVisible]);

  return {
    isExpanded,
    setIsExpanded,
  };
};

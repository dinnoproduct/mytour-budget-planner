import {
  Box,
  Collapse,
  Slide,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CompareFooterContent } from "./CompareFooterContent";
import { CompareFooterMobileHeader } from "./CompareFooterMobileHeader";
import { useCompareFooterBarState } from "./useCompareFooterBarState";
import { type CompareFooterBarProps } from "./types";

export const CompareFooterBar = ({
  selectedPackages,
  maxCompareItems,
  getCompareKey,
  onRemove,
  onClear,
  onCompare,
  isHidden = false,
}: CompareFooterBarProps) => {
  const { t } = useTranslation();
  const isVisible = selectedPackages.length >= 1 && !isHidden;
  const isCompareDisabled = selectedPackages.length < 2;
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;
  const { isExpanded, setIsExpanded } = useCompareFooterBarState({
    isMobile,
    isVisible,
    selectedCount: selectedPackages.length,
  });

  const counterLabel = useMemo(
    () =>
      `${selectedPackages.length}/${maxCompareItems} ${t("compareFooterBar.selected")}`,
    [maxCompareItems, selectedPackages.length, t],
  );

  return (
    <Slide direction="bottom" in={isVisible} style={{ zIndex: 9999999999 }}>
      <Box
        bg="white"
        borderTopWidth={{ base: 0, md: "1px" }}
        borderTopColor="gray.200"
        roundedTop={{ base: "2xl", md: "none" }}
        overflow="hidden"
        boxShadow={{ base: "0 -8px 24px rgba(15, 23, 42, 0.16)", md: "none" }}
      >
        <CompareFooterMobileHeader
          counterLabel={counterLabel}
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded((prev) => !prev)}
        />

        {!isMobile ? (
          <CompareFooterContent
            selectedPackages={selectedPackages}
            getCompareKey={getCompareKey}
            onRemove={onRemove}
            onClear={onClear}
            onCompare={onCompare}
            clearLabel={t("clear")}
            compareLabel={t("compare")}
            counterLabel={counterLabel}
            isCompareDisabled={isCompareDisabled}
          />
        ) : null}

        {isMobile ? (
          <Collapse in={isExpanded} animateOpacity>
            <CompareFooterContent
              selectedPackages={selectedPackages}
              getCompareKey={getCompareKey}
              onRemove={onRemove}
              onClear={onClear}
              onCompare={onCompare}
              clearLabel={t("clear")}
              compareLabel={t("compare")}
              isCompareDisabled={isCompareDisabled}
              isMobile
            />
          </Collapse>
        ) : null}
      </Box>
    </Slide>
  );
};

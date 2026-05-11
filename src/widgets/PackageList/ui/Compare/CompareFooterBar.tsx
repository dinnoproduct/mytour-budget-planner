import {
  Box,
  Flex,
  HStack,
  Slide,
} from "@chakra-ui/react";
import { Button, Text } from "@ui";
import { useTranslation } from "react-i18next";
import { type PackageEntity } from "@entities/package";
import { SelectedCompareItem } from "./SelectedCompareItem";

type CompareFooterBarProps = {
  selectedPackages: PackageEntity[];
  maxCompareItems: number;
  getCompareKey: (packageEntity: PackageEntity) => string;
  onRemove: (key: string) => void;
  onClear: () => void;
};

export const CompareFooterBar = ({
  selectedPackages,
  maxCompareItems,
  getCompareKey,
  onRemove,
  onClear,
}: CompareFooterBarProps) => {
  const { t } = useTranslation();
  const isVisible = selectedPackages.length > 1;

  return (
    <Slide direction="bottom" in={isVisible} style={{ zIndex: 1400 }}>
      <Box
        borderTop="1px solid"
        borderColor="gray.200"
        bg="white"
        px={{ base: 4, md: 8 }}
        py={{ base: 4, md: 4 }}
      >
        <Text size="sm" color="gray.800" fontWeight="700" whiteSpace="nowrap">
          {selectedPackages.length}/{maxCompareItems}{" "}
          {t("compareFooterBar.selected")}
        </Text>
        <Flex
          align="center"
          justify="space-between"
          gap={4}
          mt={{ base: 2, md: 2 }}
          direction={{ base: "column", md: "row" }}
        >
          <HStack
            spacing={2}
            overflowX="auto"
            w="full"
            sx={{
              "&::-webkit-scrollbar": { height: "6px" },
            }}
          >
            {selectedPackages.map((item) => {
              return (
                <SelectedCompareItem
                  key={getCompareKey(item)}
                  item={item}
                  onRemove={() => onRemove(getCompareKey(item))}
                  clearLabel={t("clear")}
                />
              );
            })}
          </HStack>
          <HStack w={{ base: "full", md: "auto" }} spacing={2}>
            <Button
              variant="outline-blue"
              width={{ base: "full", md: "auto" }}
              onClick={onClear}
            >
              {t("clear")}
            </Button>
            <Button variant="solid-blue" width={{ base: "full", md: "auto" }}>
              {t("compare")}
            </Button>
          </HStack>
        </Flex>
      </Box>
    </Slide>
  );
};
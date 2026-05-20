import { Box, CloseButton, Flex, Image } from "@chakra-ui/react";
import { Icon, Text } from "@ui";
import { CURRENCY_MAP } from "@shared/model";
import { numberWithCommaNormalizer } from "@/utils/normalizers";
import { type PackageEntity } from "@entities/package";

type SelectedCompareItemProps = {
  item: PackageEntity;
  onRemove: () => void;
  clearLabel: string;
};

export const SelectedCompareItem = ({
  item,
  onRemove,
  clearLabel,
}: SelectedCompareItemProps) => {
  const imageSrc = item.hotel.images?.[0]?.url ?? "";

  return (
    <Flex
      w={{ base: "240px", md: "full" }}
      minW={{ base: "240px", md: "0" }}
      maxW={{ base: "240px", md: "20%" }}
      flexShrink={0}
      align="stretch"
      border="1px solid"
      borderColor="gray.200"
      rounded="md"
      p={2}
      gap={2}
    >
      <Image
        src={imageSrc}
        alt={item.hotel.name}
        boxSize="56px"
        rounded="lg"
        objectFit="cover"
        fallback={<Box boxSize="36px" bg="gray.100" rounded="sm" />}
      />
      <Flex flex="1" minW={0} flexDirection="column" gap={1} justify="space-between" pb={1}>
        <Text size="sm" color="gray.800" noOfLines={1} fontWeight="600">
          {item.hotel.name}
        </Text>
        <Text size="sm" color="gray.700" fontWeight="400">
          {numberWithCommaNormalizer(item.price)}{" "}{CURRENCY_MAP['AMD']}
        </Text>
      </Flex>
      <CloseButton
        size="sm"
        onClick={onRemove}
        aria-label={`${item.hotel.name} ${clearLabel}`}
      />
    </Flex>
  );
};

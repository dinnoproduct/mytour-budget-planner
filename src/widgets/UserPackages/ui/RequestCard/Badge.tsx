import { Flex, type FlexProps } from '@chakra-ui/react'
import { Icon, Text } from '@ui'

export const PaginationBadge = ({
  currentIndex,
  imagesCount,
  ...props
}: {
  currentIndex: number
  imagesCount: number
} & FlexProps) => (
  <Flex
    position="absolute"
    bottom="2"
    left="2"
    bgColor="blackAlpha.500"
    color="white"
    px="2"
    height="20px"
    rounded="full"
    fontSize="sm"
    align="center"
    {...props}
  >
    <Text size="xs" color="white">
      {currentIndex + 1}/{imagesCount}
    </Text>
  </Flex>
)


export const HotelStarBadge = ({
  starsCount,
  ...props
}: { starsCount: number } & FlexProps) => (
  <Flex
    position="absolute"
    bottom="2"
    right="2"
    bgColor="orange.500"
    color="white"
    px="2"
    height="20px"
    rounded="full"
    fontSize="sm"
    align="center"
    {...props}
  >
    <Icon name="star" color="white" size="12" />

    <Text size="xs" color="white" ml=".5">
      {starsCount}
    </Text>
  </Flex>
)


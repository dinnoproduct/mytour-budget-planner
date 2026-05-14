import { Box, Flex, VStack } from '@chakra-ui/react'
import {
  type DictionaryTypes,
  type PackageEntity,
  useDictionary,
} from '@entities/package'
import { Button, Icon, StatusOnImageBadge, Text } from '@ui'
import { CURRENCY_MAP } from '@shared/model'
import { numberWithCommaNormalizer } from '@/utils/normalizers'
import ImageSlider from '@features/PackageCard/ui/ImageSlider'
import { formatNumber } from '@shared/utils'
import { useMemo } from 'react'
import {
  hasComparedValue,
} from './helpers'
import { type CompareFilterGroup } from './types'

type ComparePackageCardProps = {
  pack: PackageEntity
  cityLabel: string
  compareFilterGroups: CompareFilterGroup[]
  onRemove: (pack: PackageEntity) => void
  getLink: (pack: PackageEntity) => string
  t: (key: string) => string
}

export const ComparePackageCard = ({
  pack,
  cityLabel,
  compareFilterGroups,
  onRemove,
  getLink,
  t
}: ComparePackageCardProps) => {
  const { data: foodTypes = [] } = useDictionary(
    'FoodTypeDictionary' as DictionaryTypes.FoodTypeDictionary
  )
  const foodType = useMemo(
    () =>
      foodTypes.find(({ key }) => key === pack.foodType)?.value ??
      String(pack.foodType ?? ''),
    [foodTypes, pack.foodType]
  )

  return (
    <Box
      border="1px solid"
      borderColor="gray.100"
      overflow="hidden"
      bg="white"
      minW={{ base: '340px', md: '20%' }}
      w={{ base: '340px', md: 'auto' }}
      flexShrink={0}
    >
      <Box bg="gray.50" p={4}>
        <ImageSlider
          images={pack.hotel.images}
          starsCount={pack.hotel.stars}
        />
      </Box>

      <VStack align="stretch">
        <Box bg="gray.50" pb={4} px={4}>
          <Text size="sm" fontWeight="700" color="gray.800" noOfLines={1}>
            {pack.hotel.name}
          </Text>
          <Flex align="center" gap="1">
            <Icon name="location-pin" size="16" color="gray.500" />
            <Text size="xs" color="gray.500" mt="1" noOfLines={1}>
              {cityLabel}
            </Text>
          </Flex>
          {!!pack.foodType && (
            <Flex alignItems="center" gap={1}>
              <Icon name="status-success-outlined" size="16" />
              <StatusOnImageBadge
                status="foodType"
                position="static"
                backgroundColor="transparent"
                p={0}
                textProps={{
                  color: "gray.600",
                }}
                rounded="24px"
              >
                {foodType}
              </StatusOnImageBadge>
            </Flex>
          )}
        </Box>

        <Flex justify="space-between" align="center" px={4}>
          <Text size="xs" color="gray.600" mt="1" noOfLines={1}>
            {t('startFrom')}
          </Text>
          <Flex align="center" gap="1">
            <Text size="lg" fontWeight="700" color="gray.800" align="center">
              {numberWithCommaNormalizer(pack.price)} ֏
            </Text>
            <Text size="xs" color="gray.600" mt="1" noOfLines={1}>
              ≈{formatNumber(pack.priceInCurrency)} {CURRENCY_MAP[pack.currency]}
            </Text>
          </Flex>
        </Flex>

        <VStack
          align="stretch"
          spacing="3"
          pt="3"
          borderTop="1px solid"
          borderColor="gray.100"
          flex="1"
        >
          {compareFilterGroups.map(group => (
            <Box key={group.id}>
              <Text
                size="sm"
                fontWeight="700"
                color="gray.700"
                noOfLines={1}
                pb="2"
                px="4"
                letterSpacing="0.02em"
              >
                {group.title}
              </Text>
              <VStack align="stretch">
                {group.rows.map((row, rowIndex) => {
                  const isIncluded = hasComparedValue(pack, row)

                  return (
                    <Flex
                      key={row.key}
                      align="center"
                      gap="3"
                      minH="20px"
                      px="5"
                      py="2"
                      bg={rowIndex % 2 === 1 ? 'gray.50' : 'transparent'}
                    >
                      <Icon
                        name={isIncluded ? 'check' : 'close'}
                        size="16"
                        color={isIncluded ? 'green.500' : 'red.500'}
                        flexShrink={0}
                      />
                      <Text size="sm" color="gray.800" noOfLines={1}>
                        {row.label}
                      </Text>
                    </Flex>
                  )
                })}
              </VStack>
            </Box>
          ))}
        </VStack>

        <VStack p="4" spacing="2" borderTop="1px solid" borderColor="gray.100">
          <Button
            variant="solid-blue"
            size="md"
            width="full"
            to={getLink(pack)}
          >
            {t('learnMore')}
          </Button>
          <Button
            variant="outline-blue"
            size="md"
            width="full"
            onClick={() => onRemove(pack)}
          >
            {t('clear')}
          </Button>
        </VStack>
      </VStack>
    </Box>
  )
}

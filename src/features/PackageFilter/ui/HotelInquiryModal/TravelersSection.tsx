import { Box, Flex, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react'
import { type Dispatch, type SetStateAction } from 'react'
import { Button } from '@/shared/ui'
import { MAX_TRAVELERS, type TravelersData } from './helpers'

type TravelersSectionProps = {
  t: (key: string) => string
  travelersData: TravelersData
  setTravelersData: Dispatch<SetStateAction<TravelersData>>
}

export const TravelersSection: React.FC<TravelersSectionProps> = ({
  t,
  travelersData,
  setTravelersData,
}) => {
  const maxAdultsCount = MAX_TRAVELERS - travelersData.childrenCount
  const maxChildrenCount = MAX_TRAVELERS - travelersData.adultsCount

  const handleAdultsCountChange = (count: number) => {
    setTravelersData(prev => ({
      ...prev,
      adultsCount: Math.max(1, Math.min(count, maxAdultsCount)),
    }))
  }

  const handleChildrenCountChange = (count: number) => {
    const nextChildrenCount = Math.max(0, Math.min(count, maxChildrenCount))

    setTravelersData(prev => {
      const nextChildrenAges =
        nextChildrenCount === 0
          ? []
          : [
            ...prev.childrenAges.slice(0, nextChildrenCount),
            ...Array(
              Math.max(0, nextChildrenCount - prev.childrenAges.length),
            ).fill(1),
          ]

      return {
        ...prev,
        childrenCount: nextChildrenCount,
        childrenAges: nextChildrenAges,
      }
    })
  }

  const handleChildAgeChange = (index: number, age: number) => {
    setTravelersData(prev => {
      const nextChildrenAges = [...prev.childrenAges]
      nextChildrenAges[index] = Math.max(1, Math.min(13, age))

      return {
        ...prev,
        childrenAges: nextChildrenAges,
      }
    })
  }

  return (
    <VStack spacing={4} align="stretch">
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="sm" color="gray.900">{t('adults')}</Text>
          <Text fontSize="sm" color="gray.500" mt={1}>{t('age14+')}</Text>
        </Box>
        <Flex align="center" width="144px" justify="space-between">
          <Button
            size="md"
            icon="remove"
            variant="solid-gray"
            onClick={() => handleAdultsCountChange(travelersData.adultsCount - 1)}
            isDisabled={travelersData.adultsCount <= 1}
          />
          <Text color="gray.800" size="sm">{travelersData.adultsCount}</Text>
          <Button
            size="md"
            icon="add"
            variant="solid-gray"
            onClick={() => handleAdultsCountChange(travelersData.adultsCount + 1)}
            isDisabled={travelersData.adultsCount >= maxAdultsCount}
          />
        </Flex>
      </Flex>

      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="sm" color="gray.900">{t('children')}</Text>
          <Text fontSize="sm" color="gray.500" mt={1}>{t('age0-13')}</Text>
        </Box>
        <Flex align="center" width="144px" justify="space-between">
          <Button
            size="md"
            icon="remove"
            variant="solid-gray"
            onClick={() => handleChildrenCountChange(travelersData.childrenCount - 1)}
            isDisabled={travelersData.childrenCount <= 0}
          />
          <Text color="gray.800" size="sm">{travelersData.childrenCount}</Text>
          <Button
            size="md"
            icon="add"
            variant="solid-gray"
            onClick={() => handleChildrenCountChange(travelersData.childrenCount + 1)}
            isDisabled={travelersData.childrenCount >= maxChildrenCount}
          />
        </Flex>
      </Flex>

      {Array.from({ length: travelersData.childrenCount }).map((_, index) => (
        <FormControl key={`hotel-inquiry-child-${index}`}>
          <FormLabel>{`${t('child')} ${index + 1}*`}</FormLabel>
          <Input
            type="number"
            min={1}
            max={13}
            value={travelersData.childrenAges[index] ?? 1}
            onChange={(e) => handleChildAgeChange(index, Number(e.target.value) || 1)}
          />
        </FormControl>
      ))}
    </VStack>
  )
}

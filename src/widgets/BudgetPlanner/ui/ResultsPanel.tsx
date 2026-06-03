'use client'

import { Box, Flex, SimpleGrid, Image } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Button, Text } from '@ui'
import { type PlanResult } from '../model/types'

interface ResultsPanelProps {
  result: PlanResult
}

const formatAMD = (value: number) =>
  new Intl.NumberFormat('en-US').format(value)

const stars = (count: number) => '\u2605'.repeat(count)

export const ResultsPanel = ({ result }: ResultsPanelProps) => {
  const { t } = useTranslation()
  const { flight, hotels } = result

  return (
    <Box>
      {/* Top bar: budget breakdown + flight */}
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        gap={4}
        mb={8}
      >
        {/* Budget breakdown */}
        <Box
          flex={1}
          bg="gray.50"
          border="1px solid"
          borderColor="gray.100"
          rounded="xl"
          px={5}
          py={4}
        >
          <Text size="xs" fontWeight="600" color="gray.400" textTransform="uppercase" letterSpacing="wider" mb={3}>
            {t('budgetPlanner.totalBudget')}
          </Text>
          <Flex justify="space-between" align="center" mb={2}>
            <Text size="sm" color="gray.600">{t('budgetPlanner.totalBudget')}</Text>
            <Text size="md" color="gray.800" fontWeight="bold">{formatAMD(result.totalBudget)}</Text>
          </Flex>
          <Flex justify="space-between" align="center" mb={2}>
            <Text size="sm" color="gray.600">{t('budgetPlanner.flightCost')}</Text>
            <Text size="sm" color="red.500" fontWeight="600">&minus;{formatAMD(flight.totalPrice)}</Text>
          </Flex>
          <Box borderTop="1px solid" borderColor="gray.200" pt={2} mt={1}>
            <Flex justify="space-between" align="center">
              <Text size="sm" color="green.600" fontWeight="bold">{t('budgetPlanner.remainingForHotel')}</Text>
              <Text size="md" color="green.600" fontWeight="bold">{formatAMD(result.totalBudget - flight.totalPrice)} AMD</Text>
            </Flex>
          </Box>
        </Box>

        {/* Flight card */}
        <Box
          flex={1}
          bg="white"
          border="1px solid"
          borderColor="gray.100"
          rounded="xl"
          px={5}
          py={4}
          boxShadow="sm"
        >
          <Flex justify="space-between" align="flex-start" flexWrap="wrap" gap={3}>
            <Box>
              <Flex align="center" gap={2} mb={1}>
                <Box
                  bg="blue.50"
                  color="blue.500"
                  px={2}
                  py={0.5}
                  rounded="md"
                  fontSize="xs"
                  fontWeight="700"
                >
                  {flight.airline}
                </Box>
              </Flex>
              <Text size="lg" fontWeight="bold" color="gray.800" mt={1}>
                {flight.route}
              </Text>
              <Text size="sm" color="gray.500" mt={0.5}>
                {flight.departureDate} &mdash; {flight.returnDate} &middot; {flight.pax}{' '}
                {flight.pax === 1 ? t('budgetPlanner.person') : t('budgetPlanner.people')}
              </Text>
            </Box>
            <Flex direction="column" align={{ base: 'flex-start', sm: 'flex-end' }} gap={2}>
              <Text size="xl" fontWeight="bold" color="gray.800">
                {formatAMD(flight.totalPrice)}
                <Text as="span" size="xs" color="gray.400" fontWeight="normal" ml={1}>AMD</Text>
              </Text>
              <Button
                variant="outline-blue"
                size="sm"
                href={flight.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('budgetPlanner.bookFlight')}
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Flex>

      {/* Hotel options */}
      {hotels.length > 0 ? (
        <>
          <Flex align="center" gap={3} mb={5}>
            <Text size="lg" fontWeight="bold" color="gray.800">
              {t('budgetPlanner.hotelOptions')}
            </Text>
            <Box bg="blue.500" color="white" px={2.5} py={0.5} rounded="full" fontSize="xs" fontWeight="700">
              {hotels.length}
            </Box>
          </Flex>

          <SimpleGrid columns={{ base: 1, xs: 2, smd: 3, md: 4 }} gap={5}>
            {hotels.map((hotel) => (
              <Box
                key={hotel.id}
                bg="white"
                border="1px solid"
                borderColor="gray.100"
                rounded="xl"
                overflow="hidden"
                boxShadow="sm"
                transition="all 0.2s"
                _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)' }}
                display="flex"
                flexDirection="column"
              >
                {/* Image with gradient overlay for stars */}
                <Box position="relative">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    w="full"
                    h="160px"
                    objectFit="cover"
                  />
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    bgGradient="linear(to-t, blackAlpha.600, transparent)"
                    px={3}
                    pb={2}
                    pt={6}
                  >
                    <Flex align="center" gap={1.5}>
                      <Text fontSize="xs" color="yellow.300" lineHeight={1}>
                        {stars(hotel.stars)}
                      </Text>
                      <Text fontSize="xs" color="whiteAlpha.800">
                        {hotel.area}
                      </Text>
                    </Flex>
                  </Box>
                </Box>

                <Flex direction="column" p={4} flex={1} gap={1}>
                  <Text size="sm" fontWeight="bold" color="gray.800" noOfLines={1} mb={1}>
                    {hotel.name}
                  </Text>

                  <Flex justify="space-between">
                    <Text size="xs" color="gray.400">{t('budgetPlanner.perNight')}</Text>
                    <Text size="xs" fontWeight="600" color="gray.600">
                      {formatAMD(hotel.pricePerNight)}
                    </Text>
                  </Flex>

                  <Box
                    bg="gray.50"
                    mx={-4}
                    px={4}
                    py={2}
                    my={2}
                  >
                    <Flex justify="space-between" align="center">
                      <Text size="xs" fontWeight="700" color="gray.700">
                        {t('budgetPlanner.tripTotal')}
                      </Text>
                      <Text size="md" fontWeight="bold" color="gray.800">
                        {formatAMD(hotel.totalTripCost)}
                        <Text as="span" size="xs" color="gray.400" fontWeight="normal" ml={1}>AMD</Text>
                      </Text>
                    </Flex>
                  </Box>

                  <Flex justify="space-between" align="center" mb={3}>
                    <Text size="xs" color="green.500" fontWeight="600">
                      {t('budgetPlanner.remaining')}
                    </Text>
                    <Text size="xs" color="green.500" fontWeight="bold">
                      +{formatAMD(hotel.remainingBudget)}
                    </Text>
                  </Flex>

                  <Box mt="auto">
                    <Button
                      variant="solid-blue"
                      size="sm"
                      w="full"
                      href={hotel.mytourUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('budgetPlanner.bookHotel')}
                    </Button>
                  </Box>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        </>
      ) : (
        <Flex
          bg="orange.50"
          border="1px solid"
          borderColor="orange.100"
          rounded="xl"
          p={8}
          direction="column"
          align="center"
          textAlign="center"
        >
          <Text fontSize="3xl" mb={2}>
            {'\u{1F614}'}
          </Text>
          <Text size="md" color="orange.700" fontWeight="600">
            {t('budgetPlanner.noHotels')}
          </Text>
          <Text size="sm" color="orange.500" mt={1}>
            {t('budgetPlanner.noHotelsHint')}
          </Text>
        </Flex>
      )}
    </Box>
  )
}

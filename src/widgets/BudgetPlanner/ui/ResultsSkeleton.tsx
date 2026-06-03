'use client'

import { Box, Flex, SimpleGrid, Skeleton } from '@chakra-ui/react'

const CardSkeleton = () => (
  <Box
    bg="white"
    border="1px solid"
    borderColor="gray.100"
    rounded="xl"
    overflow="hidden"
  >
    <Skeleton h="160px" w="full" />
    <Box p={4}>
      <Skeleton h="14px" w="65%" mb={2.5} rounded="full" />
      <Skeleton h="11px" w="45%" mb={3} rounded="full" />
      <Skeleton h="11px" w="full" mb={2} rounded="full" />
      <Skeleton h="36px" w="full" mb={2} rounded="lg" />
      <Skeleton h="11px" w="50%" mb={4} rounded="full" />
      <Skeleton h="36px" w="full" rounded="lg" />
    </Box>
  </Box>
)

export const ResultsSkeleton = () => (
  <Box>
    {/* Top bar skeletons */}
    <Flex direction={{ base: 'column', sm: 'row' }} gap={4} mb={8}>
      <Skeleton flex={1} h="130px" rounded="xl" />
      <Skeleton flex={1} h="130px" rounded="xl" />
    </Flex>

    {/* Section title */}
    <Flex align="center" gap={3} mb={5}>
      <Skeleton h="20px" w="220px" rounded="full" />
      <Skeleton h="22px" w="28px" rounded="full" />
    </Flex>

    {/* Hotel cards */}
    <SimpleGrid columns={{ base: 1, xs: 2, smd: 3, md: 4 }} gap={5}>
      {[0, 1, 2, 3].map((i) => (
        <CardSkeleton key={i} />
      ))}
    </SimpleGrid>
  </Box>
)

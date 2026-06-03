'use client'

import { useState, useCallback, useRef } from 'react'
import { Box, Flex, Image } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Text } from '@ui'
import { type BudgetInput, type PlanResult, BUDGET_DEFAULT } from '../model/types'
import { planTrip } from '../model/optimizer'
import { InputPanel } from './InputPanel'
import { ResultsPanel } from './ResultsPanel'
import { ResultsSkeleton } from './ResultsSkeleton'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=400&fit=crop&q=80'

const INITIAL_INPUT: BudgetInput = {
  budget: BUDGET_DEFAULT,
  nights: 7,
  month: 'july',
  travellers: 2,
  vibe: 'beach',
}

export const BudgetPlanner = () => {
  const { t } = useTranslation()
  const [input, setInput] = useState<BudgetInput>(INITIAL_INPUT)
  const [result, setResult] = useState<PlanResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleChange = useCallback((update: Partial<BudgetInput>) => {
    setInput((prev) => ({ ...prev, ...update }))
  }, [])

  const handlePlan = useCallback(() => {
    setIsLoading(true)
    setResult(null)

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)

    setTimeout(() => {
      setResult(planTrip(input))
      setIsLoading(false)
    }, 900)
  }, [input])

  return (
    <Box
      w="full"
      maxW="1440px"
      mx="auto"
      px={{ base: 4, md: 10 }}
      mt={{ base: 10, md: 12 }}
    >
      {/* Hero header with image */}
      <Box
        position="relative"
        rounded="2xl"
        overflow="hidden"
        mb={6}
      >
        <Image
          src={HERO_IMAGE}
          alt=""
          w="full"
          h={{ base: '160px', sm: '200px', md: '220px' }}
          objectFit="cover"
        />
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-r, blackAlpha.700, blackAlpha.300)"
        />
        <Flex
          position="absolute"
          inset={0}
          direction="column"
          justify="center"
          px={{ base: 5, md: 10 }}
          py={6}
        >
          <Text
            as="h2"
            size={{ base: 'xl', md: '3xl' }}
            fontWeight="bold"
            color="white"
          >
            {t('budgetPlanner.title')}
          </Text>
          <Text
            size={{ base: 'sm', md: 'md' }}
            color="whiteAlpha.800"
            mt={1}
            maxW="600px"
          >
            {t('budgetPlanner.description')}
          </Text>
        </Flex>
      </Box>

      {/* Inputs */}
      <Box
        bg="white"
        border="1px solid"
        borderColor="gray.100"
        rounded="xl"
        p={{ base: 4, md: 6 }}
        boxShadow="sm"
        mb={6}
      >
        <InputPanel
          input={input}
          onChange={handleChange}
          onPlan={handlePlan}
          isLoading={isLoading}
        />
      </Box>

      {/* Results */}
      {(isLoading || result) && (
        <Box ref={resultsRef} scrollMarginTop="20px">
          {isLoading ? <ResultsSkeleton /> : result && <ResultsPanel result={result} />}
        </Box>
      )}
    </Box>
  )
}

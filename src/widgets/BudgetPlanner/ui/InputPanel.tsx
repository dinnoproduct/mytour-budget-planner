'use client'

import {
  Box,
  Flex,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SimpleGrid,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Button, Text } from '@ui'
import {
  type BudgetInput,
  BUDGET_MIN,
  BUDGET_MAX,
  BUDGET_STEP,
  NIGHTS_OPTIONS,
  MONTH_OPTIONS,
  TRAVELLERS_OPTIONS,
  VIBE_OPTIONS,
} from '../model/types'

interface InputPanelProps {
  input: BudgetInput
  onChange: (update: Partial<BudgetInput>) => void
  onPlan: () => void
  isLoading?: boolean
}

const formatAMD = (value: number) =>
  new Intl.NumberFormat('en-US').format(value)

const VIBE_EMOJI: Record<string, string> = {
  beach: '\u{1F3D6}',
  family: '\u{1F46A}',
  party: '\u{1F389}',
  chill: '\u{1F9D8}',
}

const OptionButton = ({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) => (
  <Box
    as="button"
    onClick={onClick}
    px={3}
    py={1.5}
    rounded="full"
    border="1.5px solid"
    borderColor={selected ? 'blue.500' : 'gray.200'}
    bg={selected ? 'blue.500' : 'white'}
    color={selected ? 'white' : 'gray.600'}
    fontWeight={selected ? '600' : '400'}
    fontSize="sm"
    cursor="pointer"
    transition="all 0.15s"
    _hover={{
      borderColor: selected ? 'blue.600' : 'gray.300',
      bg: selected ? 'blue.600' : 'gray.50',
    }}
    whiteSpace="nowrap"
  >
    {children}
  </Box>
)

const InputGroup = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => (
  <Box>
    <Text
      size="xs"
      fontWeight="600"
      color="gray.500"
      mb={2}
      textTransform="uppercase"
      letterSpacing="wider"
    >
      {label}
    </Text>
    {children}
  </Box>
)

export const InputPanel = ({ input, onChange, onPlan, isLoading }: InputPanelProps) => {
  const { t } = useTranslation()

  return (
    <Box>
      {/* Budget slider */}
      <Box mb={6} pb={5} borderBottom="1px solid" borderColor="gray.100">
        <Flex justify="space-between" align="center" mb={3}>
          <Text size="xs" fontWeight="600" color="gray.500" textTransform="uppercase" letterSpacing="wider">
            {t('budgetPlanner.budget')}
          </Text>
          <Box
            bg="blue.50"
            px={3}
            py={1}
            rounded="full"
          >
            <Text size="md" fontWeight="bold" color="blue.600">
              {formatAMD(input.budget)} AMD
            </Text>
          </Box>
        </Flex>
        <Slider
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          step={BUDGET_STEP}
          value={input.budget}
          onChange={(val) => onChange({ budget: val })}
          colorScheme="blue"
        >
          <SliderTrack h="8px" rounded="full" bg="gray.100">
            <SliderFilledTrack rounded="full" />
          </SliderTrack>
          <SliderThumb
            boxSize={6}
            bg="blue.500"
            border="3px solid"
            borderColor="white"
            boxShadow="md"
          />
        </Slider>
        <Flex justify="space-between" mt={1.5}>
          <Text size="xs" color="gray.400">{formatAMD(BUDGET_MIN)}</Text>
          <Text size="xs" color="gray.400">{formatAMD(BUDGET_MAX)}</Text>
        </Flex>
      </Box>

      {/* Options grid + CTA */}
      <SimpleGrid columns={{ base: 2, smd: 5 }} gap={{ base: 4, md: 5 }} alignItems="end">
        <InputGroup label={t('budgetPlanner.nights')}>
          <Flex gap={2} flexWrap="wrap">
            {NIGHTS_OPTIONS.map((n) => (
              <OptionButton
                key={n}
                selected={input.nights === n}
                onClick={() => onChange({ nights: n })}
              >
                {n}
              </OptionButton>
            ))}
          </Flex>
        </InputGroup>

        <InputGroup label={t('budgetPlanner.month')}>
          <Flex gap={2} flexWrap="wrap">
            {MONTH_OPTIONS.map((m) => (
              <OptionButton
                key={m}
                selected={input.month === m}
                onClick={() => onChange({ month: m })}
              >
                {t(`budgetPlanner.months.${m}`)}
              </OptionButton>
            ))}
          </Flex>
        </InputGroup>

        <InputGroup label={t('budgetPlanner.travellers')}>
          <Flex gap={2} flexWrap="wrap">
            {TRAVELLERS_OPTIONS.map((n) => (
              <OptionButton
                key={n}
                selected={input.travellers === n}
                onClick={() => onChange({ travellers: n })}
              >
                {n}
              </OptionButton>
            ))}
          </Flex>
        </InputGroup>

        <InputGroup label={t('budgetPlanner.vibe')}>
          <Flex gap={2} flexWrap="wrap">
            {VIBE_OPTIONS.map((v) => (
              <OptionButton
                key={v}
                selected={input.vibe === v}
                onClick={() => onChange({ vibe: v })}
              >
                {VIBE_EMOJI[v]} {t(`budgetPlanner.vibes.${v}`)}
              </OptionButton>
            ))}
          </Flex>
        </InputGroup>

        <Button
          variant="solid-blue"
          size="lg"
          onClick={onPlan}
          isLoading={isLoading}
          w="full"
        >
          {t('budgetPlanner.planCta')}
        </Button>
      </SimpleGrid>
    </Box>
  )
}

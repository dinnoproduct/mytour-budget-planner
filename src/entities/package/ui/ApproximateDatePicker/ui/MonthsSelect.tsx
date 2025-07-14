import { HStack, Text, VStack } from '@chakra-ui/react'
import { Icon, RadioCard } from '@ui'
import { useTranslation } from 'react-i18next'

type Month = {
  name: string
  year: number
}

type MonthsSelectProps = {
  monthsToDisplay: Month[]
  activeValue: string
  onChange: (value: string) => void
  id?: string
}

export function MonthsSelect({
  monthsToDisplay,
  activeValue,
  id: scrollIntoViewId,
  onChange
}: Readonly<MonthsSelectProps>) {
  const { t } = useTranslation()

  return (
    <VStack
      px={3}
      pb="8"
      spacing={7}
      maxW="full"
      width="full"
    >
      <Text fontWeight="500">{t`whenAreYouPlanningToLeave`}</Text>

      {monthsToDisplay.length > 0 && (
        <HStack
          gap={2}
          overflowX="auto"
          maxW="full"
          position="relative"
          pb={{base: 0, md: 3}}
          sx={{
            '&::-webkit-scrollbar': {
              display: { base: 'none', md: 'block' },
              height: '6px'
            },
            '&::-webkit-scrollbar-track': {
              background: 'gray.200',
              borderRadius: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'gray.400',
              borderRadius: '6px'
            },
          }}
        >
          <RadioCard.Group
            name="months"
            defaultValue={activeValue}
            activeItem={activeValue}
            onChange={onChange}
          >
            {monthsToDisplay.map(month => {
              const id =
                activeValue === month.name ? scrollIntoViewId : undefined

              return (
                <RadioCard.Item
                  id={id}
                  key={month.name}
                  value={month.name}
                  variant="outline-card"
                  size="outline-card-md"
                  label={t(month.name)}
                  subLabel={String(month.year)}
                  icon={<Icon name="calendar-today" />}
                />
              )
            })}
          </RadioCard.Group>
        </HStack>
      )}
    </VStack>
  )
}

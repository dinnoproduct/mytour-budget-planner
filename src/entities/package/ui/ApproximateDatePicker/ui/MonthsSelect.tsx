import { Flex, Text } from '@chakra-ui/react'
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
    <>
      <Text fontWeight="500">{t`whenAreYouPlanningToLeave`}</Text>
      <Flex
        gap={2}
        width={{ base: '100vw', md: '395px' }}
        height="110px"
        overflowX="auto"
        position="relative"
        justifyContent={{ base: 'center', md: 'flex-start' }}
      >
        <RadioCard.Group
          name="months"
          defaultValue={activeValue}
          activeItem={activeValue}
          onChange={onChange}
          style={{ position: 'absolute', top: 0, padding: '0px 12px' }}
        >
          {monthsToDisplay.map(month => {
            const id = activeValue === month.name ? scrollIntoViewId : undefined

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
      </Flex>
    </>
  )
}

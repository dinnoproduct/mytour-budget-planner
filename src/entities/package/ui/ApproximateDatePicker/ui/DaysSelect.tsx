import { getPluralForm } from '@/shared/helpers'
import { RadioCard } from '@ui'
import { useTranslation } from 'react-i18next'

type DayOption = {
  label: string
  subLabel: string
  value: string
  localizationKey: string
}

type DaysSelectProps = {
  days: DayOption[]
  activeValue: string
  onChange: (value: string) => void
}

export const DaysSelect = ({
  days,
  activeValue,
  onChange
}: Readonly<DaysSelectProps>) => {
  const { t } = useTranslation()

  return (
    <RadioCard.Group
      name="days"
      defaultValue={activeValue}
      activeItem={activeValue}
      onChange={onChange}
    >
      {days.map(el => (
        <RadioCard.Item
          key={el.label + el.subLabel}
          value={el.value}
          label={t(el.localizationKey, {
            day: el.label
          })}
          subLabel={
            el.subLabel.length > 0
              ? `(${t(getPluralForm(Number(el.subLabel), 'nightsQuantity'), { night: el.subLabel })})`
              : el.subLabel
          }
        />
      ))}
    </RadioCard.Group>
  )
}

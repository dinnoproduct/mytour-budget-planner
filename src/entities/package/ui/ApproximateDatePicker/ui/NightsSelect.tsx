import { getPluralForm } from '@/shared/helpers'
import { RadioCard } from '@ui'
import { useTranslation } from 'react-i18next'

type NightOption = {
  label: string
  subLabel: string
  value: string
  localizationKey: string
}

type NightsSelectProps = {
  nights: NightOption[]
  activeValue: string
  onChange: (value: string) => void
}

export function NightsSelect({
  nights,
  activeValue,
  onChange
}: Readonly<NightsSelectProps>) {
  const { t } = useTranslation()

  return (
    <RadioCard.Group
      name="nights"
      defaultValue={activeValue}
      activeItem={activeValue}
      onChange={onChange}
    >
      {nights.map(el => (
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

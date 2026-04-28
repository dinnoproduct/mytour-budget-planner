import {
  VStack,
  Checkbox,
  CheckboxGroup,
  type CheckboxGroupProps
} from '@chakra-ui/react'

type FilterCheckboxListProps = {
  options: { key: string; label: string; value: number }[]
  value?: number[] | string[]
  onChange: (value: number[]) => void
}

export const FilterCheckboxList = ({
  options,
  value,
  onChange
}: FilterCheckboxListProps) => {
  const handleOnChange: CheckboxGroupProps['onChange'] = value => {
    onChange(value.map(Number))
  }

  return (
    <VStack align="start" spacing={3}>
      <CheckboxGroup onChange={handleOnChange} value={value?.map(String)}>
        {options.map(opt => (
          <Checkbox
            key={opt.key}
            value={opt.value.toString()}
            sx={{
              '.chakra-checkbox__label': {
                fontSize: '14px',
                color: 'gray.800'
              }
            }}
          >
            {opt.label}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </VStack>
  )
}

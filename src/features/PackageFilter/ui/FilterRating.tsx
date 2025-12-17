import { Icon } from '@/shared/ui'
import {
  VStack,
  Checkbox,
  Text,
  type SystemStyleObject,
  CheckboxGroup,
  type CheckboxGroupProps
} from '@chakra-ui/react'
import { type CSSProperties } from 'react'

const checkboxLabelStyle: CSSProperties = {
  fontSize: '14px',
  color: 'gray.800',
  display: 'flex',
  alignItems: 'center'
}

const checkboxLabelSx: SystemStyleObject = {
  '.chakra-checkbox__label': checkboxLabelStyle
}
type FilterRatingCheckboxProps = {
  options: { key: string; label: string; value: number }[]
  value?: number[] | string[]
  onChange: (value: number[]) => void
}

export const FilterRatingCheckbox = ({
  options,
  value,
  onChange
}: FilterRatingCheckboxProps) => {
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
            sx={checkboxLabelSx}
          >
            {[1, 2, 3, 4, 5].map(star => (
              <Icon
                key={opt.value + star}
                name={+opt.value >= star ? 'star' : 'star-outlined'}
                color={+opt.value >= star ? 'yellow.400' : 'gray.300'}
              />
            ))}

            <Text ml={2}>{opt.label}</Text>
          </Checkbox>
        ))}
      </CheckboxGroup>
    </VStack>
  )
}

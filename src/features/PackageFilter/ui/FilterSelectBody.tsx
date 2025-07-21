import { useState, useEffect, useRef } from 'react'
import {
  Checkbox,
  CheckboxGroup,
  type CheckboxGroupProps,
  VStack
} from '@chakra-ui/react'
import { Input } from '@/shared/ui'
import { useTranslation } from 'react-i18next'

export type FilterSelectBodyProps = {
  autoFocus?: boolean
  options: { key: string; label: string; value: string }[]
  selectedValues: string[]
  onChange: (value: Array<string | number>) => void
}

export const FilterSelectBody = ({
  autoFocus,
  options: optList,
  selectedValues,
  onChange
}: FilterSelectBodyProps) => {
  const [options, setOptions] = useState(optList)
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let timeoutId: number | undefined

    if (autoFocus) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 200) // Delay to ensure content is mounted
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [autoFocus])

  const onSearch: React.ChangeEventHandler<HTMLInputElement> = e => {
    const value = e.target.value.trim().toLowerCase()
    const result = optList.filter(opt =>
      opt.value.toLowerCase().includes(value)
    )

    setOptions(result)
  }

  const handleOnChange: CheckboxGroupProps['onChange'] = value => {
    onChange(value)
  }

  return (
    <>
      <Input
        placeholder={t`find`}
        ref={inputRef}
        leftIconName="search"
        onChange={onSearch}
      />

      <VStack
        align="start"
        sx={{
          maxHeight: '162px',
          '@media (min-height: 774px)': {
            maxHeight: '200px'
          },
          '@media (min-height: 872px)': {
            maxHeight: '300px'
          }
        }}
        overflowY="auto"
        spacing={3}
        mt={4}
      >
        <CheckboxGroup onChange={handleOnChange} value={selectedValues}>
          {options.map(opt => (
            <Checkbox
              key={opt.key}
              width="full"
              value={opt.value}
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
    </>
  )
}

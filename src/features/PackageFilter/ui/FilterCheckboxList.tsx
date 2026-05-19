import {
  Box,
  VStack,
  Checkbox,
  CheckboxGroup,
  type CheckboxGroupProps,
  Button
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  const handleOnChange: CheckboxGroupProps['onChange'] = value => {
    onChange(value.map(Number))
  }

  useEffect(() => {
    setContentHeight(contentRef.current?.scrollHeight || 0)
  }, [options, isExpanded])

  const visibleOptions = options
  const shouldShowToggleButton = options.length > 3

  return (
    <VStack align="start" spacing={3}>
      <Box
        width="full"
        overflow="hidden"
        maxHeight={
          shouldShowToggleButton
            ? isExpanded
              ? `${contentHeight}px`
              : `90px`
            : 'none'
        }
        transition="max-height .2s ease"
      >
        <VStack ref={contentRef} align="start" spacing={3}>
          <CheckboxGroup onChange={handleOnChange} value={value?.map(String)}>
            {visibleOptions.map(opt => (
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
      </Box>
      {shouldShowToggleButton && (
        <Button
          variant="ghost"
          size="sm"
          color="blue.500"
          px={0}
          height="auto"
          minHeight="auto"
          onClick={() => setIsExpanded(prev => !prev)}
        >
          {isExpanded ? t`close` : t`more`}
        </Button>
      )}
    </VStack>
  )
}

import { useEffect, useState } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { Input } from '@/shared/ui'
import numeral from 'numeral'

type FilterRangeProps = {
  minValue: number
  maxValue: number
  minValuePlaceholder: string
  maxValuePlaceholder: string
  onChange: (range: { minValue: number; maxValue: number }) => void
}

export const FilterRange = ({
  minValue,
  maxValue,
  minValuePlaceholder,
  maxValuePlaceholder,
  onChange
}: FilterRangeProps) => {
  const [range, setRange] = useState({
    minValue: '',
    maxValue: ''
  })
  useEffect(() => {
    setRange({
      minValue: minValue !== 0 ? minValue.toString() : '',
      maxValue: maxValue !== 0 ? maxValue.toString() : ''
    })
  }, [minValue, maxValue])

  const onHandelChangeMinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = numeral(e.target.value).value()?.toString() ?? ''

    setRange(prev => ({
      ...prev,
      minValue: value
    }))
  }

  const onHandelChangeMaxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = numeral(e.target.value).value()?.toString() ?? ''

    setRange(prev => ({
      ...prev,
      maxValue: value
    }))
  }

  const onBlurMinValueInput = () => {
    onChange({ minValue: +range.minValue, maxValue: +range.maxValue })
  }

  const formatForDisplay = (value: string) => {
    const numValue = numeral(value).value()

    if (numValue === null) {
      return ''
    }

    return numeral(numValue).format('0,0')
  }

  return (
    <Flex gap={2} align="center">
      <Input
        placeholder={formatForDisplay(minValuePlaceholder)}
        value={formatForDisplay(range.minValue)}
        onChange={onHandelChangeMinInput}
        onBlur={onBlurMinValueInput}
      />
      <Text>-</Text>
      <Input
        placeholder={formatForDisplay(maxValuePlaceholder)}
        value={formatForDisplay(range.maxValue)}
        onChange={onHandelChangeMaxInput}
        onBlur={onBlurMinValueInput}
      />
    </Flex>
  )
}

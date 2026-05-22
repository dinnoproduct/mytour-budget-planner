import { VStack, Text } from '@chakra-ui/react'
import { FilterRange } from './FilterRange'
import { FilterSelect } from './FilterSelect'
import { FilterRatingCheckbox } from './FilterRating'
import { FilterCheckboxList } from './FilterCheckboxList'
import { FILTER_ITEM_TYPE } from '../model'

type BaseProps = {
  label: string
}

type SelectFilterProps = BaseProps & {
  type: 'select'
  value: string[]
  options: { key: string; value: string; label: string }[]
  onChange: (value: string[]) => void
}

type RatingCheckboxFilterProps = BaseProps & {
  type: 'ratingCheckboxList'
  value: number[]
  options: { key: string; value: number; label: string }[]
  onChange: (value: number[]) => void
}

type CheckboxFilterProps = BaseProps & {
  type: 'checkboxList'
  value: number[]
  options: { key: string; value: number; label: string }[]
  onChange: (value: number[]) => void
}

type RangeFilterProps = BaseProps & {
  type: 'range'
  minValue: number
  maxValue: number
  minValuePlaceholder: string
  maxValuePlaceholder: string
  onChange: (range: { minValue: number; maxValue: number }) => void
}

type FilterItemProps =
  | SelectFilterProps
  | CheckboxFilterProps
  | RatingCheckboxFilterProps
  | RangeFilterProps

export const FilterItem = (props: FilterItemProps) => {
  const { type, label, onChange } = props

  let component: React.ReactNode

  switch (type) {
    case FILTER_ITEM_TYPE.SELECT:
      component = (
        <FilterSelect
          value={props.value}
          options={props.options}
          onChange={onChange}
        />
      )
      break
    case FILTER_ITEM_TYPE.RATING_CHECKBOX_LIST:
      component = (
        <FilterRatingCheckbox
          value={props.value}
          options={props.options}
          onChange={onChange}
        />
      )
      break
    case FILTER_ITEM_TYPE.CHECKBOX_LIST:
      component = (
        <FilterCheckboxList
          value={props.value}
          options={props.options}
          onChange={onChange}
        />
      )
      break
    case FILTER_ITEM_TYPE.RANGE:
      component = (
        <FilterRange
          minValuePlaceholder={props.minValuePlaceholder}
          maxValuePlaceholder={props.maxValuePlaceholder}
          minValue={props.minValue}
          maxValue={props.maxValue}
          onChange={onChange}
        />
      )
      break
    default:
      component = null
  }

  return (
    <VStack align="flex-start" width="full" spacing={3}>
      <Text fontWeight="bold" fontSize="14px">
        {label}
      </Text>
      {component}
    </VStack>
  )
}

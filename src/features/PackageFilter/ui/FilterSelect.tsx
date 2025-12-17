import { Button, Input } from '@/shared/ui'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
  PopoverBody,
  Portal,
  PopoverFooter,
  Show,
  Hide
} from '@chakra-ui/react'
import { forwardRef, type Ref, useEffect, useRef, useState } from 'react'
import { FilterSelectBody } from './FilterSelectBody'
import { useTranslation } from 'react-i18next'

type FilterSelectProps = {
  options: { key: string; label: string; value: string }[]
  onChange: (value: string[]) => void
  value?: string[]
}

export const FilterSelect = ({
  value = [],
  options,
  onChange
}: FilterSelectProps) => {
  const popoverRef = useRef(null)
  const [selectedValues, setSelectedValues] = useState<string[]>(value)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { t } = useTranslation()

  useEffect(() => {
    setSelectedValues(value)
  }, [value])

  const handleOnButtonClick = (value: string[]) => {
    setSelectedValues(value)
    onChange(value)
    onClose()
  }

  return (
    <Popover
      placement="bottom-end"
      isOpen={isOpen}
      onClose={onClose}
      matchWidth
      isLazy
    >
      <PopoverTrigger>
        <Input
          onClick={onOpen}
          rightIconProps={{
            pointerEvents: 'none'
          }}
          isReadOnly
          value={
            selectedValues.length !== 0
              ? `${selectedValues.length} ${t('isSelected')}`
              : ''
          }
          placeholder={t`selectHotel`}
          rightIconName={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          cursor="pointer"
        />
      </PopoverTrigger>
      <PopoverContentLayout
        ref={popoverRef}
        handleOnButtonClick={handleOnButtonClick}
        isOpen={isOpen}
        options={options}
        selectedValues={selectedValues}
      />
    </Popover>
  )
}

type PopoverContentLayoutProps = {
  isOpen: boolean
  options: FilterSelectProps['options']
  selectedValues: string[]
  handleOnButtonClick: (value: string[]) => void
}
const PopoverContentLayout = forwardRef(
  (props: PopoverContentLayoutProps, ref: Ref<HTMLDivElement>) => {
    const { t } = useTranslation()
    const { isOpen, options, selectedValues, handleOnButtonClick } = props

    const [value, setValue] = useState<string[]>(selectedValues)

    useEffect(() => {
      if (isOpen) {
        setValue(selectedValues)
      }

      if (!isOpen) {
        setValue([])
      }
    }, [isOpen, selectedValues])

    const onChange: (
      valueParam: Array<string | number>
    ) => void = valueParam => {
      setValue(valueParam.map(String))
    }

    const handleOnClick = () => {
      handleOnButtonClick(value)
    }

    const popoverContent = (
      <PopoverContent
        maxWidth={{ base: 'full', md: '408px' }}
        width={{ base: 'full', md: '408px' }}
        ref={ref}
      >
        <PopoverBody px={4} pt={4} pb={3}>
          <FilterSelectBody
            onChange={onChange}
            autoFocus={isOpen}
            options={options}
            selectedValues={value}
          />
        </PopoverBody>
        <PopoverFooter p={4}>
          <Button width="full" onClick={handleOnClick}>
            {t`confirm`}
          </Button>
        </PopoverFooter>
      </PopoverContent>
    )

    return (
      <>
        <Hide above="md">{popoverContent}</Hide>
        <Show above="md">
          <Portal>{popoverContent}</Portal>
        </Show>
      </>
    )
  }
)

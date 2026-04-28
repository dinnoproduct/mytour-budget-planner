import { useEffect, useMemo, useState } from 'react'
import {
  Divider,
  Flex,
  Text,
  VStack,
  Box,
  Show,
  Hide,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Layout } from './Layout'
import { Button, Icon } from '@/shared/ui'
import { FilterItem } from './FilterItem'
import { getPluralForm } from '@/shared/helpers'
import { HotelInquiryModal, HotelInquiryModalTrigger } from './HotelInquiryModal'
import { usePackageFilterUrlState } from './usePackageFilterUrlState'
import {
  type FilterParams,
  type FilterOptions,
  FILTER_PARAMS_DEFAULT_VALUE
} from '../model'

export type PackageFilterProps = {
  filterOptions: FilterOptions
  isActive: boolean
  contentType?: 'hotel' | 'package'
  onFilter: (filterParams: FilterParams) => void
}

type CommonFilterItemsProps = {
  filterOptions: FilterOptions
  selectedFilters: FilterParams
  isRemoveDivider?: boolean
  handleChange: (key: keyof FilterParams, value: any) => void
}

const CommonFilterItems: React.FC<CommonFilterItemsProps> = ({
  filterOptions,
  selectedFilters,
  isRemoveDivider = false,
  handleChange
}) => {
  const { t } = useTranslation()

  const selectHotelOptions = filterOptions.name.map((name, index) => ({
    key: String(index),
    label: name,
    value: name
  }))

  const ratingOptions = filterOptions.stars.map((star, index) => ({
    key: String(index),
    label: `${star} ${t(getPluralForm(star, 'star'))}`,
    value: star
  }))

  const rangeOptions = filterOptions.price
  const divider = isRemoveDivider ? undefined : <Divider />
  const cityFilterItems = useMemo(
    () =>
      filterOptions.cityFilters.map(filter => ({
        id: filter.id,
        label: filter.title,
        options: filter.values.map(value => ({
          key: `${filter.id}-${value.id}`,
          label: value.label,
          value: String(value.id)
        }))
      })),
    [filterOptions.cityFilters]
  )

  return (
    <VStack divider={divider} spacing={6}>
      <FilterItem
        type="select"
        label={t`filterByHotel`}
        options={selectHotelOptions}
        value={selectedFilters.packageSelectHotel}
        onChange={value => handleChange('packageSelectHotel', value)}
      />
      <FilterItem
        type="range"
        label={t`filterByPrice`}
        minValuePlaceholder={String(rangeOptions.minValue)}
        minValue={selectedFilters.priceRange.minValue}
        maxValuePlaceholder={String(rangeOptions.maxValue)}
        maxValue={selectedFilters.priceRange.maxValue}
        onChange={value => handleChange('priceRange', value)}
      />

      {/* <FilterItem
        type="checkboxList"
        label="Ներառում է"
        options={foodTypeOptions}
        onChange={() => {}}
      /> */}
      <FilterItem
        type="ratingCheckboxList"
        label={t`filterByRating`}
        options={ratingOptions}
        value={selectedFilters.hotelRatingSelect}
        onChange={value => handleChange('hotelRatingSelect', value)}
      />
      {cityFilterItems.map(filter => (
        <FilterItem
          key={filter.id}
          type="select"
          label={filter.label}
          options={filter.options}
          value={(
            selectedFilters.cityFilterValues[String(filter.id)] || []
          ).map(String)}
          onChange={value =>
            handleChange('cityFilterValues', {
              ...selectedFilters.cityFilterValues,
              [String(filter.id)]: value.map(Number)
            })
          }
        />
      ))}
      {/* <FilterItem
        type="checkboxList"
        label="Տեղադիրքը"
        options={opt3}
        onChange={() => {}}
      /> */}
    </VStack>
  )
}

type PackageFilterDesktopProps = Omit<
  CommonFilterItemsProps,
  'isRemoveDivider'
> & {
  onFilter: (filterParams: FilterParams) => void
  onReset: () => void
  onOpenHotelInquiryModal: () => void
}

export const PackageFilterDesktop: React.FC<PackageFilterDesktopProps> = ({
  filterOptions,
  selectedFilters,
  handleChange,
  onReset,
  onFilter,
  onOpenHotelInquiryModal,
}) => {
  const { t } = useTranslation()

  useEffect(() => {
    onFilter(selectedFilters)
  }, [selectedFilters, onFilter])

  return (
    <Layout>

      <Flex justify="space-between" align="center" mb={8}>
        <Text fontWeight="bold" fontSize={20}>
          {t`filters`}
        </Text>
        <Button variant="text-blue" size="sm" onClick={onReset}>
          {t`clear`}
        </Button>
      </Flex>
      <CommonFilterItems
        filterOptions={filterOptions}
        selectedFilters={selectedFilters}
        handleChange={handleChange}
      />
      <Flex direction="column" align="center" mt={8}>
        <HotelInquiryModalTrigger onClick={onOpenHotelInquiryModal} />
      </Flex>
    </Layout>
  )
}

type PackageFilterMobileProps = Omit<
  CommonFilterItemsProps,
  'isRemoveDivider' | 'handleChange'
> & {
  isActive: boolean
  onCloseMenu: () => void
  onConfirm: (filterParams: FilterParams) => void
  onFilter: (filterParams: FilterParams) => void
}

export const PackageFilterMobile: React.FC<PackageFilterMobileProps> = ({
  isActive,
  ...rest
}) => (
  <Layout isActive={isActive}>
    <PackageFilterMobileContent {...rest} />
  </Layout>
)

type PackageFilterMobileContentProps = Omit<
  PackageFilterMobileProps,
  'isActive'
>

const PackageFilterMobileContent = ({
  filterOptions,
  onFilter,
  onConfirm,
  selectedFilters,
  onCloseMenu
}: PackageFilterMobileContentProps) => {
  const [filterParams, setFilterParams] =
    useState<FilterParams>(selectedFilters)
  const { t } = useTranslation()

  const handleChange = (key: keyof typeof filterParams, value: any) => {
    setFilterParams(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const onReset = () => {
    setFilterParams(FILTER_PARAMS_DEFAULT_VALUE)
  }

  const handleOnConfirm = () => {
    onConfirm(filterParams)
    onFilter(filterParams)
    onCloseMenu?.()
  }

  const handleCloseMenu = () => {
    setFilterParams(selectedFilters)
    onCloseMenu?.()
  }

  return (
    <>
      <Flex
        display={{ base: 'flex', md: 'none' }}
        justify="space-between"
        px="4"
        height="64px"
        align="center"
        width="full"
        maxW="100dvw"
      >
        <Button
          icon="close"
          aria-label="Close calendar"
          variant="solid-gray"
          size="sm"
          onClick={handleCloseMenu}
        />
        <Text size="md" fontWeight="semibold">
          {t`filtering`}
        </Text>

        <Button variant="text-blue" onClick={onReset}>
          {t`cancel`}
        </Button>
      </Flex>
      <Box
        p={4}
        style={{ height: 'calc(100% - 64px - 56px)' }}
        overflowY="scroll"
        maxW="100dvw"
      >
        <CommonFilterItems
          filterOptions={filterOptions}
          selectedFilters={filterParams}
          isRemoveDivider
          handleChange={handleChange}
        />
        <Box
          position="fixed"
          bottom={0}
          left={0}
          borderTop="1px gray.100"
          borderWidth="1px"
          width="full"
          p={4}
          maxW="100dvw"
        >
          <Button width="full" onClick={handleOnConfirm}>
            {t`filtering`}
          </Button>
        </Box>
      </Box>
    </>
  )
}

export const PackageFilter = ({
  filterOptions,
  isActive,
  contentType = 'hotel',
  onFilter
}: PackageFilterProps) => {
  const [filterParams, setFilterParams] = useState<FilterParams>(
    FILTER_PARAMS_DEFAULT_VALUE
  )

  usePackageFilterUrlState({ filterParams, setFilterParams })

  const [isHotelInquiryModalOpen, setIsHotelInquiryModalOpen] = useState(false)

  const handleChange = (key: keyof typeof filterParams, value: any) => {
    setFilterParams(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const onReset = () => {
    setFilterParams(FILTER_PARAMS_DEFAULT_VALUE)
  }

  const onConfirm = (params: FilterParams) => {
    setFilterParams(params)
  }

  const handleOpenHotelInquiryModal = () => {
    setIsHotelInquiryModalOpen(true)
  }

  const handleCloseHotelInquiryModal = () => {
    setIsHotelInquiryModalOpen(false)
  }

  useEffect(() => {
    setFilterParams(prev => {
      // Keep URL-hydrated selections until dynamic city filters are loaded.
      if (filterOptions.cityFilters.length === 0) {
        return prev
      }

      const allowedFilterIds = new Set(
        filterOptions.cityFilters.map(filter => String(filter.id))
      )
      const nextCityFilterValues: Record<string, number[]> = {}

      filterOptions.cityFilters.forEach(filter => {
        const selectedValues = prev.cityFilterValues[String(filter.id)] || []
        const allowedValues = new Set(filter.values.map(value => value.id))
        nextCityFilterValues[String(filter.id)] = selectedValues.filter(value =>
          allowedValues.has(value)
        )
      })

      const hasAnyChange =
        Object.keys(prev.cityFilterValues).some(key => !allowedFilterIds.has(key)) ||
        filterOptions.cityFilters.some(filter => {
          const key = String(filter.id)
          const prevValues = prev.cityFilterValues[key] || []
          const nextValues = nextCityFilterValues[key] || []

          if (prevValues.length !== nextValues.length) {
            return true
          }

          return prevValues.some(value => !nextValues.includes(value))
        })

      if (!hasAnyChange) {
        return prev
      }

      return {
        ...prev,
        cityFilterValues: nextCityFilterValues
      }
    })
  }, [filterOptions.cityFilters])

  return (
    <>
      <Show above="md">
        <PackageFilterDesktop
          filterOptions={filterOptions}
          handleChange={handleChange}
          onFilter={onFilter}
          onReset={onReset}
          selectedFilters={filterParams}
          onOpenHotelInquiryModal={handleOpenHotelInquiryModal}
        />
      </Show>
      <Hide above="md">
        <Flex direction="column" align="center" mb={8}>
          <HotelInquiryModalTrigger onClick={handleOpenHotelInquiryModal} />
        </Flex>
        <PackageFilterMobile
          filterOptions={filterOptions}
          isActive={isActive}
          onFilter={onFilter}
          onConfirm={onConfirm}
          onCloseMenu={() => { }}
          selectedFilters={filterParams}
        />
      </Hide >
      <HotelInquiryModal
        isOpen={isHotelInquiryModalOpen}
        onClose={handleCloseHotelInquiryModal}
        contentType={contentType}
      />
    </>
  )
}

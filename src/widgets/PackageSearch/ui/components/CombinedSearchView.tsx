import React, { useEffect } from 'react'
import { Box } from '@chakra-ui/react'
import { Layout } from '../Layouts'
import { CyprusSearchForm } from '../CyprusSearchForm'
import { HotelSearchForm } from '../HotelSearchForm'
import { PackageSearchForm } from '../PackageSearchForm'
import {
  useCyprusPackagesSearchContext,
  useHotelPackagesSearchContext,
  usePackagesSearchContext,
} from '@entities/package'
import { type PackageSearchVariant } from '../types'
import { GroupTourSearchForm } from '../GroupTourSearchForm'
import { packageSearchVariants } from '../theme'

interface CombinedSearchViewProps {
  containerProps?: any
  contentProps?: any
  variant?: PackageSearchVariant
  showTabs?: boolean
  setHotel?: (index: number) => void
  initialTab?: number
}

export const CombinedSearchView: React.FC<CombinedSearchViewProps> = ({
  containerProps,
  contentProps,
  variant = 'centered',
  showTabs = true,
  setHotel,
  initialTab,
}) => {
  const {
    isAllowedSearchRoute: isCyprusSearchView,
    navigateToDefaultSearch: navigateToDefaultCyprusSearch,
  } = useCyprusPackagesSearchContext()
  const {
    isAllowedSearchRoute: isHotelSearchView,
    navigateToDefaultSearch: navigateToDefaultHotelSearch,
  } = useHotelPackagesSearchContext()
  const {
    isAllowedSearchRoute: isPackageSearchView,
    navigateToDefaultSearch: navigateToDefaultPackageSearch,
  } = usePackagesSearchContext()

  const baseIndex = isCyprusSearchView
    ? 0
    : isHotelSearchView
      ? 1
      : isPackageSearchView
        ? 2
        : 0
  const defaultTabIndex = initialTab ?? baseIndex

  const handleTabChange = (index: number) => {
    setHotel?.(index)
    if (index === 0 && (isHotelSearchView || isPackageSearchView)) {
      navigateToDefaultCyprusSearch()
    } else if (index === 1 && (isCyprusSearchView || isPackageSearchView)) {
      navigateToDefaultHotelSearch()
    } else if (index === 2 && (isCyprusSearchView || isHotelSearchView)) {
      navigateToDefaultPackageSearch()
    }
  }

  useEffect(() => {
    handleTabChange(defaultTabIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fixedWithoutTabsGradientProps =
    variant === 'fixedWithoutTabs'
      ? isHotelSearchView
        ? packageSearchVariants.fixedWithoutTabs.hotelContainer
        : packageSearchVariants.fixedWithoutTabs.packagesContainer
      : {}

  return (
    <Box position="relative">
      <Layout
        className={showTabs ? 'showTabs' : ''}
        containerProps={{
          ...containerProps,
          ...fixedWithoutTabsGradientProps
        }}
        contentProps={contentProps}
        variant={variant}
        defaultTabIndex={defaultTabIndex}
        onTabChange={handleTabChange}
        showTabs={showTabs}
      >
        <CyprusSearchForm />
        <HotelSearchForm />
        <PackageSearchForm />
        <GroupTourSearchForm />
      </Layout>
      {showTabs ? (
        <Box
          position="absolute"
          bottom="0"
          height="40px"
          bgColor="white"
          width="full"
          borderRadius="40px 40px 0 0"
        />
      ) : null}
    </Box>
  )
}


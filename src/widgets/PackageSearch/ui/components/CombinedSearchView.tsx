import React from 'react'
import { Box } from '@chakra-ui/react'
import { Layout } from '../Layouts'
import { HotelSearchForm } from '../HotelSearchForm'
import { PackageSearchForm } from '../PackageSearchForm'
import {
  useHotelPackagesSearchContext,
  usePackagesSearchContext
} from '@entities/package'
import { type PackageSearchVariant } from '../types'

interface CombinedSearchViewProps {
  containerProps?: any
  contentProps?: any
  variant?: PackageSearchVariant
  showTabs?: boolean
  setHotel?: (index: number) => void
}

export const CombinedSearchView: React.FC<CombinedSearchViewProps> = ({
  containerProps,
  contentProps,
  variant = 'centered',
  showTabs = true,
  setHotel
}) => {
  const {
    isAllowedSearchRoute: isHotelSearchView,
    navigateToDefaultSearch: navigateToDefaultHotelSearch
  } = useHotelPackagesSearchContext()
  const {
    isAllowedSearchRoute: isPackageSearchView,
    navigateToDefaultSearch: navigateToDefaultPackageSearch
  } = usePackagesSearchContext()

  const handleTabChange = (index: number) => {
    setHotel?.(index)
    if (index === 1 && isHotelSearchView) {
      navigateToDefaultHotelSearch()
    } else if (index === 0 && isPackageSearchView) {
      navigateToDefaultPackageSearch()
    }
  }

  return (
    <Box position="relative">
      <Layout
        className={showTabs ? 'showTabs' : ''}
        containerProps={containerProps}
        contentProps={contentProps}
        variant={variant}
        defaultTabIndex={isPackageSearchView ? 1 : 0}
        onTabChange={handleTabChange}
        showTabs={showTabs}
      >
        <HotelSearchForm />
        <PackageSearchForm />
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


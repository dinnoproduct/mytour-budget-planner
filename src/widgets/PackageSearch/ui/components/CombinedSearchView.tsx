import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { Layout } from '../Layouts'
import { HotelSearchForm } from '../HotelSearchForm'
import { PackageSearchForm } from '../PackageSearchForm'
import {
  useHotelPackagesSearchContext,
  usePackagesSearchContext,
} from '@entities/package'
import { type PackageSearchVariant } from '../types'

const MAIN_TAB_STORAGE_KEY = 'mainSearchTabIndex'

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

  const baseIndex = isPackageSearchView ? 1 : 0
  const [defaultTabIndex] = useState(() => {
    if (typeof window === 'undefined') return baseIndex
    const saved = window.sessionStorage.getItem(MAIN_TAB_STORAGE_KEY)
    const parsed = saved !== null ? Number(saved) : NaN
    return !Number.isNaN(parsed) ? parsed : baseIndex
  })

  const handleTabChange = (index: number) => {
    setHotel?.(index)
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(MAIN_TAB_STORAGE_KEY, String(index))
    }
    if (index === 1 && isHotelSearchView) {
      navigateToDefaultHotelSearch()
    } else if (index === 0 && isPackageSearchView) {
      navigateToDefaultPackageSearch()
    } 
  }

  // Apply saved tab side‑effects (navigation, setHotel) on mount so
  // UI behaves the same as if user had clicked that tab.
  useEffect(() => {
    handleTabChange(defaultTabIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box position="relative">
      <Layout
        className={showTabs ? 'showTabs' : ''}
        containerProps={containerProps}
        contentProps={contentProps}
        variant={variant}
        defaultTabIndex={defaultTabIndex}
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


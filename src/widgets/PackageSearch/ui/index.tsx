import React, { useEffect, useState } from 'react'
import { PackageSearchForm } from './PackageSearchForm.tsx'
import { type PackageSearchProps } from './types.ts'
import { useBreakpoint } from '@shared/hooks'
import { HotelSearchForm } from '@widgets/PackageSearch/ui/HotelSearchForm.tsx'
import { HotelSearchMenu } from '@widgets/PackageSearch/ui/HotelSearchMenu.tsx'
import { LayoutFixed, Layout } from './Layouts.tsx'
import { PackageSearchMenu } from '@widgets/PackageSearch/ui/PackageSearchMenu.tsx'
import {
  useHotelPackagesSearchContext,
  usePackagesSearchContext
} from '@entities/package'
import {Box} from "@chakra-ui/react";

export const PackageSearch = ({
  containerProps,
  contentProps,
  variant = 'centered',
  showTabs = true,
  setHotel = () => {}
}: PackageSearchProps) => {
  const { isMd } = useBreakpoint()

  if (['fixed', 'fixedWithoutTabs'].includes(variant) && !isMd) {
    return (
      <FixedSearchView
        containerProps={containerProps}
        contentProps={contentProps}
        variant={variant}
        showTabs={showTabs}
        setHotel={setHotel}
      />
    )
  }

  return (
    <Box position='relative'>
      <FormSearchView
        containerProps={containerProps}
        contentProps={contentProps}
        variant={variant}
        showTabs={showTabs}
        setHotel={setHotel}
      />
      {showTabs ? <Box position='absolute' mt='-40px' height='40px' bgColor='white' width='full' zIndex='1' borderRadius='40px 40px 0 0 '></Box>: null}
    </Box>
  )
}

const FormSearchView = ({
  containerProps,
  contentProps,
  variant = 'centered',
  showTabs = true,
  setHotel = () => {}
}: any) => {
  const {
    isAllowedSearchRoute: isHotelSearchView,
    navigateToDefaultSearch: navigateToDefaultHotelSearch
  } = useHotelPackagesSearchContext()
  const {
    isAllowedSearchRoute: isPackageSearchView,
    navigateToDefaultSearch: navigateToDefaultPackageSearch
  } = usePackagesSearchContext()

  const handleTabChange = (index: number) => {
    setHotel(index)
    if (index === 1 && isHotelSearchView) {
      navigateToDefaultHotelSearch()
    } else if (index === 0 && isPackageSearchView) {
      navigateToDefaultPackageSearch()
    }
  }

  return (
    <Layout
      containerProps={containerProps}
      contentProps={contentProps}
      variant={variant}
      defaultTabIndex={isHotelSearchView ? 1 : 0}
      onTabChange={handleTabChange}
      showTabs={showTabs}
    >
      <HotelSearchForm />
      <PackageSearchForm />
    </Layout>
  )
}

const FixedSearchView = ({
  containerProps,
  contentProps,
  variant = 'centered',
  showTabs = true,
  setHotel = () => {}
}: any) => {
  const [activeTab, setActiveTab] = useState(0)
  const [isFormOpen, setFormOpen] = useState(false)
  const { isAllowedSearchRoute: isHotelSearchView } =
    useHotelPackagesSearchContext()
  const { isAllowedSearchRoute: isPackageSearchView } =
    usePackagesSearchContext()

  useEffect(() => {
    const activeTabIndex = isHotelSearchView ? 1 : 0
    setActiveTab(activeTabIndex)
    setHotel(activeTabIndex)
  }, [isHotelSearchView, isPackageSearchView])

  const handleTabChange = (index: number) => {
    setActiveTab(index)
    setHotel(index)
  }

  return (
    <LayoutFixed
      containerProps={containerProps}
      contentProps={contentProps}
      variant={variant}
    >
      {activeTab === 0 && (
        <PackageSearchMenu
          onTabChange={handleTabChange}
          onFormOpen={() => setFormOpen(true)}
          onFormClose={() => setFormOpen(false)}
          isFormOpen={isFormOpen}
          showTabs={showTabs}
        />
      )}
      {activeTab === 1 && (
        <HotelSearchMenu
          onTabChange={handleTabChange}
          onFormOpen={() => setFormOpen(true)}
          onFormClose={() => setFormOpen(false)}
          isFormOpen={isFormOpen}
          showTabs={showTabs}
        />
      )}
    </LayoutFixed>
  )
}

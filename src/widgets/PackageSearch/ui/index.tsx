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

export const PackageSearch = ({
  containerProps,
  contentProps,
  variant = 'centered'
}: PackageSearchProps) => {
  const { isMd } = useBreakpoint()

  if (variant === 'fixed' && !isMd) {
    return (
      <FixedSearchView
        containerProps={containerProps}
        contentProps={contentProps}
        variant={variant}
      />
    )
  }

  return (
    <FormSearchView
      containerProps={containerProps}
      contentProps={contentProps}
      variant={variant}
    />
  )
}

const FormSearchView = ({
  containerProps,
  contentProps,
  variant = 'centered'
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
    >
      <PackageSearchForm />
      <HotelSearchForm />
    </Layout>
  )
}

const FixedSearchView = ({
  containerProps,
  contentProps,
  variant = 'centered'
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
  }, [isHotelSearchView, isPackageSearchView])

  const handleTabChange = (index: number) => {
    setActiveTab(index)
  }

  console.log('search data : ', {
    activeTab,
    isFormOpen
  })

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
        />
      )}
      {activeTab === 1 && (
        <HotelSearchMenu
          onTabChange={handleTabChange}
          onFormOpen={() => setFormOpen(true)}
          onFormClose={() => setFormOpen(false)}
          isFormOpen={isFormOpen}
        />
      )}
    </LayoutFixed>
  )
}

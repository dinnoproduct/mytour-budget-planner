import React, { useEffect, useState } from 'react'
import { LayoutFixed } from '../Layouts'
import { PackageSearchMenu } from '../PackageSearchMenu'
import { HotelSearchMenu } from '../HotelSearchMenu'
import {
  useHotelPackagesSearchContext,
  usePackagesSearchContext
} from '@entities/package'
import { type PackageSearchVariant } from '../types'

interface FixedSearchViewProps {
  containerProps?: any
  contentProps?: any
  variant?: PackageSearchVariant
  showTabs?: boolean
  setHotel?: (index: number) => void
}

export const FixedSearchView: React.FC<FixedSearchViewProps> = ({
  containerProps,
  contentProps,
  variant = 'centered',
  showTabs = true,
  setHotel
}) => {
  const [activeTab, setActiveTab] = useState(0)
  const [isFormOpen, setFormOpen] = useState(false)
  const { isAllowedSearchRoute: isHotelSearchView } =
    useHotelPackagesSearchContext()
  const { isAllowedSearchRoute: isPackageSearchView } =
    usePackagesSearchContext()

  useEffect(() => {
    const activeTabIndex = isHotelSearchView ? 1 : 0
    setActiveTab(activeTabIndex)
    setHotel?.(activeTabIndex)
  }, [isHotelSearchView, isPackageSearchView, setHotel])

  const handleTabChange = (index: number) => {
    setActiveTab(index)
    setHotel?.(index)
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


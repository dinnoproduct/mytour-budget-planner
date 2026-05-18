import React, { useEffect, useState } from 'react'
import { LayoutFixed } from '../Layouts'
import { PackageSearchMenu } from '../PackageSearchMenu'
import { HotelSearchMenu } from '../HotelSearchMenu'
import { GroupSearchMenu } from '../GroupSearchMenu'
import {
  useHotelPackagesSearchContext,
  usePackagesSearchContext
} from '@entities/package'
import { type PackageSearchVariant } from '../types'
import { packageSearchVariants } from '../theme'

interface FixedSearchViewProps {
  containerProps?: any
  contentProps?: any
  variant?: PackageSearchVariant
  showTabs?: boolean
  setHotel?: (index: number) => void
  initialTab?: number
}

export const FixedSearchView: React.FC<FixedSearchViewProps> = ({
  containerProps,
  contentProps,
  variant = 'centered',
  showTabs = true,
  setHotel,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab ?? 0)
  const [isFormOpen, setFormOpen] = useState(false)
  const { isAllowedSearchRoute: isHotelSearchView } =
    useHotelPackagesSearchContext()
  const { isAllowedSearchRoute: isPackageSearchView } =
    usePackagesSearchContext()

  useEffect(() => {
    const baseIndex = initialTab ?? (isHotelSearchView ? 1 : 0)
    setActiveTab(baseIndex)
    setHotel?.(baseIndex)
  }, [isHotelSearchView, isPackageSearchView, setHotel, initialTab])

  const handleTabChange = (index: number) => {
    setActiveTab(index)
    setHotel?.(index)
  }

  const fixedWithoutTabsGradientProps =
    variant === 'fixedWithoutTabs'
      ? activeTab === 1
        ? packageSearchVariants.fixedWithoutTabs.hotelContainer
        : activeTab === 2
          ? packageSearchVariants.fixedWithoutTabs.groupToursContainer
          : packageSearchVariants.fixedWithoutTabs.packagesContainer
      : {}

  return (
    <LayoutFixed
      containerProps={{
        ...containerProps,
        ...fixedWithoutTabsGradientProps
      }}
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
      {activeTab === 2 && (
        <GroupSearchMenu
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


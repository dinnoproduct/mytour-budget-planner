import React, { useEffect, useState } from 'react'
import { LayoutFixed } from '../Layouts'
import { CyprusSearchMenu } from '../CyprusSearchMenu'
import { PackageSearchMenu } from '../PackageSearchMenu'
import { HotelSearchMenu } from '../HotelSearchMenu'
import { GroupSearchMenu } from '../GroupSearchMenu'
import {
  useCyprusPackagesSearchContext,
  useHotelPackagesSearchContext,
  usePackagesSearchContext,
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
  const { isAllowedSearchRoute: isCyprusSearchView } =
    useCyprusPackagesSearchContext()
  const { isAllowedSearchRoute: isHotelSearchView } =
    useHotelPackagesSearchContext()
  const { isAllowedSearchRoute: isPackageSearchView } =
    usePackagesSearchContext()

  useEffect(() => {
    const baseIndex =
      initialTab ??
      (isCyprusSearchView ? 0 : isHotelSearchView ? 1 : isPackageSearchView ? 2 : 0)
    setActiveTab(baseIndex)
    setHotel?.(baseIndex)
  }, [
    isCyprusSearchView,
    isHotelSearchView,
    isPackageSearchView,
    setHotel,
    initialTab,
  ])

  const handleTabChange = (index: number) => {
    setActiveTab(index)
    setHotel?.(index)
  }

  const fixedWithoutTabsGradientProps =
    variant === 'fixedWithoutTabs'
      ? activeTab === 0
        ? packageSearchVariants.fixedWithoutTabs.cyprusContainer
        : activeTab === 1
          ? packageSearchVariants.fixedWithoutTabs.hotelContainer
          : activeTab === 3
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
        <CyprusSearchMenu
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
        <PackageSearchMenu
          onTabChange={handleTabChange}
          onFormOpen={() => setFormOpen(true)}
          onFormClose={() => setFormOpen(false)}
          isFormOpen={isFormOpen}
          showTabs={showTabs}
        />
      )}
      {activeTab === 3 && (
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


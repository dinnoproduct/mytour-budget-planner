import React, { useEffect, useState } from 'react'
import { LayoutFixed } from '../Layouts'
import { PackageSearchMenu } from '../PackageSearchMenu'
import { HotelSearchMenu } from '../HotelSearchMenu'
import {
  useHotelPackagesSearchContext,
  usePackagesSearchContext
} from '@entities/package'
import { type PackageSearchVariant } from '../types'

const MAIN_TAB_STORAGE_KEY = 'mainSearchTabIndex'

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
    const baseIndex = isHotelSearchView ? 1 : 0
    let nextIndex = baseIndex
    if (typeof window !== 'undefined') {
      const saved = window.sessionStorage.getItem(MAIN_TAB_STORAGE_KEY)
      const parsed = saved !== null ? Number(saved) : NaN
      if (!Number.isNaN(parsed)) {
        nextIndex = parsed
      }
    }
    setActiveTab(nextIndex)
    setHotel?.(nextIndex)
  }, [isHotelSearchView, isPackageSearchView, setHotel])

  const handleTabChange = (index: number) => {
    setActiveTab(index)
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(MAIN_TAB_STORAGE_KEY, String(index))
    }
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


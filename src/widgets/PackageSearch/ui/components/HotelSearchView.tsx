import React from 'react'
import { HotelSearchForm } from '../HotelSearchForm'
import { Layout } from '../Layouts'
import { type PackageSearchVariant } from '../types'

interface HotelSearchViewProps {
  containerProps?: any
  contentProps?: any
  variant?: PackageSearchVariant
  showTabs?: boolean
  onTabChange?: (index: number) => void
  defaultTabIndex?: number
}

export const HotelSearchView: React.FC<HotelSearchViewProps> = ({
  containerProps,
  contentProps,
  variant = 'centered',
  showTabs = true,
  onTabChange,
  defaultTabIndex
}) => {
  return (
    <Layout
      className={showTabs ? 'showTabs' : ''}
      containerProps={containerProps}
      contentProps={contentProps}
      variant={variant}
      defaultTabIndex={defaultTabIndex}
      onTabChange={onTabChange}
      showTabs={showTabs}
    >
      <HotelSearchForm />
    </Layout>
  )
}


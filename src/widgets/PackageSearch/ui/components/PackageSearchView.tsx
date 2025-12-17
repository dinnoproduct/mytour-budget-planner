import React from 'react'
import { PackageSearchForm } from '../PackageSearchForm'
import { Layout } from '../Layouts'
import { type PackageSearchVariant } from '../types'

interface PackageSearchViewProps {
  containerProps?: any
  contentProps?: any
  variant?: PackageSearchVariant
  showTabs?: boolean
  onTabChange?: (index: number) => void
  defaultTabIndex?: number
}

export const PackageSearchView: React.FC<PackageSearchViewProps> = ({
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
      <PackageSearchForm />
    </Layout>
  )
}


import React from 'react'
import { GroupTourSearchForm } from '../GroupTourSearchForm'
import { Layout } from '../Layouts'
import { type PackageSearchVariant } from '../types'

interface GroupSearchViewProps {
  containerProps?: any
  contentProps?: any
  variant?: PackageSearchVariant
  showTabs?: boolean
  onTabChange?: (index: number) => void
  defaultTabIndex?: number
  onFormOpen?: () => void
  onFormClose?: () => void
  isFormOpen?: boolean
}

export const GroupSearchView: React.FC<GroupSearchViewProps> = ({
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
      <GroupTourSearchForm />
    </Layout>
  )
}


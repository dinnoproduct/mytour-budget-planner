import React from 'react'
import { type PackageSearchProps } from './types'
import { useBreakpoint } from '@shared/hooks'
import { CombinedSearchView } from './components/CombinedSearchView'
import { FixedSearchView } from './components/FixedSearchView'

export const PackageSearch = ({
  containerProps,
  contentProps,
  variant = 'centered',
  showTabs = true,
  setHotel = () => {},
  initialTab,
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
        initialTab={initialTab}
      />
    )
  }

  return (
    <CombinedSearchView
      containerProps={containerProps}
      contentProps={contentProps}
      variant={variant}
      showTabs={showTabs}
      setHotel={setHotel}
      initialTab={initialTab}
    />
  )
}

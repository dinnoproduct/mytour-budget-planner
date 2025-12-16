import React from 'react'
import { type PackageSearchProps } from './types.ts'
import { useBreakpoint } from '@shared/hooks'
import { CombinedSearchView } from './components/CombinedSearchView'
import { FixedSearchView } from './components/FixedSearchView'

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
    <CombinedSearchView
      containerProps={containerProps}
      contentProps={contentProps}
      variant={variant}
      showTabs={showTabs}
      setHotel={setHotel}
    />
  )
}

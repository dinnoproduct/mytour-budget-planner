import { useEffect, useRef } from 'react'
import { useLocation, useSearchParams } from '@shared/lib/router'
import { FILTER_PARAMS_DEFAULT_VALUE, type FilterParams } from '../model'
import {
  mergeFilterParamsIntoSearch,
  parseFilterParamsFromSearch
} from './filterUrlState'

type Params = {
  filterParams: FilterParams
  setFilterParams: React.Dispatch<React.SetStateAction<FilterParams>>
}

export const usePackageFilterUrlState = ({
  filterParams,
  setFilterParams
}: Params) => {
  const location = useLocation()
  const [, setSearchParams] = useSearchParams()
  const isHydratedFromUrlRef = useRef(false)
  const skipNextSyncRef = useRef(false)

  useEffect(() => {
    if (isHydratedFromUrlRef.current) {
      return
    }

    const navigationEntry = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming | undefined
    const isReload = navigationEntry?.type === 'reload'

    if (isReload) {
      skipNextSyncRef.current = true
      setFilterParams(FILTER_PARAMS_DEFAULT_VALUE)

      const current = new URLSearchParams(location.search)
      const next = mergeFilterParamsIntoSearch(
        location.search,
        FILTER_PARAMS_DEFAULT_VALUE
      )
      if (next.toString() !== current.toString()) {
        setSearchParams(next, { replace: true })
      }

      isHydratedFromUrlRef.current = true
      return
    }

    skipNextSyncRef.current = true
    setFilterParams(parseFilterParamsFromSearch(location.search))
    isHydratedFromUrlRef.current = true
  }, [location.search, setFilterParams, setSearchParams])

  useEffect(() => {
    if (!isHydratedFromUrlRef.current) {
      return
    }
    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false
      return
    }

    const next = mergeFilterParamsIntoSearch(location.search, filterParams)
    const current = new URLSearchParams(location.search)

    if (next.toString() === current.toString()) {
      return
    }

    setSearchParams(next, { replace: true })
  }, [filterParams, location.search, setSearchParams])
}

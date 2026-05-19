"use client"

import {
  useLocation,
  useSearchParams
} from '@shared/lib/router'
import queryString, { type ParsedQuery } from 'query-string'
import { useMemo } from 'react'

type SetSearchParams = (
  next:
    | URLSearchParams
    | Record<string, string>
    | ((prev: URLSearchParams) => URLSearchParams | Record<string, string>),
  options?: { replace?: boolean }
) => void

type TUseQueryParams = {
  searchParams: ParsedQuery
  setSearchParams: SetSearchParams
}

export const useQueryParams = (): TUseQueryParams => {
  const [, setSearchParams] = useSearchParams()
  const location = useLocation()

  const parsedSearchParams = useMemo(
    () => queryString.parse(location.search),
    [location.search]
  )

  return { searchParams: parsedSearchParams, setSearchParams }
}

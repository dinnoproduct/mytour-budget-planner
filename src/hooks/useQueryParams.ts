import { type SetURLSearchParams, useLocation, useSearchParams } from 'react-router-dom';
import queryString, { type ParsedQuery } from 'query-string';
import { useMemo } from 'react';

type TUseQueryParams = {
  searchParams: ParsedQuery;
  setSearchParams: SetURLSearchParams;
};

export const useQueryParams = (): TUseQueryParams => {
  const [, setSearchParams] = useSearchParams();
  const location = useLocation();

  const parsedSearchParams = useMemo(() => queryString.parse(location.search), [location.search]);

  return { searchParams: parsedSearchParams, setSearchParams };
};

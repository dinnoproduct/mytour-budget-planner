import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import {
  type DictionaryEntity,
  type DictionaryTypes,
  PACKAGE_LANGUAGE_MAP,
  packageUseCases
} from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'
import { useTranslation } from 'react-i18next'
import { type LanguageName } from '@shared/model'

export const useDictionary = (
  dictionaryType: DictionaryTypes,
  options?: Omit<UseQueryOptions<DictionaryEntity[]>, 'queryKey' | 'queryFn'>
) => {
  const { i18n } = useTranslation()

  return useQuery({
    ...(options || {}),
    refetchInterval: PACKAGE_REQUEST_REFETCH_INTERVAL,
    queryFn: () =>
      packageUseCases.getDictionary(
        dictionaryType,
        PACKAGE_LANGUAGE_MAP[i18n.language as LanguageName]
      ),
    queryKey: ['dictionary', dictionaryType, i18n.language]
  })
}

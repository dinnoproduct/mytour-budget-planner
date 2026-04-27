import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { type LanguageName } from '@shared/model'
import { bannerService } from '../api'
import { type ExternalBannersResponse } from '../api/types'
import { NOTIFICATION_LANGUAGE_MAP } from '../model/constants'

export const useExternalBanners = (
  options?: Omit<
    UseQueryOptions<ExternalBannersResponse>,
    'queryKey' | 'queryFn'
  >,
) => {
  const { i18n } = useTranslation()
  const apiLanguage =
    NOTIFICATION_LANGUAGE_MAP[i18n.language as LanguageName] ?? 'en'

  return useQuery({
    ...options,
    queryKey: ['external-banners', apiLanguage],
    queryFn: () => bannerService.getBanners(apiLanguage),
  })
}

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { type LanguageName } from '@shared/model'
import { tipsService } from '../api/TipsService'
import { type ExternalTipsResponse } from '../model/tips'
import { NOTIFICATION_LANGUAGE_MAP } from '../model/constants'

export const useExternalTips = (
  options?: Omit<UseQueryOptions<ExternalTipsResponse>, 'queryKey' | 'queryFn'>,
) => {
  const { i18n } = useTranslation()
  const apiLanguage =
    NOTIFICATION_LANGUAGE_MAP[i18n.language as LanguageName] ?? 'en'

  return useQuery({
    ...options,
    queryKey: ['external-tips', apiLanguage],
    queryFn: () => tipsService.getTips(apiLanguage),
  })
}

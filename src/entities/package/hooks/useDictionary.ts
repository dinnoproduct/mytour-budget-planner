import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { DictionaryEntity, DictionaryTypes, PACKAGE_LANGUAGE_MAP, PackageEntity, packageUseCases } from '@entities/package'
import { PACKAGE_REQUEST_REFETCH_INTERVAL } from '@shared/configs'
import { useTranslation } from 'react-i18next'
import { LanguageName } from '@shared/model'

export const useDictionary = (
	dictionaryType: DictionaryTypes,
	options?: UseQueryOptions<DictionaryEntity[]>
) => {
	const { i18n } = useTranslation();

	return useQuery({
	  ...(options || {}),
		refetchInterval: PACKAGE_REQUEST_REFETCH_INTERVAL,
		queryFn: () => packageUseCases.getDictionary(dictionaryType, PACKAGE_LANGUAGE_MAP[i18n.language as LanguageName]),
		queryKey: ['dictionary', dictionaryType, i18n.language],
	})
}
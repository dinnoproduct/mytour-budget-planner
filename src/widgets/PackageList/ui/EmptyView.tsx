import { EmptyState } from '@ui'
import { EmptyViewProps } from '@widgets/PackageList/ui/types.ts'

export const EmptyView = ({ isFilteredPackagesEmpty, isLoadingFilteredPackages, isSearchError }: EmptyViewProps) => {
	if (!isLoadingFilteredPackages) {
		if (isSearchError) {
			return (
				<EmptyState illustrationName="no-result" mt={{base: '160px', md: '200px'}}>
					Տեխնիկական խնդիր, խնդրում ենք փորձել մի փոքր ուշ:
				</EmptyState>
			)
		} else if (isFilteredPackagesEmpty) {
			return (
				<EmptyState illustrationName="error" mt={{base: '160px', md: '200px'}}>
					Նշված պարամետրերով փաթեթներ չեն գտնվել։ Փորձեք փնտրել այլ պարամետրերով:
				</EmptyState>
			)
		}
	}
}

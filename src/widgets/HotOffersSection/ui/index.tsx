import { Box, BoxProps } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { OffersSection } from './OffersSection.tsx'
import { MOCK_PACKAGES } from '../../../shared/model'
import usePackages from '../../../modules/packages/hooks/usePackages.ts'

export const HotOffersSection = (props: BoxProps) => {
	const { filteredPackages=[], loading } = usePackages();
	console.log('filteredPackages', filteredPackages)

	return (
		<Layout {...props}>
			<OffersSection
				packages={filteredPackages?.length ? filteredPackages?.slice(0, 4) : MOCK_PACKAGES}
				isLoading={loading}
			/>
		</Layout>
	)
}

const Layout = ({ children, ...props }: {children: ReactNode | ReactNode[]} & BoxProps) => {
	return (
		<Box px={{ base: 4, md: 6 }} {...props}>
			<Box maxWidth="1376px" mx="auto">
				<Box>
					{children}
				</Box>
			</Box>
		</Box>
	)
}
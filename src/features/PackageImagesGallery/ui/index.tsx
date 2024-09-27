import { LayoutProps, PackageImagesGalleryProps } from './types.ts'
import { Box } from '@chakra-ui/react'
import { ImagesGrid } from './ImagesGrid.tsx'
import ImagesSlider from '@features/PackageImagesGallery/ui/ImagesSlider.tsx'
import { useBreakpoint } from '@shared/hooks'
import { useMemo } from 'react'

export const PackageImagesGallery = ({ imageUrls, onImageClick, ...props }: PackageImagesGalleryProps) => {
	const { isMd } = useBreakpoint()

	return (
		<Layout {...props}>
			{isMd ? (
				<ImagesGrid imageUrls={imageUrls} onImageClick={onImageClick}/>
			) : (
				<ImagesSlider imageUrls={imageUrls}/>
			)}
		</Layout>
	)
}

const Layout = ({ children, ...props }: LayoutProps) => {
	return (
		<Box
			maxWidth="1188px"
			width="full"
			mx="auto"
			px={{ md: 6 }}
			{...props}
		>
			{children}
		</Box>
	)
}


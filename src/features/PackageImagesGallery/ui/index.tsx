import { LayoutProps, PackageImagesGalleryProps } from './types'
import { Box } from '@chakra-ui/react'
import { ImagesGrid } from './ImagesGrid.tsx'
import ImagesSlider from '@features/PackageImagesGallery/ui/ImagesSlider.tsx'
import { useBreakpoint } from '@shared/hooks'

export const PackageImagesGallery = ({ imageUrls, onImageClick, isGroupTour = false, ...props }: PackageImagesGalleryProps) => {
	const { isMd } = useBreakpoint()

	return (
		<Layout {...props}>
			{isMd ? (
				<ImagesGrid imageUrls={imageUrls} onImageClick={onImageClick} isGroupTour={isGroupTour}/>
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


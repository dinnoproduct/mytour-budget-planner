import { Grid, GridItem } from '@chakra-ui/react'
import { useState } from 'react'
import { ImagesGridProps } from './types.ts'
import { GalleryImage } from './GalleryImage.tsx'
import { Skeleton } from '@shared/ui'

export const ImagesGrid = ({ imageUrls, onImageClick }: ImagesGridProps) => {
	const [loadedImages, setLoadedImages] = useState<boolean[]>(new Array(imageUrls.length).fill(false))

	const handleImageLoad = (index: number) => {
		setLoadedImages((prevLoadedImages) => {
			const updatedLoadedImages = [...prevLoadedImages]
			updatedLoadedImages[index] = true
			return updatedLoadedImages
		})
	}

	return (
		<Grid
			templateColumns="repeat(5, 1fr)"
			templateRows="repeat(2, 204px)"
			gap={4}
			rounded="lg"
			overflow="hidden"
		>
			<GridItem
				colSpan={3} rowSpan={2}
				onClick={() => onImageClick?.(0)}
				cursor={onImageClick ? 'pointer' : 'default'}
			>
				<Skeleton isLoaded={loadedImages[0]} height="100%">
					<GalleryImage src={imageUrls[0]} onLoad={() => handleImageLoad(0)} />
				</Skeleton>
			</GridItem>

			{imageUrls.slice(1, 5).map((url, index) => (
				<GridItem
					key={index + 1}
					onClick={() => onImageClick?.(index + 1)}
					cursor={onImageClick ? 'pointer' : 'default'}
				>
					<Skeleton isLoaded={loadedImages[index + 1]} height="100%">
						<GalleryImage src={url} onLoad={() => handleImageLoad(index + 1)} />
					</Skeleton>
				</GridItem>
			))}
		</Grid>
	)
}

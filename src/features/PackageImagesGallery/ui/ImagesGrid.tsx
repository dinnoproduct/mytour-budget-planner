"use client"

import { Box, Button, Flex, Grid, GridItem } from '@chakra-ui/react'
import { useState } from 'react'
import { Icon } from '@foundation/Iconography'
import { ImagesGridProps } from './types'
import { GalleryImage } from './GalleryImage'
import { Skeleton } from '@shared/ui'
import { Text } from '@ui'
import { useParams } from '@shared/lib/router'
import { useLanguageNavigate } from '@/hooks/useLanguageNavigate'

export const ImagesGrid = ({ imageUrls, onImageClick, isGroupTour }: ImagesGridProps) => {
  const { id: tourId } = useParams<{ id: string }>()
  const { navigateToGroupTourGallery } = useLanguageNavigate()
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
					{
							isGroupTour && (imageUrls.length > 5 ? index === 3 : index === imageUrls.length - 2 )? (
								<Skeleton isLoaded={loadedImages[index + 1]} height="100%" position="relative" onClick={(e) => {
									e.stopPropagation()
									if (isGroupTour && tourId) {
										navigateToGroupTourGallery(tourId)
									}
								}} >
									<Box 
										sx={{ 
											position:'absolute', 
											top: 0, 
											left: 0,
											right: 0, 
											bottom: 0, 
											backgroundColor: 'blackAlpha.500', 
											display: 'flex', 
											alignItems: 'center', 
											justifyContent: 'center' 
										}}
									>
										<Button
											variant="solid-gray-icon"
											size="sm"
											gap={2}
											
										>
											<Icon name="image" color={`gray.600`} />
											<Text color="gray.600">{index + 2}/{imageUrls.length}</Text>
										</Button>
									</Box>
									<GalleryImage src={url} onLoad={() => handleImageLoad(index + 1)} />
								</Skeleton>
							) : (
								<Skeleton isLoaded={loadedImages[index + 1]} height="100%">
									<GalleryImage src={url} onLoad={() => handleImageLoad(index + 1)} />
								</Skeleton>
							)
						}	
				</GridItem>
			))}
		</Grid>
	)
}

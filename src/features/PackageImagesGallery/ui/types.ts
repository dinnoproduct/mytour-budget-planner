import { BoxProps } from '@chakra-ui/react'
import { ReactNode } from 'react'

export type PackageImagesGalleryProps = {
	imageUrls: string[]
	onImageClick?: (index: number) => void
} & BoxProps

export type LayoutProps = {
	children: ReactNode
} & BoxProps

export type ImagesGridProps = {
	imageUrls: string[]
	onImageClick?: (index: number) => void
}

export type ImageSliderProps = {
	imageUrls: string[]
}
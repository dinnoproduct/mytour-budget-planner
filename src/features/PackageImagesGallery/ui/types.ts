import { BoxProps } from '@chakra-ui/react'
import { ReactNode } from 'react'

export type PackageImagesGalleryProps = {
  imageUrls: string[]
  onImageClick?: (index: number) => void
  isGroupTour?: boolean
} & BoxProps

export type LayoutProps = {
  children: ReactNode
} & BoxProps

export type ImagesGridProps = {
  imageUrls: string[]
  onImageClick?: (index: number) => void
  isGroupTour?: boolean
}

export type ImageSliderProps = {
  imageUrls: string[]
}


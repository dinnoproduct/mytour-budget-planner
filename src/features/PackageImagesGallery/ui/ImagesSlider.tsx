import Slider, { Settings } from 'react-slick'
import React, { useRef, useState } from 'react'
import { Box, BoxProps } from '@chakra-ui/react'
import { ImageSliderProps } from '@features/PackageImagesGallery/ui/types'
import { PaginationBadge } from './Badge.tsx'
import { GalleryImage } from './GalleryImage.tsx'
import classnames from 'classnames'

const slideTime = 300

const ImagesSlider = ({ imageUrls=[] }: ImageSliderProps) => {
	const sliderRef = useRef<Slider>(null)
	const [currentSlide, setCurrentSlide] = useState(0)
	const [isHovered, setIsHovered] = useState(false)

	const settings: Settings = {
		dots: false,
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		swipeToSlide: false,
		draggable: false,
		speed: slideTime,
		lazyLoad: 'ondemand',
		beforeChange: (current: number, next: number) => setTimeout(() => setCurrentSlide(next), slideTime),
		arrows: true
	}

	return (
		<Layout
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Slider
				ref={sliderRef}
				{...settings}
				className={classnames({
					'hide-prev': !isHovered,
					'hide-next': !isHovered
				})}
			>
				{imageUrls?.map((url) => (
					<Box
						outline="none"
						key={url}
					>
						<GalleryImage
							src={url}
							height="54.7dvw"
						/>
					</Box>
				))}
			</Slider>
			{/*<div className="images-count">*/}
			{/*	{currentSlide + 1}/{sliderImages?.length}*/}
			{/*</div>*/}
			<PaginationBadge
				currentIndex={currentSlide}
				imagesCount={imageUrls?.length}
			/>

		</Layout>
	)
}

export default ImagesSlider

const Layout = ({ children, ...props }: BoxProps) => {
	return (
		<Box
			maxHeight="54.7dvw"
			position="relative"
			sx={{
				'.slick-slider': {
					paddingBottom: 0
				},
				'.slick-slide': {
					marginRight: '0 !important'
				},
				'.hide-prev .slick-prev': {
					opacity: 0,
					pointerEvents: 'none'
				},
				'.hide-next .slick-next': {
					opacity: 0,
					pointerEvents: 'none'
				},
				'.slick-arrow': {
					width: '32px',
					height: '32px',
					rounded: 'full',
					opacity: 1,
					bgColor: 'white',
					transition: 'opacity 0.2s ease-in-out, pointer-events 0.2s ease-in-out',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center',
					backgroundSize: '20px',
					zIndex: 9
				},
				'.slick-prev': {
					left: '2',
					backgroundImage: '/assets/icons/slider-arrow-prev.svg'
				},
				'.slick-next': {
					right: '2',
					backgroundImage: '/assets/icons/slider-arrow-next.svg'
				},
				'.slick-prev:hover, .slick-prev:focus, .slick-next:hover, .slick-next:focus': {
					outline: 'none !important',
					backgroundColor: 'white',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center'
				},
				'.slick-prev:before, .slick-next:before': {
					display: 'none'
				}
			}}
			{...props}
		>
			{children}
		</Box>
	)
}


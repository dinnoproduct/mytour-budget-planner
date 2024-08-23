import Slider, { Settings } from 'react-slick'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, BoxProps, Image } from '@chakra-ui/react'
import classnames from 'classnames'
import { HotelStarBadge, PaginationBadge, StatusBadge } from './Badge.tsx'

const slideTime = 300

const ImageSlider = ({ images, starsCount, isPackageList }: any) => {
	console.log('images', images)
	const sliderRef = useRef<Slider>(null)
	const { t } = useTranslation()
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
		// lazyLoad: 'ondemand' as LazyLoadTypes,
		beforeChange: (current: number, next: number) => setTimeout(() => setCurrentSlide(next), slideTime),
		arrows: true
	}

	const sliderImages = images?.filter((image: any) => {
		if (isPackageList) {
			return image?.size === 1
		} else return image?.size === 3
	})

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
				{sliderImages?.map(({ url }: {url: string}) => (
					<Box
						outline="none"
					>
						<Image
							src={url}
							maxWidth="full"
							height="170px"
							width="full"
							objectFit="cover"
						/>
					</Box>
				))}
			</Slider>
			{/*<div className="images-count">*/}
			{/*	{currentSlide + 1}/{sliderImages?.length}*/}
			{/*</div>*/}
			<PaginationBadge
				currentIndex={currentSlide}
				imagesCount={sliderImages?.length}
			/>

			<HotelStarBadge starsCount={starsCount}/>

			<StatusBadge />
		</Layout>
	)
}

export default ImageSlider

const Layout = ({ children, ...props }: BoxProps) => {
	return (
		<Box
			maxHeight="170px"
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
					backgroundImage: '/public/assets/icons/slider-arrow-prev.svg'
				},
				'.slick-next': {
					right: '2',
					backgroundImage: '/public/assets/icons/slider-arrow-next.svg'
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

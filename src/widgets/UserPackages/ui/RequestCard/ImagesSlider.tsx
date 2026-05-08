import Slider, { type Settings } from 'react-slick'
import React, { useMemo, useRef, useState } from 'react'
import { Box, type BoxProps, Image } from '@chakra-ui/react'
import classnames from 'classnames'
import { StatusOnImageBadge } from '@ui'
import { HotelStarBadge, PaginationBadge } from './Badge'
import { RequestStatus } from '@entities/package'
import {
  type ImagesSliderProps,
  type RequestCardStatus
} from '@widgets/UserPackages/ui/RequestCard/types'

const slideTime = 300

export const ImagesSlider = ({
  images,
  starsCount,
  status,
  showBadge
}: ImagesSliderProps) => {
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
    beforeChange: (current: number, next: number) =>
      setTimeout(() => setCurrentSlide(next), slideTime),
    arrows: true
  }

  const sliderImages = useMemo(
    () => images?.filter((image: any) => image?.size === 1),
    [images]
  )

  const StatusBadge = useMemo(
    () => (showBadge ? STATUS_BADGE_MAP[status] : null),
    [status, showBadge]
  )

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
        {sliderImages?.map(({ url }: { url: string }) => (
          <Box outline="none" key={url}>
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

      <HotelStarBadge starsCount={starsCount} />

      {StatusBadge}
    </Layout>
  )
}

// custom cases
// 1. draft and flight done was gone / notAvailable
// 2. draft and flight seats less then 6 | sold out

const STATUS_BADGE_MAP: {
  [key in RequestCardStatus]: React.ReactNode
} = {
  [RequestStatus.Draft]: <StatusOnImageBadge status="notFinished" />,
  [RequestStatus.InProcess]: <StatusOnImageBadge status="inProgress" />,
  [RequestStatus.NotPaid]: <StatusOnImageBadge status="paymentIssue" />,
  [RequestStatus.Booked]: <StatusOnImageBadge status="paidPartially" />,
  [RequestStatus.Purchased]: <StatusOnImageBadge status="paid" />,
  [RequestStatus.Rejected]: <StatusOnImageBadge status="rejected" />,
  [RequestStatus.Overdue]: <StatusOnImageBadge status="expired" />,
  [RequestStatus.Reserved]: <StatusOnImageBadge status="reserved" />,
  10: <StatusOnImageBadge status="notAvailable" />,
  11: <StatusOnImageBadge status="soldOut" />
}

const Layout = ({ children, ...props }: BoxProps) => (
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
        backgroundImage: '/assets/icons/slider-arrow-prev.svg'
      },
      '.slick-next': {
        right: '2',
        backgroundImage: '/assets/icons/slider-arrow-next.svg'
      },
      '.slick-prev:hover, .slick-prev:focus, .slick-next:hover, .slick-next:focus':
      {
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


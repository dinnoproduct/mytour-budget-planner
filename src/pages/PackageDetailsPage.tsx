import { Box, Flex } from '@chakra-ui/react'
import { Button, Footer } from '@ui'
import { useTranslation } from 'react-i18next'
import {
  PackageImagesGallery,
  PackageImagesSliderModal
} from '@features/PackageImagesGallery'
import { PackageDetails, PackageDetailsHeader } from '@widgets/PackageDetails'
import {
  useGetCurrentOfferPackage,
  usePackagesSearchContext,
  useSearchPackage
} from '@entities/package'
import Loader from '@/components/Loader/Loader.tsx'
import { type LayoutProps } from '@widgets/PackageDetails/ui/types.ts'
import { PackageBookingConfig } from '@widgets/PackageBookingConfig'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBreakpoint } from '@shared/hooks'
import { useModalContext } from '@app/providers'
import { BookingFlow } from '@widgets/BookingFlow'
import { useUserContext } from '@/entities/user'

export const PackageDetailsPage = () => {
  const navigate = useNavigate()
  const { isMd } = useBreakpoint()
  const { user } = useUserContext()
  const { dispatchModal } = useModalContext()
  const [isModalOpen, setModalOpen] = useState(false)
  const [isBookingFlowOpen, setBookingFlowOpen] = useState(false)
  const { packageDetails, isLoading } = useSearchPackage()
  const currentOfferPackage = useGetCurrentOfferPackage()

  const [childrenAges, setChildrenAges] = useState<number[]>([])

  // console.log('PackageDetailsPage@currentOfferPackage : ', currentOfferPackage)
  const { filteredPackages } = usePackagesSearchContext()
  const [isLateCheckout, setLateCheckout] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [imageModalActiveIndex, setImageModalActiveIndex] = useState(0)

  const uniqueImageUrls = useMemo(
    () =>
      packageDetails?.hotel?.images
        .filter(img => img.size === 3)
        .map(img => img.url) || [],
    [JSON.stringify(packageDetails?.hotel?.images)]
  )

  useEffect(() => {
    if (!packageDetails?.offerId && !isLoading) {
      handleBackClick()
    }
  }, [packageDetails, isLoading])

  const handleImageClick = (index: number) => {
    setImageModalActiveIndex(index)
    setModalOpen(true)
  }

  const handleBackClick = () => {
    if (filteredPackages?.length) {
      navigate(-1)
    } else {
      navigate('/', { replace: true })
    }
  }

  useEffect(() => {
    if (!isMd) {
      setModalOpen(false)
    }
  }, [isMd])

  const openAuthModal = () => {
    if (user?.id) {
      setBookingFlowOpen(true)

      return
    }

    dispatchModal({
      type: 'open',
      modalType: 'auth',
      props: {
        view: 'signUp',
        isCloseOnSuccess: true,
        onSuccess: () => {
          setBookingFlowOpen(true)
        }
      }
    })
  }

  const handleBookClick = ({ childrenAges }: { childrenAges: number[] }) => {
    setChildrenAges(childrenAges)
    openAuthModal()
  }

  if (!packageDetails?.offerId || isLoading) {
    return <Loader loading={isLoading} />
  }

  return (
    <Box overflowX="hidden" mb={{ base: '117px', md: '0' }}>
      <Header onBackClick={handleBackClick} />

      <PackageImagesGallery
        imageUrls={uniqueImageUrls}
        mt={{ md: 10 }}
        onImageClick={handleImageClick}
      />

      <PackageDetailsLayout>
        <PackageDetailsHeader
          tourPackage={packageDetails}
          onMoreImagesClick={() => setModalOpen(true)}
        />

        <Flex
          direction={{ base: 'column-reverse', md: 'row' }}
          mt={{ md: '10' }}
          ref={containerRef}
        >
          <PackageDetails
            tourPackage={packageDetails}
            isLateCheckout={isLateCheckout}
          />

          <PackageBookingConfig
            tourPackage={packageDetails}
            ml={{ md: '20' }}
            mt={{ base: '5', md: '0' }}
            flexShrink={0}
            onLateCheckoutChange={setLateCheckout}
            containerRef={containerRef}
            onBookClick={handleBookClick}
          />
        </Flex>
      </PackageDetailsLayout>

      <Footer />

      <PackageImagesSliderModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        imageUrls={uniqueImageUrls}
        activeIndex={imageModalActiveIndex}
      />

      <BookingFlow
        packageDetails={currentOfferPackage}
        initialView="travelers"
        childrenAges={childrenAges}
        // onBookingSuccess={handleBackClick}
        isOpen={isBookingFlowOpen}
        onClose={() => setBookingFlowOpen(false)}
      />
    </Box>
  )
}

const Header = ({ onBackClick }: { onBackClick: () => void }) => {
  const { t } = useTranslation()

  return (
    <Box height="80px">
      <Flex
        height="80px"
        width="full"
        alignItems="center"
        px={{ base: 4, md: 6 }}
        borderBottom="1px solid"
        borderColor="gray.100"
        position={{ base: 'fixed', md: 'static' }}
        bgColor="white"
        zIndex="3"
      >
        <Button
          variant="text-blue"
          iconBefore="arrow-back"
          onClick={onBackClick}
        >{t`packages`}</Button>
      </Flex>
    </Box>
  )
}

const PackageDetailsLayout = ({ children, ...props }: LayoutProps) => (
  <Box
    maxWidth="1188px"
    width="full"
    mx="auto"
    px={{ md: 6 }}
    {...props}
    pt={{ base: 4, md: 6, lg: 10 }}
    pb={{ base: 4, md: 20, lg: 14 }}
  >
    {children}
  </Box>
)

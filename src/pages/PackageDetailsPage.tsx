import { Box, Flex } from '@chakra-ui/react'
import { Button, Footer } from '@ui'
import { useTranslation } from 'react-i18next'
import { PackageImagesGallery, PackageImagesSliderModal } from '@features/PackageImagesGallery'
import { PackageDetails, PackageDetailsHeader } from '@widgets/PackageDetails'
import {
	PackageEntity, useBookPackage, useCurrentOfferPackage, useGetCurrentOfferPackage,
	usePackagesSearchContext,
	useSearchPackage
} from '@entities/package'
import Loader from '@/components/Loader/Loader.tsx'
import { LayoutProps } from '@widgets/PackageDetails/ui/types.ts'
import { PackageBookingConfig } from '@widgets/PackageBookingConfig'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBreakpoint } from '@shared/hooks'
import { CustomFields, PackagesFields } from '@/modules/packages/data/packagesEnums.ts'
import type { ITraveler } from '@/modules/packages/data/packagesTypes.ts'
import { useUserContext } from '@/entities/user'
import { PaymentModal, PaymentModalView } from '@widgets/PaymentModal'
import { TravelersModal } from '@widgets/TravelersModal'
import { useModalContext } from '@app/providers'

export const PackageDetailsPage = () => {
	const navigate = useNavigate()
	const { mutateAsync: bookPackageAsync } = useBookPackage()
	const { user, clearUserData } = useUserContext()
	const { t } = useTranslation()
	const { isMd } = useBreakpoint()
	const { dispatchModal } = useModalContext()
	const [isModalOpen, setModalOpen] = useState(false)
	const [paymentModalView, setPaymentModalView] = useState<PaymentModalView | ''>('')
	const [isTravelersModalOpen, setTravelersModalOpen] = useState(false)
	const { packageDetails, isLoading } = useSearchPackage()
	const currentOfferPackage = useGetCurrentOfferPackage()
	// console.log('PackageDetailsPage@currentOfferPackage : ', currentOfferPackage)
	const { filteredPackages } = usePackagesSearchContext()
	const [isLateCheckout, setLateCheckout] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const [imageModalActiveIndex, setImageModalActiveIndex] = useState(0)
	const [travelers, setTravelers] = useState<any>({
		adults: [],
		children: []
	})
	const travelersRef = useRef<ITraveler[]>([])
	useEffect(() => {
		travelersRef.current = travelers
	}, [travelers])
	const [amountToBePaid, setAmountToBePaid] = useState(0)

	const uniqueImageUrls = useMemo(() => {
		return packageDetails.hotel?.images.filter(img => img.size === 3).map(img => img.url)
	}, [JSON.stringify(packageDetails?.hotel?.images)])

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
		dispatchModal({
			type: 'open',
			modalType: 'auth',
			props: {
				view: 'signUp',
				isCloseOnSuccess: true,
				onSuccess: () => {
					openTravelersModal()
				}
			}
		})
	}

	const openTravelersModal = () => {
		setTravelersModalOpen(true)
	}

	const onTravelersModalSuccess = (travelers: any) => {
		setTravelers(travelers)
		setTravelersModalOpen(false)
		openPaymentModal()
	}

	const openPaymentModal = () => {
		setPaymentModalView('paymentForm')
	}

	const onPaymentModalSuccess = async (paymentAmount: number) => {
		setAmountToBePaid(paymentAmount)

		if (!currentOfferPackage) {
			return
		}

		try {
			const bookInput = {
				[CustomFields.cityId]: currentOfferPackage[PackagesFields.city][PackagesFields.id],
				[PackagesFields.price]: currentOfferPackage[PackagesFields.price],
				[CustomFields.hotelId]: currentOfferPackage[PackagesFields.hotel][PackagesFields.id],
				[CustomFields.startDate]: currentOfferPackage[PackagesFields.destinationFlight][PackagesFields.departureDate],
				[CustomFields.endDate]: currentOfferPackage[PackagesFields.returnFlight][PackagesFields.departureDate],
				[CustomFields.travelAgencyId]: currentOfferPackage[PackagesFields.travelAgency][PackagesFields.id],
				[CustomFields.notes]: '',
				[PackagesFields.offerId]: currentOfferPackage[PackagesFields.offerId],
				[CustomFields.destinationFlightId]: currentOfferPackage[PackagesFields.destinationFlight][PackagesFields.id],
				[CustomFields.returnFlightId]: currentOfferPackage[PackagesFields.returnFlight][PackagesFields.id]!,
				[PackagesFields.roomType]: currentOfferPackage[PackagesFields.roomType],
				[CustomFields.email]: user?.email || '',
				[CustomFields.phoneNumber]: user?.phoneNumber || '',
				[PackagesFields.amountToBePaid]: +paymentAmount,
				[PackagesFields.usdRate]: currentOfferPackage[PackagesFields.usdRate]!,
				[CustomFields.travelers]: [...travelers.adults, ...travelers.children]
			}
			// console.log('bookInput : ', bookInput)
			await bookPackageAsync(bookInput)
		} catch (e) {
			setPaymentModalView('paymentError')
		} finally {
			clearUserData()
		}
	}

	useEffect(() => {
		if (user?.firstName && currentOfferPackage?.offerId) {
			setTravelers((prevState: any) => ({
				adults: [
					{
						firstName: user.firstName,
						lastName: user.lastName
					},
					...Array(currentOfferPackage.adultTravelers - 1).fill({
						firstName: '',
						lastName: '',
						dateOfBirth: ''
					})
				],
				children: Array(currentOfferPackage.childrenTravelers + currentOfferPackage.infantTravelers).fill({
					firstName: '',
					lastName: '',
					dateOfBirth: ''
				})
			}))
		}
	}, [user?.id, currentOfferPackage?.adultTravelers, currentOfferPackage?.childrenTravelers, currentOfferPackage?.infantTravelers])
	// console.log('travelers : ', currentOfferPackage)

	if (!packageDetails?.offerId || isLoading) {
		return <Loader loading={isLoading}/>
	}

	return (
		<Box
			overflowX="hidden"
			mb={{ base: '117px', md: '0' }}
		>
			<Header onBackClick={handleBackClick}/>

			<PackageImagesGallery
				imageUrls={uniqueImageUrls}
				mt={{ md: 10 }}
				onImageClick={handleImageClick}
			/>

			<PackageDetailsLayout>
				<PackageDetailsHeader
					tourPackage={packageDetails as PackageEntity}
					onMoreImagesClick={() => setModalOpen(true)}
				/>

				<Flex
					direction={{ base: 'column-reverse', md: 'row' }}
					mt={{ md: '10' }}
					ref={containerRef}
				>
					<PackageDetails
						tourPackage={packageDetails as PackageEntity}
						isLateCheckout={isLateCheckout}
					/>

					<PackageBookingConfig
						tourPackage={packageDetails as PackageEntity}
						ml={{ md: '20' }}
						mt={{ base: '5', md: '0' }}
						flexShrink={0}
						onLateCheckoutChange={setLateCheckout}
						containerRef={containerRef}
						onBookClick={openAuthModal}
					/>
				</Flex>
			</PackageDetailsLayout>

			<Footer/>

			<PackageImagesSliderModal
				isOpen={isModalOpen}
				onClose={() => setModalOpen(false)}
				imageUrls={uniqueImageUrls}
				activeIndex={imageModalActiveIndex}
			/>

			{paymentModalView && (
				<PaymentModal
					isOpen={!!paymentModalView}
					closeModal={() => setPaymentModalView('')}
					packageDetails={currentOfferPackage as any}
					onSuccess={onPaymentModalSuccess}
					view={paymentModalView}
					onBackClick={() => {
						setPaymentModalView('')
						openTravelersModal()
					}}
				/>
			)}

			{isTravelersModalOpen && (
				<TravelersModal
					isOpen={isTravelersModalOpen}
					closeModal={() => setTravelersModalOpen(false)}
					packageDetails={currentOfferPackage as any}
					travelers={travelers}
					onSuccess={onTravelersModalSuccess}
				/>
			)}
		</Box>
	)
}

const Header = ({ onBackClick }: {onBackClick: () => void}) => {
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

const PackageDetailsLayout = ({
	                              children,
	                              ...
		                              props
                              }: LayoutProps) => {
	return (
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
}

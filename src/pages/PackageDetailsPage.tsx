import { Box, Flex, HStack } from '@chakra-ui/react'
import { Button, Footer } from '@ui'
import { useTranslation } from 'react-i18next'
import { PackageImagesGallery, PackageImagesSliderModal } from '@features/PackageImagesGallery'
import { PackageDetails, PackageDetailsHeader } from '@widgets/PackageDetails'
import {
	PackageEntity, useCurrentOfferPackage,
	usePackagesSearchContext,
	useSearchPackage
} from '@entities/package'
import Loader from '@/components/Loader/Loader.tsx'
import { LayoutProps } from '@widgets/PackageDetails/ui/types.ts'
import { PackageBookingConfig } from '@widgets/PackageBookingConfig'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBreakpoint } from '@shared/hooks'
import Modal from '@/components/Modal/Modal'
import { numberWithCommaNormalizer } from '@/utils/normalizers.ts'
import { PackagesFields } from '@/modules/packages/data/packagesEnums.ts'
import { GoogleLogin } from '@react-oauth/google'
import { overDaysFromNow } from '@/utils/methods.ts'
import { useRecoilState } from 'recoil'
import { isBookModalOpenAtom, userTokenAtom } from '@/modules/packages/store/store.ts'
import useUser from '@/modules/packages/hooks/useUser.ts'
import BookModal from '@/modules/packages/components/BookModal/BookModal.tsx'
import ReactModal from 'react-modal'

export const PackageDetailsPage = () => {
	const navigate = useNavigate()
	const { t } = useTranslation()
	const { isMd } = useBreakpoint()
	const [isModalOpen, setModalOpen] = useState(false)
	const { packageDetails, isLoading } = useSearchPackage()
	const { data: currentOfferPackage } = useCurrentOfferPackage()
	const { filteredPackages } = usePackagesSearchContext()
	const [isLateCheckout, setLateCheckout] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const [imageModalActiveIndex, setImageModalActiveIndex] = useState(0)

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


	// temp booking logic
	const [paymentInfoModalIsOpen, setPaymentInfoModalIsOpen] = useState(false)
	const [registerModalIsOpen, setRegisterModalIsOpen] = useState(false)

	const onPaymentInfoModalContinue = () => {
		setPaymentInfoModalIsOpen(false)
		setRegisterModalIsOpen(true)
	}

	const under21DaysFromNow = useMemo(() => {
		return !overDaysFromNow(
			packageDetails?.[PackagesFields.destinationFlight]?.[PackagesFields.departureDate],
			21
		)
	}, [JSON.stringify(packageDetails || {})])

	const [userToken, setUserToken] = useRecoilState(userTokenAtom)
	const [isBookModalOpen, setIsBookModalOpen] = useRecoilState(isBookModalOpenAtom)
	const { updateUser, loading } = useUser()


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
						onBookClick={() => setPaymentInfoModalIsOpen(true)}
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

			<ReactModal
				isOpen={paymentInfoModalIsOpen}
				onRequestClose={() => setPaymentInfoModalIsOpen(false)}
				ariaHideApp={false}
			>
				<div className="flex space-between m-b-16">
					<div className="modal-title font-bold">{t('book')}</div>
					<button onClick={() => setPaymentInfoModalIsOpen(false)}>
						<img src="/images/close.svg" alt=""/>
					</button>
				</div>
				<div className="payment-info-modal">
					<div className="payment-info-text">
						{t('bookingRegisterText', {
							// percent: under21DaysFromNow ? 100 : 50,
							paymentAmount: numberWithCommaNormalizer(
								under21DaysFromNow
									? currentOfferPackage?.[PackagesFields.price]
									: Math.ceil(((currentOfferPackage?.[PackagesFields.price] || 1) * 50) / 100)
							)
						})}
					</div>
					<HStack mt="2" spacing="2">
						<img src="/images/visa.svg" alt=""/>
						<img src="/images/arca.svg" alt=""/>
						<img src="/images/master.svg" alt=""/>
					</HStack>
				</div>
				<div className="modal-buttons text-right p-t-16">
					<button
						className="btn-outline btn-modal m-r-8 close_disclaimer"
						onClick={() => setPaymentInfoModalIsOpen(false)}
					>
						{t('close')}
					</button>
					<button className="btn-main btn-modal continue_disclaimer" onClick={onPaymentInfoModalContinue}>
						{t('continue')}
					</button>
				</div>
			</ReactModal>

			<ReactModal
				isOpen={registerModalIsOpen}
				ariaHideApp={false}
				onRequestClose={() => setRegisterModalIsOpen(false)}
			>
				<div className="flex space-between m-b-16">
					<div className="modal-title font-bold">{t`signUp`}</div>
					<button onClick={() => setRegisterModalIsOpen(false)} className="close_signup">
						<img src="/images/close.svg" alt=""/>
					</button>
				</div>
				<div className="register-wrapper p-t-32 p-b-16">
					<GoogleLogin
						onSuccess={(data) => {
							setUserToken(data.credential!)
							updateUser(data.credential!, () => {
								setRegisterModalIsOpen(false)
								setIsBookModalOpen(true)
							})
						}}
						onError={() => {
							console.error('Login Failed')
							setUserToken('')
						}}
						containerProps={{ className: 'sign_in_button' }}
						// containerProps={{ style: { width: '100%' } }}
					/>
				</div>
			</ReactModal>

			<Modal
				isOpen={isBookModalOpen}
				onClose={() => setIsBookModalOpen(false)}
				title="book"
			>
				<BookModal isLateCheckout={isLateCheckout}/>
			</Modal>
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

const PackageDetailsLayout = ({ children, ...props }: LayoutProps) => {
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

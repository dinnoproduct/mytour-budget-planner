import usePackages from '../hooks/usePackages.ts'
import { useEffect, useState } from 'react'
import { useRecoilState, useResetRecoilState } from 'recoil'
import { Link as ReactLink, useParams } from 'react-router-dom'
import { useLanguageNavigate } from '../../../hooks/useLanguageNavigate'
import { useTranslation } from 'react-i18next'
import ImageSlider from '../../../components/ImageSlider/ImageSlider.tsx'
import { PackagesFields, PackagesNestedFields } from '../data/packagesEnums.ts'
import { langKeyAdapter } from '../../../utils/normalizers.ts'

import PackageTravelDetails from '../components/PackageTravelDetails/PackageTravelDetails.tsx'
import PackageDescription from '../components/PackageDescription/PackageDescription.tsx'
import FlightDetails from '../components/FlightDetails/FlightDetails.tsx'
import HotelDetails from '../components/HotelDetails/HotelDetails.tsx'
import Grades from '../components/Grades/Grades.tsx'
import AdditionalDetails from '../components/AdditionalDetails/AdditionalDetails.tsx'
import Organization from '../components/Organization/Organization.tsx'
import {
	isBookModalOpenAtom,
	noResultModalIsOpenAtom,
	packageDetailsAtom,
	packageTravelDetailsAtom,
	packageTravelDetailsModalShowAtom
} from '../store/store.ts'
import Loader from '../../../components/Loader/Loader.tsx'
import PackageTravelDetailsModal from '../components/PackageTravelDetailsModal/PackageTravelDetailsModal.tsx'
import ReactModal from 'react-modal'
import './index.scss'

import BookModal from '../components/BookModal/BookModal.tsx'
import Modal from '../../../components/Modal/Modal.tsx'
import { Header } from '@widgets/Header'
import { Img, Link } from '@chakra-ui/react'
import { usePackagesSearchContext } from '@entities/package'

const PackageDetails = () => {
	const { t, i18n } = useTranslation()
	const { id } = useParams()
	const { navigateBack, navigateToHome } = useLanguageNavigate()
	const { packageDetails, loading } = usePackages(+id!)
	const { filteredPackages } = usePackagesSearchContext()

	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [isBookModalOpen, setIsBookModalOpen] = useRecoilState(isBookModalOpenAtom)

	const [noResultModalIsOpen, setNoResultIsOpen] = useRecoilState(noResultModalIsOpenAtom)
	const [packageTravelDetailsModalShow, setPackageTravelDetailsModalShow] = useRecoilState(
		packageTravelDetailsModalShowAtom
	)

	const resetPackageDetails = useResetRecoilState(packageDetailsAtom)
	const resetPackageTravelDetails = useResetRecoilState(packageTravelDetailsAtom)

	const correctedTypeLanguage = i18n.language as keyof typeof langKeyAdapter
	const name = `name${langKeyAdapter[correctedTypeLanguage]}` as PackagesFields.nameArm

	useEffect(
		() => () => {
			resetPackageDetails()
			resetPackageTravelDetails()
		},
		[]
	)

	useEffect(() => {
		if (!packageDetails?.[PackagesFields.offerId] && !loading) {
			handleBackClick()
		}
	}, [packageDetails, loading])

	const handleBackClick = () => {
		if (filteredPackages?.length) {
			navigateBack()
		} else {
			navigateToHome({ replace: true })
		}
	}

	return (
		<>
			{/*<button onClick={login}>sign in</button>*/}
			<Loader loading={loading}/>
			<Header/>
			<ReactModal
				isOpen={noResultModalIsOpen}
				onRequestClose={() => {
					setIsEditModalOpen(false)
					setNoResultIsOpen(false)
				}}
				ariaHideApp={false}
			>
				<div className="flex space-between m-b-40">
					<div className="modal-title font-bold">{t('edit')}</div>
					<button
						onClick={() => {
							setIsEditModalOpen(false)
							setNoResultIsOpen(false)
						}}
					>
						<img src="/images/close.svg" alt=""/>
					</button>
				</div>
				<div className="text-center m-b-40">
					<div className="no-result-image">
						<img src="/images/no_result.svg" alt=""/>
					</div>
					<div className="no-result-text">{t('noDataWithThisParams')}</div>
				</div>
				<div className="text-right p-t-16">
					<button
						className="btn-main btn-modal"
						onClick={() => {
							setNoResultIsOpen(false)
							setPackageTravelDetailsModalShow(true)
						}}
					>
						{t('continueEditing')}
					</button>
				</div>
			</ReactModal>
			<div className="container">
				<div className="back-to-home flex">
					<Link
						onClick={handleBackClick}
						display="flex"
						_hover={{ textDecoration: 'none' }}
					>
						<Img src="/images/arrow_back.svg" alt="" mr="2"/>
						{t('back')}
					</Link>
				</div>
				<div className="flex details-name">
					<div>{packageDetails[name]}</div>
					<div className="details-stars flex">
						<div className="stars flex space-between">
							<img src="/images/star.svg" alt=""/> {packageDetails[PackagesFields.hotel]?.[PackagesFields.stars]}
						</div>
					</div>
				</div>
				<div className="details-place">
					{packageDetails[PackagesFields.city]?.[PackagesNestedFields.country][name]},{' '}
					{packageDetails[PackagesFields.city]?.[name]}
				</div>
				<div className="best-offer-wrapper inner-wrapper flex">
					<div className="inner-slider-item">
						<ImageSlider images={packageDetails?.[PackagesFields.hotel]?.[PackagesFields.images]}/>
					</div>
					<div className="inner-slider-item">
						<PackageTravelDetails
							onEditModalOpen={() => setIsEditModalOpen(true)}
							onBookModalOpen={() => setIsBookModalOpen(true)}
						/>
					</div>
				</div>
				<div className="best-offer-wrapper inner-wrapper flex mobile-inner">
					<div className="details-info-item position-relative">
						<PackageDescription/>
						<FlightDetails/>
					</div>
					<div className="details-info-item">
						<HotelDetails/>
						<Grades/>
						<AdditionalDetails/>
					</div>
				</div>
				<Modal
					isOpen={isEditModalOpen}
					onClose={() => {
						if (!noResultModalIsOpen) {
							setIsEditModalOpen(false)
						}
					}}
				>
					<PackageTravelDetailsModal onClose={() => setIsEditModalOpen(false)}/>
				</Modal>
				<Modal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} title="book">
					<BookModal/>
				</Modal>
				<div className="best-offer-wrapper inner-wrapper flex">
					<Organization/>
				</div>
			</div>
		</>
	)
}

export default PackageDetails

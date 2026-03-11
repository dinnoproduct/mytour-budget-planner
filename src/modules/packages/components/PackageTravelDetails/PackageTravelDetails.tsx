import { useState, type FC } from 'react'
import Modal from 'react-modal'
import { GoogleLogin } from '@react-oauth/google'
import { dateFormatter, numberWithCommaNormalizer } from '../../../../utils/normalizers.ts'
import { PackagesFields } from '../../data/packagesEnums.ts'
import { useTranslation } from 'react-i18next'
import useDictionary from '../../hooks/useDictionary.ts'
import { DictionaryTypes } from '../../data/dictionaryEnum.ts'
import useDictionaryByKey from '../../hooks/useDictionaryByKey.ts'
import { useRecoilState, useRecoilValue } from 'recoil'
import { isBookModalOpenAtom, packageDetailsAtom, userTokenAtom } from '../../store/store.ts'
import './index.scss'
import useUser from '../../hooks/useUser.ts'
import { Loader } from '@/components/Loader/Loader'
import { overDaysFromNow } from '../../../../utils/methods.ts'
import { Button } from '@ui'
import { HStack, Img } from '@chakra-ui/react'

interface IPackageTravelDetails {
	onEditModalOpen: () => void;
	onBookModalOpen: () => void;
}

const PackageTravelDetails: FC<IPackageTravelDetails> = ({ onEditModalOpen, onBookModalOpen }) => {
	const packageDetails = useRecoilValue(packageDetailsAtom)
	const [userToken, setUserToken] = useRecoilState(userTokenAtom)
	const [isBookModalOpen, setIsBookModalOpen] = useRecoilState(isBookModalOpenAtom)

	const under21DaysFromNow = !overDaysFromNow(
		packageDetails?.[PackagesFields.destinationFlight]?.[PackagesFields.departureDate],
		21
	)

	const { updateUser, loading } = useUser()

	const { t } = useTranslation()
	useDictionary(DictionaryTypes.RoomTypeDictionary)

	const roomType = useDictionaryByKey(packageDetails[PackagesFields.roomType], DictionaryTypes.RoomTypeDictionary)

	const [paymentInfoModalIsOpen, setPaymentInfoModalIsOpen] = useState(false)
	const [registerModalIsOpen, setRegisterModalIsOpen] = useState(false)

	const onPaymentInfoModalContinue = () => {
		setPaymentInfoModalIsOpen(false)
		setRegisterModalIsOpen(true)
	}

	return (
		<div className="travel-details-wrapper">
			<Loader loading={loading}/>
			<Modal
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
					<div className="payment-info-title font-bold m-b-8">{t('attention')}</div>
					<div className="payment-info-text">
						{t('forBookingYouNeed', {
							percent: under21DaysFromNow ? 100 : 50,
							amount: numberWithCommaNormalizer(
								under21DaysFromNow
									? packageDetails[PackagesFields.price]
									: Math.ceil((packageDetails[PackagesFields.price] * 50) / 100)
							)
						})}
					</div>
					{/*{!under21DaysFromNow ? (*/}
					{/*  <div className="payment-info-text">*/}
					{/*    {t('cancelUntil', {*/}
					{/*      date: dateFormatter(*/}
					{/*        getDateMinusDays(*/}
					{/*          packageDetails?.[PackagesFields.destinationFlight]?.[PackagesFields.departureDate],*/}
					{/*          31,*/}
					{/*        ),*/}
					{/*      ),*/}
					{/*    })}*/}
					{/*  </div>*/}
					{/*) : null}*/}
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
			</Modal>
			<Modal isOpen={registerModalIsOpen} ariaHideApp={false} onRequestClose={() => setRegisterModalIsOpen(false)}>
				<div className="flex space-between m-b-16">
					<div className="modal-title font-bold">{t('register')}</div>
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
			</Modal>
			<div className="travel-details-title font-bold">{t('details')}</div>
			<div className="detail-info-item flex space-between">
				<div className="details-info-name">{t('price')}</div>
				<div className="details-info-value">{numberWithCommaNormalizer(packageDetails[PackagesFields.price])}֏</div>
			</div>
			<div className="detail-info-item flex space-between">
				<div className="details-info-name">{t('travelers')}</div>
				<div className="details-info-value">
					{packageDetails[PackagesFields.adultTravelers]} {t('adult')}
					{packageDetails[PackagesFields.childrenTravelers] ? (
						<>
							, {packageDetails[PackagesFields.childrenTravelers]} {t('child')}
						</>
					) : null}{' '}
				</div>
			</div>
			<div className="detail-info-item flex space-between">
				<div className="details-info-name">{t('room')}</div>
				<div className="details-info-value">{roomType}</div>
			</div>
			<div className="detail-info-item last flex space-between">
				<div className="details-info-name">{t('days')}</div>
				<div className="details-info-value">
					{dateFormatter(packageDetails?.[PackagesFields.destinationFlight]?.[PackagesFields.departureDate])} -{' '}
					{dateFormatter(packageDetails?.[PackagesFields.returnFlight]?.[PackagesFields.departureDate])} (
					{packageDetails[PackagesFields.nights]} {t('night')})
				</div>
			</div>
			<div className="details-buttons">
				<button className="btn-edit edit_description" onClick={onEditModalOpen}>
					<Img src="/images/edit.svg" alt="" mr="2"/> <span>{t('edit')}</span>
				</button>
				<button className="btn-book book_description" onClick={() => setPaymentInfoModalIsOpen(true)}>
					{t('reserve')}
				</button>
			</div>
		</div>
	)
}

export default PackageTravelDetails

import { useTranslation } from 'react-i18next'
import { CustomFields, PackagesFields } from '../../data/packagesEnums.ts'
import {
  useForm,
  FormProvider,
  useFieldArray,
  type FieldValues,
  useWatch
} from 'react-hook-form'
import MPatternFormatInput from '../../../../components/FormControls/MPatternFormatInput/MPatternFormatInput.tsx'
import MInput from '../../../../components/FormControls/MInput/MInput.tsx'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { packageTravelDetailsAtom, userInfoAtom } from '../../store/store.ts'
import MDatePicker from '../../../../components/FormControls/MDatePicker/MDatePicker.tsx'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import MCheckbox from '../../../../components/FormControls/MCheckbox/MCheckbox.tsx'
import { bookFirstTabScheme, bookSecondTabScheme } from '../../scheme/scheme.ts'
import { yupResolver } from '@hookform/resolvers/yup'
import BookModalReview from '../BookModalReview/BookModalReview.tsx'
import { type IBookForm, type ITraveler } from '../../data/packagesTypes.ts'
import { overDaysFromNow } from '../../../../utils/methods.ts'
import useBook from '../../hooks/useBook.ts'
import { Loader } from '@/components/Loader/Loader'
import { ALPHABETIC_REGEXP } from '../../../../utils/regex.ts'
import 'react-tabs/style/react-tabs.css'
import './index.scss'
import { useGetCurrentOfferPackage } from '@entities/package'

const BookModal = ({ isLateCheckout }: { isLateCheckout?: boolean }) => {
  const { t } = useTranslation()

  const { loading, bookPackage } = useBook()

  const packageDetails = useGetCurrentOfferPackage()
  const packageTravelDetails = useRecoilValue(packageTravelDetailsAtom)
  const userInfo = useRecoilValue(userInfoAtom)

  const under21DaysFromNow = !overDaysFromNow(
    packageDetails?.[PackagesFields.destinationFlight]?.[
      PackagesFields.departureDate
    ] as string,
    21
  )

  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [activeTabs, setActiveTabs] = useState('1')
  const [payFullPrice, setPayFullPrice] = useState(under21DaysFromNow)

  const firstStepFormData = useForm({
    resolver: yupResolver(bookFirstTabScheme),
    defaultValues: {
      [CustomFields.phoneNumber]: '',
      [CustomFields.email]: '',
      [PackagesFields.adults]: [],
      [PackagesFields.childs]: []
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })

  const secondStepFormData = useForm({
    resolver: yupResolver(
      bookSecondTabScheme(
        packageDetails?.[PackagesFields.price] || 1,
        payFullPrice
      )
    ),
    defaultValues: {
      [PackagesFields.amountToBePaid]: '',
      [CustomFields.payFullPrice]: under21DaysFromNow
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })

  const {
    reset: firstStepReset,
    control: firstStepControl,
    handleSubmit: firstStepHandleSubmit,
    setValue: setFirstStepValue
  } = firstStepFormData

  const {
    handleSubmit: secondStepHandleSubmit,
    control: secondStepControl,
    setValue: setSecondStepValue,
    formState: { errors: secondStepErrors }
  } = secondStepFormData

  const { fields: adultsFields } = useFieldArray({
    control: firstStepControl,
    name: PackagesFields.adults
  })

  const { fields: childsFileds } = useFieldArray({
    control: firstStepControl,
    name: PackagesFields.childs
  })

  const firstStepFields = useWatch({ control: firstStepControl })

  const amountToBePaid = useWatch({
    control: secondStepControl,
    name: PackagesFields.amountToBePaid
  })

  useEffect(() => {
    setActiveTabs('1')
  }, [firstStepFields])

  useEffect(() => {
    if (userInfo.email) {
      setFirstStepValue(CustomFields.email, userInfo.email)
    }
  }, [userInfo])

  useEffect(() => {
    if (!packageDetails) {
      return
    }

    setSecondStepValue(
      PackagesFields.amountToBePaid,
      payFullPrice || under21DaysFromNow
        ? packageDetails[PackagesFields.price].toString()
        : Math.ceil(
            (packageDetails[PackagesFields.price] * 50) / 100
          ).toString()
    )
  }, [payFullPrice, under21DaysFromNow])

  useEffect(() => {
    const adults = Array(packageDetails?.[PackagesFields.adultTravelers])
      .fill(null)
      .map(() => ({
        [PackagesFields.firstName]: '',
        [PackagesFields.lastName]: '',
        [PackagesFields.birthDate]: ''
      }))

    const childs = Array(
      (packageDetails?.childrenTravelers || 0) +
        (packageDetails?.infantTravelers || 0)
    )
      .fill(null)
      .map(() => ({
        [PackagesFields.firstName]: '',
        [PackagesFields.lastName]: '',
        [PackagesFields.birthDate]: ''
      }))

    firstStepReset(prevState => ({
      ...prevState,
      [PackagesFields.adults]: adults,
      [PackagesFields.childs]: childs
    }))
  }, [packageDetails, packageTravelDetails])

  const onFirstStepSubmit = (data: FieldValues) => {
    setActiveTabs('12')
    setSelectedTabIndex(1)
  }

  const onSecondStepSubmit = (data: FieldValues) => {
    setActiveTabs('123')
    setSelectedTabIndex(2)
  }

  const onBook = () => {
    if (!packageDetails) {
      return
    }

    bookPackage({
      [CustomFields.cityId]:
        packageDetails[PackagesFields.city][PackagesFields.id],
      [PackagesFields.price]: packageDetails[PackagesFields.price],
      [CustomFields.hotelId]:
        packageDetails[PackagesFields.hotel][PackagesFields.id],
      [CustomFields.startDate]:
        packageDetails[PackagesFields.destinationFlight][
          PackagesFields.departureDate
        ],
      [CustomFields.endDate]:
        packageDetails[PackagesFields.returnFlight][
          PackagesFields.departureDate
        ],
      [CustomFields.travelAgencyId]:
        packageDetails[PackagesFields.travelAgency][PackagesFields.id],
      [CustomFields.notes]: '',
      [PackagesFields.offerId]: packageDetails[PackagesFields.offerId],
      [CustomFields.destinationFlightId]:
        packageDetails[PackagesFields.destinationFlight][PackagesFields.id],
      [CustomFields.returnFlightId]:
        packageDetails[PackagesFields.returnFlight][PackagesFields.id],
      [PackagesFields.roomType]: packageDetails[PackagesFields.roomType],
      [CustomFields.email]: firstStepFields[CustomFields.email]!,
      [CustomFields.phoneNumber]: firstStepFields[CustomFields.phoneNumber]!,
      [PackagesFields.amountToBePaid]: +amountToBePaid,
      [PackagesFields.usdRate]: packageDetails[PackagesFields.usdRate],
      [CustomFields.travelers]: [
        ...(firstStepFields.adults as ITraveler[]).map(adult => ({
          [PackagesFields.dateOfBirth]: adult[PackagesFields.birthDate],
          [PackagesFields.firstName]: adult[PackagesFields.firstName],
          [PackagesFields.lastName]: adult[PackagesFields.lastName]
        })),
        ...(firstStepFields.childs as ITraveler[]).map(child => ({
          [PackagesFields.dateOfBirth]: child[PackagesFields.birthDate],
          [PackagesFields.firstName]: child[PackagesFields.firstName],
          [PackagesFields.lastName]: child[PackagesFields.lastName]
        }))
      ]
    })
  }

  return (
    <Tabs selectedIndex={selectedTabIndex} onSelect={setSelectedTabIndex}>
      <Loader loading={loading} />
      <TabList>
        <Tab>{t('book')}</Tab>
        {!under21DaysFromNow ? (
          <Tab disabled={!activeTabs.includes('2')}>{t('payment')}</Tab>
        ) : null}
        <Tab disabled={!activeTabs.includes(!under21DaysFromNow ? '3' : '2')}>
          {t('dataCheck')}
        </Tab>
      </TabList>
      <TabPanel>
        <FormProvider {...firstStepFormData}>
          <form onSubmit={firstStepHandleSubmit(onFirstStepSubmit)}>
            <div>
              <div>
                <div className="modal-subtitle font-bold">{t('buyer')}*</div>
                <div className="tablet-flex">
                  <div className="m-b-4 tablet-half-item">
                    <MPatternFormatInput
                      name={CustomFields.phoneNumber}
                      label={t('phoneNumber')}
                      format="+374 ## ## ## ##"
                    />
                  </div>
                  <div className="tablet-half-item">
                    <MInput name={CustomFields.email} label={t('email')} />
                  </div>
                </div>
              </div>
              {adultsFields.map((item, index) => (
                <div key={item.id} className="m-t-28">
                  <div className="modal-subtitle font-bold capitalize">
                    {t('adult')} {index + 1}*
                  </div>
                  <div className="tablet-flex">
                    <div className="tablet-half-item">
                      <div className="m-b-4">
                        <MInput
                          name={`${PackagesFields.adults}.${index}.firstName`}
                          placeholder={t('writeNameLatinWords')}
                          regexp={ALPHABETIC_REGEXP(0, 30)}
                        />
                      </div>
                    </div>
                    <div className="tablet-half-item">
                      <div>
                        <MInput
                          name={`${PackagesFields.adults}.${index}.lastName`}
                          placeholder={t('writeSurnameLatinWords')}
                          regexp={ALPHABETIC_REGEXP(0, 30)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="tablet-flex">
                    <div className="tablet-half-item">
                      <MDatePicker
                        name={`${PackagesFields.adults}.${index}.birthDate`}
                        placeholderText={t('dateOfBirth')}
                        maxDate={
                          new Date(
                            new Date().setFullYear(
                              new Date().getFullYear() -
                                (packageDetails?.[PackagesFields.childMaxAge] ||
                                  1) +
                                1
                            )
                          )
                        }
                      />
                    </div>
                    <div className="tablet-half-item"></div>
                  </div>
                </div>
              ))}
              {childsFileds.map((item, index) => (
                <div key={item.id} className="m-t-28">
                  <div className="modal-subtitle font-bold capitalize">
                    {t('child')} {index + 1}*
                  </div>
                  <div className="m-b-4">
                    <MInput
                      name={`${PackagesFields.childs}.${index}.firstName`}
                      placeholder={t('name')}
                      regexp={ALPHABETIC_REGEXP(0, 30)}
                    />
                  </div>
                  <div>
                    <MInput
                      name={`${PackagesFields.childs}.${index}.lastName`}
                      placeholder={t('surname')}
                      regexp={ALPHABETIC_REGEXP(0, 30)}
                    />
                  </div>
                  <div>
                    <MDatePicker
                      name={`${PackagesFields.childs}.${index}.birthDate`}
                      placeholderText={t('dateOfBirth')}
                      minDate={
                        new Date(
                          new Date().setFullYear(
                            new Date().getFullYear() -
                              (packageDetails?.[PackagesFields.childMaxAge] ||
                                1)
                          )
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button
                className="btn-main choose-room continue_personal_dretails"
                type="submit"
              >
                {t('continue')}
              </button>
            </div>
          </form>
        </FormProvider>
      </TabPanel>
      {!under21DaysFromNow ? (
        <TabPanel>
          <FormProvider {...secondStepFormData}>
            <form onSubmit={secondStepHandleSubmit(onSecondStepSubmit)}>
              <div className="payment-wrapper">
                <div
                  className="modal-back flex m-b-24 cursor"
                  onClick={() => setSelectedTabIndex(0)}
                >
                  <img className="m-r-8" src="/images/icon_back.svg" alt="" />
                  <span>{t('back')}</span>
                </div>
                <div className="payment-price position-relative m-b-32">
                  <MPatternFormatInput
                    name={PackagesFields.amountToBePaid}
                    label={t('amount')}
                    numericFormat
                    disabled={payFullPrice || under21DaysFromNow}
                  />
                  <img className="dram-icon" src="/images/dram.svg" alt="" />
                  {!secondStepErrors[PackagesFields.amountToBePaid]?.message ? (
                    <div className="payment-price-info">
                      {t('minPrePaymentText', {
                        percent: payFullPrice || under21DaysFromNow ? 100 : 50
                      })}
                    </div>
                  ) : null}
                </div>
                <div>
                  <MCheckbox
                    className="flex m-b-10"
                    label={t('payInFull')}
                    name={CustomFields.payFullPrice}
                    customOnChange={setPayFullPrice}
                    disabled={under21DaysFromNow}
                  />
                </div>
                <div className="payment-info-text">{t`partialPaymentText`}</div>
                <div className="modal-footer">
                  <button className="btn-main choose-room continue_pay">
                    {t('continue')}
                  </button>
                </div>
              </div>
            </form>
          </FormProvider>
        </TabPanel>
      ) : null}
      <TabPanel>
        <BookModalReview
          travelersInfo={firstStepFields as IBookForm}
          amountToBePaid={amountToBePaid}
          isLateCheckout={isLateCheckout}
          onBack={() => setSelectedTabIndex(!under21DaysFromNow ? 1 : 0)}
          onBook={onBook}
        />
      </TabPanel>
    </Tabs>
  )
}

export default BookModal

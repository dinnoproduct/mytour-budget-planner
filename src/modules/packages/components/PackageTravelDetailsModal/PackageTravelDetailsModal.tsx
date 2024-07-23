import { type FC, type MutableRefObject, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MDatePicker from '../../../../components/FormControls/MDatePicker/MDatePicker.tsx';
import { type FieldValues, FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { CustomFields, DictionaryFields, PackagesFields } from '../../data/packagesEnums.ts';
import 'react-datepicker/dist/react-datepicker.css';
import useFlight from '../../hooks/useFlight.ts';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  dictionaryAtom,
  noResultModalIsOpenAtom,
  packageDetailsAtom,
  packageTravelDetailsAtom,
  packageTravelDetailsModalShowAtom,
  screenBreakpointAtom,
} from '../../store/store.ts';
import MSelect from '../../../../components/FormControls/MSelect/MSelect.tsx';
import { formatDateAndTime, numberWithCommaNormalizer } from '../../../../utils/normalizers.ts';
import { type IFlight, type IGeneratedOffer, type IPackageTravelDetails } from '../../data/packagesTypes.ts';
import MCheckbox from '../../../../components/FormControls/MCheckbox/MCheckbox.tsx';
import MNumberSpinner from '../../../../components/FormControls/MNumberSpinner/MNumberSpinner.tsx';
import { yupResolver } from '@hookform/resolvers/yup';
import { packageEditScheme } from '../../scheme/scheme.ts';
import useOffer from '../../hooks/useOffer.ts';
import './index.scss';
import { DictionaryTypes } from '../../data/dictionaryEnum.ts';
import Loader from '../../../../components/Loader/Loader.tsx';
import { calculateAge } from '../../../../utils/methods.ts';
import { toast } from 'react-toastify';

const PackageTravelDetailsModal: FC<{ onClose: () => void; modalRef?: MutableRefObject<HTMLElement> }> = ({
  onClose,
  modalRef,
}) => {
  const { t } = useTranslation();
  const {
    getAvailableFlights,
    getReturnFlights,
    getFlightsByDate,
    availableFlights,
    returnFlights,
    flightsByDate,
    returnFlightLoading,
  } = useFlight();
  const { generateOffers, generatedOffers, loading } = useOffer();

  const [packageTravelDetails, setPackageTravelDetails] = useRecoilState(packageTravelDetailsAtom);
  const [packageDetails, setPackageDetails] = useRecoilState(packageDetailsAtom);
  const [packageTravelDetailsModalShow, setPackageTravelDetailsModalShow] = useRecoilState(
    packageTravelDetailsModalShowAtom,
  );

  const setNoResultIsOpen = useSetRecoilState(noResultModalIsOpenAtom);

  const dictionary = useRecoilValue(dictionaryAtom(DictionaryTypes.RoomTypeDictionary));
  const screenBreakpoint = useRecoilValue(screenBreakpointAtom);

  const [modalStep, setModalStep] = useState(1);
  const [selectedOffer, setSelectedOffer] = useState<Partial<IGeneratedOffer>>({});

  const formData = useForm({
    resolver: yupResolver(packageEditScheme),
    defaultValues: {
      [CustomFields.destinationFlightDate]: '',
      [CustomFields.returnFlightDate]: '',
      [PackagesFields.destinationFlight]: {},
      [PackagesFields.returnFlight]: {},
      [PackagesFields.lateCheckout]: false,
      [PackagesFields.adults]: 0,
      [CustomFields.childrenUnderTwoYears]: 0,
      [CustomFields.childrenOverTwoYears]: 0,
      [PackagesFields.childs]: [],
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const { handleSubmit, control, reset, watch, setValue, formState } = formData;

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-ignore
    name: PackagesFields.childs,
  });

  const returnFlight = useWatch({ control, name: PackagesFields.returnFlight });

  const availableFlightDates = useMemo(
    () => availableFlights.map((flight) => new Date(flight[PackagesFields.departureDate])),
    [availableFlights],
  );

  const returnFlightDates = useMemo(
    () => returnFlights.map((flight) => new Date(flight[PackagesFields.departureDate])),
    [returnFlights],
  );

  const returnFlightOptions = useMemo(
    () =>
      returnFlights
        .filter(
          (flight) =>
            formatDateAndTime(new Date(flight[PackagesFields.departureDate])) ===
            formatDateAndTime(new Date(returnFlight[PackagesFields.departureDate as keyof typeof returnFlight])),
        )
        .map((flight) => ({
          ...flight,
          value: flight[PackagesFields.departureDate],
          label: formatDateAndTime(new Date(flight[PackagesFields.departureDate]), { onlyTime: true }),
        })),
    [returnFlight, returnFlights],
  );

  const destinationFlightOptions = useMemo(
    () =>
      flightsByDate.map((flight) => ({
        ...flight,
        value: flight[PackagesFields.departureDate],
        label: formatDateAndTime(new Date(flight[PackagesFields.departureDate]), { onlyTime: true }),
      })),
    [flightsByDate],
  );

  const onDestinationFlightDateChange = (date: string) => {
    setValue(CustomFields.returnFlightDate, '');
    setValue(PackagesFields.returnFlight, {});

    const destinationFlight = availableFlights.find((flight) =>
      flight[PackagesFields.departureDate].includes(date.split('T')[0]),
    ) as IFlight;

    setValue(PackagesFields.destinationFlight, {
      ...destinationFlight,
      value: destinationFlight[PackagesFields.departureDate],
      label: formatDateAndTime(new Date(destinationFlight[PackagesFields.departureDate]), { onlyTime: true }),
    });

    getReturnFlights(destinationFlight[PackagesFields.id]);

    getFlightsByDate({
      date: formatDateAndTime(new Date(destinationFlight[PackagesFields.departureDate])),
      [PackagesFields.travelAgency]: packageDetails[PackagesFields.travelAgency][PackagesFields.id],
      [PackagesFields.city]: packageDetails[PackagesFields.city][PackagesFields.id],
    });
  };

  const onReturnFlightDateChange = (date: string) => {
    const returnFlight = returnFlights.find(
      (flight) =>
        formatDateAndTime(new Date(flight[PackagesFields.departureDate])) === formatDateAndTime(new Date(date)),
    ) as IFlight;

    setValue(PackagesFields.returnFlight, {
      ...returnFlight,
      value: returnFlight[PackagesFields.departureDate],
      label: formatDateAndTime(new Date(returnFlight[PackagesFields.departureDate]), { onlyTime: true }),
    });
  };

  useEffect(() => {
    if (Object.keys(packageDetails).length) {
      getAvailableFlights(
        packageDetails[PackagesFields.travelAgency][PackagesFields.id],
        packageDetails[PackagesFields.city][PackagesFields.id],
      );

      getReturnFlights(packageDetails[PackagesFields.destinationFlight][PackagesFields.id]);

      getFlightsByDate({
        date: formatDateAndTime(
          new Date(packageDetails[PackagesFields.destinationFlight][PackagesFields.departureDate]),
        ),
        [PackagesFields.travelAgency]: packageDetails[PackagesFields.travelAgency][PackagesFields.id],
        [PackagesFields.city]: packageDetails[PackagesFields.city][PackagesFields.id],
      });
      const destinationFlight =
        packageTravelDetails[PackagesFields.destinationFlight] || packageDetails[PackagesFields.destinationFlight];

      const returnFlight =
        packageTravelDetails[PackagesFields.returnFlight] || packageDetails[PackagesFields.returnFlight];

      reset((prevValue) => ({
        ...prevValue,
        [CustomFields.destinationFlightDate]: destinationFlight[PackagesFields.departureDate],
        [CustomFields.returnFlightDate]: returnFlight[PackagesFields.departureDate],
        [PackagesFields.destinationFlight]: {
          ...destinationFlight,
          value: destinationFlight[PackagesFields.departureDate],
          label: formatDateAndTime(new Date(destinationFlight[PackagesFields.departureDate]), {
            onlyTime: true,
          }),
        },
        [PackagesFields.returnFlight]: {
          ...returnFlight,
          value: returnFlight[PackagesFields.departureDate],
          label: formatDateAndTime(new Date(returnFlight[PackagesFields.departureDate]), {
            onlyTime: true,
          }),
        },
        [PackagesFields.lateCheckout]: packageTravelDetails[PackagesFields.lateCheckout] || false,
        [PackagesFields.adults]:
          packageTravelDetails[PackagesFields.adults] || packageDetails[PackagesFields.adultTravelers],
        [CustomFields.childrenUnderTwoYears]: packageTravelDetails[CustomFields.childrenUnderTwoYears] ?? 0,
        [CustomFields.childrenOverTwoYears]: packageTravelDetails[CustomFields.childrenOverTwoYears] ?? 0,
        [PackagesFields.childs]: packageTravelDetails[PackagesFields.childs],
      }));
    }
  }, [packageDetails, packageTravelDetails]); //TODO find why there is error without packageTravelDetails in deps
  // }, [packageDetails, packageTravelDetails]);

  useEffect(() => {
    if (generatedOffers.length) {
      setSelectedOffer(generatedOffers[0]);
    } else setSelectedOffer({});
  }, [generatedOffers]);

  useEffect(() => {
    if (modalStep === 1) {
      setSelectedOffer({});
    }
  }, [modalStep]);

  useEffect(() => {
    if (packageTravelDetailsModalShow) {
      if (modalRef?.current) {
        modalRef.current.style.display = 'block';
      }
    }
  }, [packageTravelDetailsModalShow]);

  const onSubmit = (values: FieldValues) => {
    const childrenUnderTwoYears = values[CustomFields.childrenUnderTwoYears]
      ? Array(values[CustomFields.childrenUnderTwoYears]).fill(1)
      : [];
    const childrenAgeOverTwoYears = values[PackagesFields.childs]
      ? values[PackagesFields.childs].map((date: { birthdate: string }) => calculateAge(new Date(date.birthdate)))
      : [];

    generateOffers(
      {
        [PackagesFields.lateCheckout]: values[PackagesFields.lateCheckout],
        [PackagesFields.adults]: values[PackagesFields.adults],
        [PackagesFields.flightId]: values[PackagesFields.destinationFlight][PackagesFields.id],
        [PackagesFields.returnFlightId]: values[PackagesFields.returnFlight][PackagesFields.id],
        [PackagesFields.hotelId]: packageDetails[PackagesFields.hotel][PackagesFields.id],
        [PackagesFields.childs]: [...childrenUnderTwoYears, ...childrenAgeOverTwoYears],
      },
      (data) => {
        if (!data.length) {
          setNoResultIsOpen(true);

          if (modalRef?.current) {
            modalRef.current.style.display = 'none';
          }

          setPackageTravelDetailsModalShow(false);
        } else {
          setModalStep(2);
        }
      },
    );
  };

  const CustomToast = () => (
    <div className="flex toast-success-wrapper">
      <img src="/images/checkmark.svg" alt="" />
      <span>{t('successfullyEdited')}</span>
    </div>
  );

  const onEditSave = () => {
    const values = watch() as FieldValues as IPackageTravelDetails;
    setPackageDetails((prevState) => ({
      ...prevState,
      [PackagesFields.adultTravelers]: values[PackagesFields.adults],
      [PackagesFields.childrenTravelers]:
        values[CustomFields.childrenOverTwoYears] + values[CustomFields.childrenUnderTwoYears],
      [PackagesFields.lateCheckout]: values[PackagesFields.lateCheckout],
      [PackagesFields.destinationFlight]: values[PackagesFields.destinationFlight],
      [PackagesFields.returnFlight]: values[PackagesFields.returnFlight],
      [PackagesFields.checkin]: selectedOffer[PackagesFields.checkin]!,
      [PackagesFields.checkout]: selectedOffer[PackagesFields.checkout]!,
      [PackagesFields.nights]: selectedOffer[PackagesFields.nights]!,
      [PackagesFields.offerId]: selectedOffer[PackagesFields.offerId]!,
      [PackagesFields.price]: selectedOffer[PackagesFields.price]!,
      [PackagesFields.roomType]: selectedOffer[PackagesFields.roomType]!,
    }));
    setPackageTravelDetails(values);
    setTimeout(() => {
      toast(<CustomToast />, {
        autoClose: 5000,
        hideProgressBar: true,
        position: 'top-right',
      });
    }, 500);
    onClose();
  };

  if (modalStep === 2) {
    return (
      <div>
        <div className="modal-tablet">
          <div onClick={() => setModalStep(1)} className="modal-back flex m-b-24 cursor">
            <img className="m-r-8" src="/images/icon_back.svg" alt="" />
            <span>{t('backToDetails')}</span>
          </div>
          <div className="flex space-between m-b-16">
            <div className="modal-subtitle font-bold">{t('rooms')}*</div>
            <div className="modal-subtitle font-bold">{t('packagePrice')}</div>
          </div>
          {generatedOffers.map((offer) => {
            const roomType =
              dictionary.find((item) => item[DictionaryFields.key] === offer[PackagesFields.roomType])?.[
                DictionaryFields.value
              ] ?? '';

            return (
              <div className="flex space-between room-type m-b-12" key={offer[PackagesFields.offerId]}>
                <div className="flex room-type-radio-wrapper cursor" onClick={() => setSelectedOffer(offer)}>
                  <input
                    className="m-r-8"
                    type="radio"
                    checked={offer[PackagesFields.offerId] === selectedOffer[PackagesFields.offerId]}
                  />
                  <span className="room-type-name">{roomType}</span>
                </div>
                <div className="room-price font-bold">
                  {numberWithCommaNormalizer(offer[PackagesFields.price])} <span>֏</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="modal-footer">
          <button className="btn-main choose-room confirm_room_edit" onClick={onEditSave}>
            {t('confirm')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...formData}>
      <Loader loading={loading || returnFlightLoading} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="modal-subtitle font-bold">{t('date')}*</div>
          <div className="datepickers flex space-between m-b-24">
            <div className="modal-half-item">
              <MDatePicker
                name={CustomFields.destinationFlightDate}
                label={t('startFrom')}
                includeDates={availableFlightDates}
                handleChange={onDestinationFlightDateChange}
                datePickerMenuToRight={screenBreakpoint === 'small'}
              />
            </div>
            <div className="modal-half-item">
              <MDatePicker
                name={CustomFields.returnFlightDate}
                label={t('until')}
                includeDates={returnFlightDates}
                handleChange={onReturnFlightDateChange}
                datePickerMenuToLeft={screenBreakpoint !== 'medium'}
              />
            </div>
          </div>
          <div className="flight-times m-b-24">
            <div className="modal-subtitle font-bold">{t('flightTime')}*</div>
            <div className="flex space-between">
              <div className="modal-half-item">
                <MSelect
                  label={t('departure')}
                  options={destinationFlightOptions}
                  name={PackagesFields.destinationFlight}
                  isDisabled={destinationFlightOptions.length < 2}
                />
              </div>
              <div className="modal-half-item">
                <MSelect
                  label={t('return')}
                  options={returnFlightOptions}
                  name={PackagesFields.returnFlight}
                  isDisabled={returnFlightOptions.length < 2}
                />
              </div>
            </div>
          </div>
          <MCheckbox
            className="modal-checkbox flex m-b-10"
            label={t('lateCheckoutFromHotel')}
            name={PackagesFields.lateCheckout}
          />
          <div className="late-checkout-text m-b-24">{t('lateCheckoutFromHotelDescription')}</div>
          <div className="modal-subtitle font-bold">{t('travelers')}*</div>
          <div className="flex space-between">
            <div className="m-b-20">
              <div className="travelers-title m-b-2">{t('adults')}</div>
              <div className="travelers-subtitle">
                {t('adultAge', { minAge: packageDetails[PackagesFields.childMaxAge] + 1 })}
              </div>
            </div>
            <MNumberSpinner name={PackagesFields.adults} minimumNumber={1} />{' '}
          </div>
          <div className="flex space-between">
            <div className="m-b-20">
              <div className="travelers-title m-b-2">{t('infants')}</div>
              <div className="travelers-subtitle">{t('upTo2Age')}</div>
            </div>
            <MNumberSpinner name={CustomFields.childrenUnderTwoYears} minimumNumber={0} />{' '}
          </div>
          <div className="flex space-between">
            <div className="m-b-20">
              <div className="travelers-title m-b-2">{t('children')}</div>
              <div className="travelers-subtitle">
                {t('from2Age', { maxAge: packageDetails[PackagesFields.childMaxAge] })}
              </div>
            </div>
            <MNumberSpinner
              name={CustomFields.childrenOverTwoYears}
              minimumNumber={0}
              handleChange={(value, type) => {
                if (type === 'minus') {
                  remove(fields.length - 1);
                } else append({ birthdate: '' });
              }}
            />{' '}
          </div>
          {fields.map((item, index) => (
            <div key={item.id} className="width-306">
              <MDatePicker
                label={t('birthDateCount', { number: index + 1 })}
                name={`${PackagesFields.childs}.${index}.birthdate`}
                maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 2))}
                minDate={
                  new Date(
                    new Date(new Date().setDate(new Date().getDate() + 1)).setFullYear(
                      new Date().getFullYear() - (packageDetails[PackagesFields.childMaxAge] + 1),
                    ),
                  )
                }
              />
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn-main choose-room select_room_edit" type="submit">
            {t('chooseRoom')}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default PackageTravelDetailsModal;

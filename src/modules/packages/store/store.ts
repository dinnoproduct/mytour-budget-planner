import { atom, atomFamily } from 'recoil';
import {
  type IGeneratedOffer,
  type IGeneratedMultivendorOffer,
  type IPackage,
  type IPackageTravelDetails,
  type TCities,
  type TFlights,
  type TPackages,
} from '../data/packagesTypes';
import { type TDictionary } from '../data/dictionaryTypes';
import { type DictionaryTypes } from '../data/dictionaryEnum';
import { type CustomFields } from '../data/packagesEnums';
import {
  type PackageEntity,
  type NormalizedRequestEntity,
  type GroupTourEntity,
} from '@entities/package';
import { type Travelers } from '@widgets/TravelersModal/ui/types';

export const packagesAtom = atom<TPackages>({
  key: 'packages',
  default: [],
});

export const filteredPackagesAtom = atom<TPackages>({
  key: 'filteredPackages',
  default: [],
});

export const packageDetailsAtom = atom<IPackage>({
  key: 'packageDetails',
  default: {} as IPackage,
});

export const packageTravelDetailsAtom = atom<IPackageTravelDetails>({
  key: 'packageTravelDetails',
  default: {} as IPackageTravelDetails,
});

export const citiesAtom = atom<TCities>({
  key: 'cities',
  default: [],
});

export const packagesCurrentPageAtom = atom<number>({
  key: 'packagesCurrentPage',
  default: 1,
});

export const availableFlightsAtom = atom<TFlights>({
  key: 'availableFlights',
  default: [],
});

export const returnFlightsAtom = atom<TFlights>({
  key: 'returnFlights',
  default: [],
});

export const flightByDateAtom = atom<TFlights>({
  key: 'flightByDate',
  default: [],
});

export const dictionaryAtom = atomFamily<TDictionary[DictionaryTypes][], DictionaryTypes>({
  key: 'dictionary',
  default: () => [],
});

export const isSubscribedAtom = atom<boolean>({
  key: 'subscribed',
  default: false,
});

export const generatedOffersAtom = atom<IGeneratedOffer[]>({
  key: 'generatedOffers',
  default: [],
});

export const generatedMultivendorOffersAtom = atom<IGeneratedMultivendorOffer[]>({
  key: 'generatedMultivendorOffers',
  default: [],
});

export const noResultModalIsOpenAtom = atom<boolean>({
  key: 'noResultModalIsOpen',
  default: false,
});

export const packageTravelDetailsModalShowAtom = atom<boolean>({
  key: 'packageTravelDetailsModalShow',
  default: true,
});

export const userTokenAtom = atom<string>({
  key: 'userToken',
  default: '',
});

export const isBookModalOpenAtom = atom<boolean>({
  key: 'isBookModalOpen',
  default: false,
});

export const isBookingFlowOpenAtom = atom<boolean>({
  key: 'isBookingFlowOpen',
  default: false,
});

export type BookingContext = {
  packageDetails: PackageEntity | null;
  childrenAges: number[];
  initialView: 'travelers' | 'payment';
  request?: NormalizedRequestEntity | null;
  defaultTravelers?: Travelers;
  isBooked?: boolean;
};

export const bookingContextAtom = atom<BookingContext | null>({
  key: 'bookingContext',
  default: null,
});

export const userInfoAtom = atom<Partial<{ [CustomFields.email]: string }>>({
  key: 'userInfo',
  default: {},
});

export const screenBreakpointAtom = atom<string>({
  key: 'screenBreakpoint',
  default: 'large'
});

export const selectedPackageAtom = atom<PackageEntity | null>({
  key: 'selectedPackage',
  default: null
});

export const preventSideModalCloseAtom = atom<boolean>({
  key: 'preventSideModalClose',
  default: false
});

export const preventParentSlideAtom = atom<boolean>({
  key: 'preventParentSlide',
  default: false,
});

export const bookingDrawerAtom = atom<{
  isOpen: boolean;
  selectedMealPlan: number;
  selectedRoomOffer: IGeneratedMultivendorOffer | null;
}>({
  key: 'bookingDrawer',
  default: {
    isOpen: false,
    selectedMealPlan: 0,
    selectedRoomOffer: null
  }
});

export const isLateCheckoutAtom = atom<boolean>({
  key: 'isLateCheckout',
  default: false
});

export const groupsAtom = atom<GroupTourEntity[]>({
  key: 'groups',
  default: [],
});

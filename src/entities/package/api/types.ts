import { type PackageService } from './PackageService.ts'
import { type FlightService } from './FlightService.ts'
import { type RequestService } from './RequestService.ts'
import { type DictionaryService } from './DictionaryService.ts'
import { type CityService } from './CityService.ts'
import { type FlightDatesService } from './FlightDatesService.ts'
import { type SearchService } from './SearchService.ts'
import { type PrepaymentInfoCalculationService } from './PrepaymentInfoCalculationService.ts'
import { type PromoCodeService } from './PromoCodeService.ts'
import { type Currency } from '../index.ts'

export type PackageUseCasesParams = {
  packageService: PackageService
  flightService: FlightService
  requestService: RequestService
  dictionaryService: DictionaryService
  cityService: CityService
  flightDatesService: FlightDatesService
  searchService: SearchService
  prepaymentInfoCalculationService: PrepaymentInfoCalculationService
  promoCodeService: PromoCodeService
}

export type GetAvailableFlightsParams = {
  city?: number
  travelAgency?: number
}

export type GetReturnFlightsParams = {
  flightId?: number
}

export type SearchPackagesParams = {
  travelAgencyId?: number
  city: number
  flightId: number
  returnFlightId: number
  lateCheckout?: boolean
  adults: number
  childs?: number[]
  countryId?: number
  dateFrom?: string
  dateTo?: string
}

export type SearchParams = {
  cities: number[]
  adults: number
  childs?: number[]
  dateFrom: string | null
  dateTo: string | null
  nights?: number
  nightsCorrectionLowerValue?: number
  nightsCorrectionUpperValue?: number
  lateCheckout: boolean
  bookingType: 1 | 2
}

export type FlightDatesParams = {
  travelAgencyId: number
  destinationId: number
  daysCountFromNow: number
  duration: number
}

export type GetFlightsByDateParams = {
  date: string
  travelAgency: number
  city: number
}

export type GenerateOffersInput = {
  hotelId: number
  flightId: number
  returnFlightId: number
  adults: number
  childs: number[]
  lateCheckout: boolean
}

export type GenerateHotelOffersInput = {
  hotelId: number
  adults: number
  childs: number[]
  checkin: string
  checkout: string
  travelAgency: number
}

export type BookPackageInput = {
  price: number
  requestId?: number
  cityId: number
  startDate: string
  endDate: string
  travelAgencyId: number
  notes?: string
  travelers: BookPackageTraveler[]
  offerId: number
  usdRate: number
  currency: Currency
  rate: number
  destinationFlightId: number
  returnFlightId: number
  hotelId: number
  roomType: number
  email: string
  phoneNumber: string
  amountToBePaid: number
  paymentSystem: PaymentSystem
}

export interface ReservePackageInput extends BookPackageInput {}

export enum PaymentSystem {
  'VPos' = 'VPos',
  'MyAmeriaPay' = 'MyAmeriaPay'
}

interface BookPackageTraveler {
  id?: number
  firstName: string
  lastName: string
  dateOfBirth?: string
}

export type BookPackageResponse = {
  success: boolean
  message: string
  bookingPaymentUrl: string
}

export interface ReservePackageResponse extends BookPackageResponse {}

export type CreateRequestInput = {
  offerId: number
  travelAgencyId: number
  cityId: number
  price: number
  amountToBePaid?: number
  startDate: string
  endDate: string
  travelers: BookPackageTraveler[]
  hotelId: number
  roomType: number
  nextPaymentDate?: string
  notes?: string
  destinationFlightId: number
  returnFlightId: number
}

export type UpdateRequestInput = {
  id: number
} & Partial<CreateRequestInput>

export type FlightDates = {
  flightStartDate: string;
  flightReturnDate: string;
  returnFlightId: string | number;
  startFlightId: string | number;
};

export enum DictionaryTypes {
  TicketClassDictionary = 'TicketClassDictionary',
  FoodTypeDictionary = 'FoodTypeDictionary',
  TransferTypeDictionary = 'TransferTypeDictionary',
  RoomTypeDictionary = 'RoomTypeDictionary',
  RequestStatusDictionary = 'RequestStatusDictionary',
  FacilityDictionary = 'FacilityDictionary'
}

export type PrepaymentCalculationParams = {
  travelAgencyId: number
  bookingType: number
  destinationId: number
  startDate: string
  fullPrice: number
  calculationSource: 'search' | 'myBookings'
}

export type PromoCodeValidationParams = {
  promoCode: string
  userId: number
  price: number
  agencyId: number
  destinationId: number
  hotelId: number
}

export type PromoCodeValidationResponse = {
  success: boolean
  isValid: boolean
  discount: number
  finalAmount: number
  errorCode: string
  message: string
}

export type PrepaymentInfo = {
  travelAgencyId: number
  bookingType: number
  paymentType: 'FullPricePayment' | 'PartialPricePayment' | 'NoDownPayment'
  fullPrice: number
  minimumAcceptablePayment: number
  minimumAcceptablePaymentPercentage: number
  firstPaymentDate: string | null
  secondPaymentDate: string | null
  minimumAcceptableDaysCount: number | null
}

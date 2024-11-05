import { type PackageService } from './PackageService.ts'
import { type FlightService } from './FlightService.ts'
import { type RequestService } from './RequestService.ts'
import { type DictionaryService } from './DictionaryService.ts'

export type PackageUseCasesParams = {
  packageService: PackageService
  flightService: FlightService
  requestService: RequestService
  dictionaryService: DictionaryService
}

export type GetAvailableFlightsParams = {
  city?: number
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

export type BookPackageInput = {
  price: number
  requestId?: number
  cityId: number
  startDate: string
  endDate: string
  travelAgencyId: number
  notes: string
  travelers: BookPackageTraveler[]
  offerId: number
  usdRate: number
  destinationFlightId: number
  returnFlightId: number
  hotelId: number
  roomType: number
  email: string
  phoneNumber: string
  amountToBePaid: number
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

export enum DictionaryTypes {
  TicketClassDictionary = 'TicketClassDictionary',
  FoodTypeDictionary = 'FoodTypeDictionary',
  TransferTypeDictionary = 'TransferTypeDictionary',
  RoomTypeDictionary = 'RoomTypeDictionary',
  RequestStatusDictionary = 'RequestStatusDictionary',
  FacilityDictionary = 'FacilityDictionary'
}

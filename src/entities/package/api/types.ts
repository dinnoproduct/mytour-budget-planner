import { PackageService } from './PackageService.ts'
import { FlightService } from './FlightService.ts'
import { RequestService } from './RequestService.ts'
import { DictionaryService } from './DictionaryService.ts'

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
	birthDate?: string
	dateOfBirth?: string
}

export type BookPackageResponse = {
	success: boolean
	message: string
	bookingPaymentUrl: string
}

export enum DictionaryTypes {
	TicketClassDictionary = 'TicketClassDictionary',
	FoodTypeDictionary = 'FoodTypeDictionary',
	TransferTypeDictionary = 'TransferTypeDictionary',
	RoomTypeDictionary = 'RoomTypeDictionary',
	RequestStatusDictionary = 'RequestStatusDictionary',
	FacilityDictionary = 'FacilityDictionary',
}
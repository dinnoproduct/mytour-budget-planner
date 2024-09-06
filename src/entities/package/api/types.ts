import { PackageService } from './PackageService.ts'
import { FlightService } from './FlightService.ts'

export type PackageUseCasesParams = {
	packageService: PackageService
	flightService: FlightService
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
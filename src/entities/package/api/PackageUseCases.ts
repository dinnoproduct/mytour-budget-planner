import { PackageService } from './PackageService'
import { FlightService } from './FlightService.ts'
import {
	BookPackageInput, DictionaryTypes,
	GenerateOffersInput,
	GetAvailableFlightsParams, GetFlightsByDateParams,
	GetReturnFlightsParams,
	PackageUseCasesParams,
	SearchPackagesParams
} from './types.ts'
import { RequestService } from './RequestService.ts'
import { DictionaryService } from './DictionaryService.ts'

export class PackageUseCases {
	private readonly packageService: PackageService
	private readonly flightService: FlightService
	private readonly requestService: RequestService
	private readonly dictionaryService: DictionaryService

	constructor({ packageService, flightService, requestService, dictionaryService }: PackageUseCasesParams) {
		this.packageService = packageService
		this.flightService = flightService
		this.requestService = requestService
		this.dictionaryService = dictionaryService
	}

	// package
	async getPackageList() {
		return this.packageService.getPackageList()
	}

	async searchPackages(search: SearchPackagesParams) {
		return this.packageService.searchPackages({
			travelAgencyId: 1,
			...search
		})
	}

	async generateOffers(input: GenerateOffersInput) {
		return this.packageService.generateOffers(input)
	}

	async getPackage(offerId: number) {
		return this.packageService.getPackage(offerId)
	}

	// flight
	async getAvailableFlights(params: GetAvailableFlightsParams) {
		return this.flightService.getAvailableFlights(params)
	}

	async getReturnFlights(params: GetReturnFlightsParams) {
		return this.flightService.getReturnFlights(params)
	}

	async getFlightsByDate(params: GetFlightsByDateParams) {
		return this.flightService.getFlightsByDate(params)
	}

	// request
	async bookPackage(input: BookPackageInput, token: string) {
		return this.requestService.bookPackage(input, token)
	}

	// dictionary
	async getDictionary(
		dictionaryType: DictionaryTypes,
		language: number
	) {
		return this.dictionaryService.getDictionary(dictionaryType, language)
	}
}
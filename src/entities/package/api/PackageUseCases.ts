import { PackageService } from './PackageService'
import { FlightService } from './FlightService.ts'
import {
	GetAvailableFlightsParams,
	GetReturnFlightsParams,
	PackageUseCasesParams,
	SearchPackagesParams
} from './types.ts'

export class PackageUseCases {
	private readonly packageService: PackageService
	private readonly flightService: FlightService

	constructor({ packageService, flightService }: PackageUseCasesParams) {
		this.packageService = packageService
		this.flightService = flightService
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

	// flight
	async getAvailableFlights(params: GetAvailableFlightsParams) {
		return this.flightService.getAvailableFlights(params)
	}

	async getReturnFlights(params: GetReturnFlightsParams) {
		return this.flightService.getReturnFlights(params)
	}
}
import { PackageUseCases } from './PackageUseCases'
import { PackageService } from './PackageService'
import { FlightService } from './FlightService.ts'

export const packageUseCases = new PackageUseCases({
	packageService: new PackageService(),
	flightService: new FlightService()
})

export type * from './types'
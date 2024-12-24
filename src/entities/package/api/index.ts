import { PackageUseCases } from './PackageUseCases'
import { PackageService } from './PackageService'
import { FlightService } from './FlightService.ts'
import { RequestService } from './RequestService.ts'
import { DictionaryService } from './DictionaryService.ts'
import { CityService } from './CityService.ts'

export const packageUseCases = new PackageUseCases({
  packageService: new PackageService(),
  flightService: new FlightService(),
  requestService: new RequestService(),
  dictionaryService: new DictionaryService(),
  cityService: new CityService()
})

export type * from './types'

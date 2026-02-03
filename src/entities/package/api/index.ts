import { PackageUseCases } from './PackageUseCases'
import { PackageService } from './PackageService'
import { FlightService } from './FlightService.ts'
import { RequestService } from './RequestService.ts'
import { DictionaryService } from './DictionaryService.ts'
import { CityService } from './CityService.ts'
import { SearchService } from './SearchService.ts'
import { PrepaymentInfoCalculationService } from './PrepaymentInfoCalculationService.ts'
import { PromoCodeService } from './PromoCodeService.ts'
import { FlightDatesService } from './FlightDatesService.ts';
import { GroupTourService } from './GroupTourService.ts'

export const packageUseCases = new PackageUseCases({
  packageService: new PackageService(),
  flightService: new FlightService(),
  requestService: new RequestService(),
  dictionaryService: new DictionaryService(),
  cityService: new CityService(),
  flightDatesService: new FlightDatesService(),
  searchService: new SearchService(),
  prepaymentInfoCalculationService: new PrepaymentInfoCalculationService(),
  promoCodeService: new PromoCodeService(),
  groupTourService: new GroupTourService(),
})

export type * from './types'

import { PackageUseCases } from './PackageUseCases'
import { PackageService } from './PackageService'
import { FlightService } from './FlightService'
import { RequestService } from './RequestService'
import { DictionaryService } from './DictionaryService'
import { CityService } from './CityService'
import { SearchService } from './SearchService'
import { PrepaymentInfoCalculationService } from './PrepaymentInfoCalculationService'
import { PromoCodeService } from './PromoCodeService'
import { FlightDatesService } from './FlightDatesService';
import { GroupTourService } from './GroupTourService'
import { RequestServiceV2 } from './RequestServiceV2'

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
  requestServiceV2: new RequestServiceV2()
})

export type * from './types'

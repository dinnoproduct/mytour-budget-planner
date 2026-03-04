import { type PackageService } from './PackageService'
import { type FlightService } from './FlightService.ts'
import {
  type BookPackageInput,
  type CreateRequestInput,
  type DictionaryTypes,
  type GenerateHotelOffersInput,
  type GenerateOffersInput,
  type GetAvailableFlightsParams,
  type GetFlightsByDateParams,
  type GetReturnFlightsParams,
  type PackageUseCasesParams,
  type ReservePackageInput,
  type UpdateRequestInput,
  type SearchParams,
  type PrepaymentCalculationParams,
  type PromoCodeValidationParams,
  type FlightDatesParams,
  type PaymentSystemInfo,
} from './types.ts'
import { type RequestService } from './RequestService.ts'
import { type DictionaryService } from './DictionaryService.ts'
import { type LanguageName } from '@shared/model'
import { type CityService } from './CityService.ts'
import { type FlightDatesService } from './FlightDatesService.ts'
import { type SearchService } from './SearchService.ts'
import { type PrepaymentInfoCalculationService } from './PrepaymentInfoCalculationService.ts'
import { type PromoCodeService } from './PromoCodeService.ts'
import { type FlightEntity } from '../model/entities.ts'
import { type RequestServiceV2 } from './RequestServiceV2.ts'

export class PackageUseCases {
  private readonly packageService: PackageService
  private readonly flightService: FlightService
  private readonly requestService: RequestService
  private readonly dictionaryService: DictionaryService
  private readonly cityService: CityService
  private readonly flightDatesService: FlightDatesService
  private readonly searchService: SearchService
  private readonly prepaymentInfoCalculationService: PrepaymentInfoCalculationService
  private readonly requestServiceV2: RequestServiceV2
  private readonly promoCodeService: PromoCodeService
  constructor({
    packageService,
    flightService,
    requestService,
    dictionaryService,
    cityService,
    flightDatesService,
    searchService,
    prepaymentInfoCalculationService,
    promoCodeService,
    requestServiceV2
  }: PackageUseCasesParams) {
    this.packageService = packageService
    this.flightService = flightService
    this.requestService = requestService
    this.dictionaryService = dictionaryService
    this.cityService = cityService
    this.flightDatesService = flightDatesService
    this.searchService = searchService
    this.prepaymentInfoCalculationService = prepaymentInfoCalculationService
    this.promoCodeService = promoCodeService
    this.requestServiceV2 = requestServiceV2
  }

  // package
  async getPackageList() {
    return this.packageService.getPackageList()
  }

  async flightDatesSearch(params: FlightDatesParams) {
    return this.flightDatesService.getFlightDates(params)
  }

  async generateOffers(input: GenerateOffersInput, params: { travelAgency: number }) {
    return this.packageService.generateOffers(input, params)
  }

  async getPackage(offerId: number, travelAgency: number) {
    return this.packageService.getPackage(offerId, travelAgency)
  }

  async generateHotelOffers(input: GenerateHotelOffersInput) {
    return this.packageService.generateHotelOffers(input)
  }

  async getHotelPackage(offerId: number, travelAgency: number) {
    return this.packageService.getHotelPackage(offerId, travelAgency)
  }

  // flight
  async getAvailableFlights(params: GetAvailableFlightsParams) {
    return this.flightService.getAvailableFlights(params)
  }

  async getReturnFlights(input: FlightEntity, params: GetReturnFlightsParams) {
    return this.flightService.getReturnFlights(input, params)
  }

  async getFlightsByDate(params: GetFlightsByDateParams) {
    return this.flightService.getFlightsByDate(params)
  }

  // request
  async bookPackage(input: BookPackageInput, token: string) {
    return this.requestService.bookPackage(input, token)
  }

  async reservePackage(input: ReservePackageInput, token: string) {
    return this.requestService.reservePackage(input, token)
  }

  async payRemainingAmount(
    requestId: number,
    token: string,
    paymentSystem?: string
  ) {
    return this.requestService.payRemainingAmount(
      requestId,
      token,
      paymentSystem
    )
  }

  async cancelRequest(requestId: number, token: string) {
    return this.requestService.cancelRequest(requestId, token)
  }

  async getCancellationMessage(
    requestId: number,
    language: LanguageName,
    token: string
  ) {
    return this.requestService.getCancellationMessage(
      requestId,
      language,
      token
    )
  }

  async getUserRequests(token: string) {
    return this.requestService.getUserRequests(token)
  }

  async createRequest(input: CreateRequestInput, token: string) {
    return this.requestService.createRequest(input, token)
  }

  async updateRequest(input: UpdateRequestInput, token: string) {
    return this.requestService.updateRequest(input, token)
  }

  async getPaymentSystems(
    travelAgencyId: number,
    token: string
  ): Promise<PaymentSystemInfo[]> {
    return this.requestServiceV2.getPaymentSystems(travelAgencyId, token)
  }

  // dictionary
  async getDictionary(dictionaryType: DictionaryTypes, language: number) {
    return this.dictionaryService.getDictionary(dictionaryType, language)
  }

  // city
  async getCitiesOnlyHotel() {
    const cities = await this.cityService.getCitiesOnlyHotel()

    return cities
  }

  async getCities() {
    const cities = await this.cityService.getCities()

    return cities
  }

  // search
  async search(search: SearchParams) {
    return this.searchService.search(search)
  }

  // prepayment
  async calculatePrepayment(params: PrepaymentCalculationParams) {
    return this.prepaymentInfoCalculationService.calculate(params)
  }

  // promo code
  async validatePromoCode(params: PromoCodeValidationParams, token: string) {
    return this.promoCodeService.validate(params, token)
  }
}

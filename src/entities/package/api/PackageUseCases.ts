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
  type SearchHotelPackagesParams,
  type SearchPackagesParams,
  type UpdateRequestInput
} from './types.ts'
import { type RequestService } from './RequestService.ts'
import { type DictionaryService } from './DictionaryService.ts'
import { type LanguageName } from '@shared/model'
import { type CityService } from './CityService.ts'

export class PackageUseCases {
  private readonly packageService: PackageService
  private readonly flightService: FlightService
  private readonly requestService: RequestService
  private readonly dictionaryService: DictionaryService
  private readonly cityService: CityService

  constructor({
    packageService,
    flightService,
    requestService,
    dictionaryService,
    cityService
  }: PackageUseCasesParams) {
    this.packageService = packageService
    this.flightService = flightService
    this.requestService = requestService
    this.dictionaryService = dictionaryService
    this.cityService = cityService
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

  // hotel
  async searchHotelPackages(search: SearchHotelPackagesParams) {
    return this.packageService.searchHotelPackages({
      travelAgencyId: 1,
      ...search
    })
  }

  async generateHotelOffers(input: GenerateHotelOffersInput) {
    return this.packageService.generateHotelOffers(input)
  }

  async getHotelPackage(offerId: number) {
    return this.packageService.getHotelPackage(offerId)
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

  async payRemainingAmount(requestId: number, token: string) {
    return this.requestService.payRemainingAmount(requestId, token)
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
}

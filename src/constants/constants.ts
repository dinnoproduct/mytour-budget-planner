// prod
export const BASE_URL = import.meta.env.VITE_API_URL

export enum AppPaths {
  packages = 'egypt',
}

export enum ApiUrls {
  api = 'api',
  V2 = 'V2',
  package = 'package',
  getPackages = 'getPackages',
  getPackage = 'getPackage',
  city = 'city',
  getCities = 'getCities',
  getRequestStatusDictionary = 'getRequestStatusDictionary',
  getFoodTypeDictionary = 'GetFoodTypeDictionary',
  common = 'common',
  flight = 'flight',
  getAvailableFlights = 'getAvailableFlights',
  getReturnAirTickets = 'getReturnAirTickets',
  getAirTicketsByDate = 'getAirTicketsByDate',
  subscription = 'subscription',
  subscribe = 'subscribe',
  generateOffers = 'generateOffers',
  user = 'user',
  request = 'request',
  book = 'book',
}

export enum Methods {
  GET = 'get',
  POST = 'post',
  PATCH = 'patch',
  PUT = 'put',
  // DELETE = ' delete',
}

export const REQUIRED_MESSAGE = 'requiredField';
export const WRONG_FORMAT = 'wrongFormat';

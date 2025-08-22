// prod
export const BASE_URL = import.meta.env.VITE_API_URL_OLD

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

export const defaultSelectedPackageCity = [1]
export const defaultSelectedHotelCity = [16, 18, 19, 20, 21]
export const packageCards = [
  {
    id: 1,
    image: '/assets/cities/city1.png',
  },
  {
    id: 2,
    image: '/assets/cities/city2.jpg',
  }
]
export const countryCards = [
  {
    countryId: 3,
    image: '/assets/cities/maldives.png',
    cities: '6%2C12'
  },
  {
    countryId: 4,
    image: '/assets/cities/uae.jpg',
    cities: '16%2C18%2C19%2C20%2C21'
  },
  {
    countryId: 6,
    image: '/assets/cities/cypros.png',
    cities: '32%2C33%2C34%2C35%2C37'
  }
]
export const REQUIRED_MESSAGE = 'requiredField';
export const WRONG_FORMAT = 'wrongFormat';

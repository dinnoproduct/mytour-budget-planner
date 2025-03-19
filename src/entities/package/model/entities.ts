export interface PackageEntity {
  id: number
  offerId: number
  hotOffer: boolean
  nameArm: string
  nameEng: string
  nameRus: string
  packageType: number
  adultTravelers: number
  childrenTravelers: number
  infantTravelers: number
  foodType: number
  transferType: number
  packageStatus: number
  price: number
  oldPrice: number
  availableSeats: number
  priceValidityDate: null | string
  duration: number
  nights: number
  additionalInfoArm: string
  additionalInfoEng: string
  additionalInfoRus: string
  cancelationPolicyArm: string
  cancelationPolicyEng: string
  cancelationPolicyRus: string
  bookingPolicyArm: string
  bookingPolicyEng: string
  bookingPolicyRus: string
  city: PackageCity
  travelAgency: PackageTravelAgency
  hotel: PackageHotel
  roomType: number
  destinationFlight: PackageFlight
  returnFlight: PackageFlight
  childMaxAge: number
  usdRate: number
  priceInCurrency: string
  currency: Currency
  checkin: string
  checkout: string
  discount: number
  remainingDays: number
  remainingHours: number
  lateCheckout: boolean
}

export type Currency = 'USD' | 'EUR' | 'AMD' | 'RUB'

export interface PackageCity {
  id: number
  nameArm: string
  nameEng: string
  nameRus: string
  countryId: number
  country: PackageCountry
}

export interface PackageCountry {
  id: number
  nameArm: string
  nameEng: string
  nameRus: string
}

export interface PackageTravelAgency {
  id: number
  name: string
  address: string
  phoneNumber: string
  email: string
  facebook: string
  instagram: string
  telegram: null | string
  establishmentDate: string
  contactPersonDetails: string
}

export interface PackageHotel {
  id: number
  name: string
  website: null | string
  stars: number
  cleanliness: number
  travellersRating: number
  facilities: number
  descriptionArm: string
  descriptionEng: string
  descriptionRus: string
  images: PackageImage[]
}

export interface PackageImage {
  url: string
  size: number
}

export interface PackageFlight {
  id: number
  departureDate: string
  arrivalDate: string
  airCompany: PackageAirCompany
  ticketClass: number
  flightType: number
  fLightCode: string
}

export interface OfferEntity {
  offerId: number
  roomType: number
  price: number
  nights: number
  checkin: string
  checkout: string
}

// flight
export interface FlightEntity {
  id: number
  departureDate: string
  arrivalDate: string
  airCompany: PackageAirCompany
  ticketClass: number
  flightType: number
  fLightCode: string
}

interface PackageAirCompany {
  id: number
  name: string
}

// dictionary
export interface DictionaryEntity {
  key: number
  value: string
}

// request
export interface RequestEntity {
  id: number
  price: number
  prePaymentAmount: number
  remainingPaymentAmount: number
  startDate: string
  endDate: string
  notes: string
  status: RequestStatus
  travelers: RequestTraveler[]
  hotel: RequestHotel
  roomType: number
  nextPaymentDate: string
  destinationFlightId: number
  returnFlightId: number
}

export type NormalizedRequestEntity = Omit<RequestEntity, 'notes'> & {
  notes: {
    childrenAges: number[]
    isSoldOut: boolean
    totalTravelersCount: number
    adultTravelersCount: number
    travelers: {
      adults: {
        firstName: string
        lastName: string
        dateOfBirth: string
      }[]
      children: {
        firstName: string
        lastName: string
        dateOfBirth: string
      }[]
    }
    isLateCheckout?: boolean
  }
}


export interface RequestHotel {
  id: number
  name: string
  website: null | string
  stars: number
  cleanliness: number
  travellersRating: number
  facilities: number
  descriptionArm: string
  descriptionEng: string
  descriptionRus: string
  images: PackageImage[]
  city: PackageCity
}

export enum RequestStatus {
  Draft = 1,
  InProcess,
  NotPaid,
  Booked,
  Purchased,
  Cancelled,
  Rejected,
  Overdue,
  Reserved
}

export interface RequestTraveler {
  id: number
  firstName: string
  lastName: string
  dateOfBirth: string
}

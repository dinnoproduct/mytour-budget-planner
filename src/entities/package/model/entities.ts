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
  rate: number
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
  foodType: number
  currency: Currency
  rate: number
  priceInCurrency: number
}

// flight
export interface FlightEntity {
  id: number,
  travelAgencyId: number,
  departureDate: string,
  arrivalDate: string
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
  travelAgencyId: number
  foodType: number
  bookingType: number
  /** For group tour requests */
  groupTourId?: string
  currency: Currency
  rate: number
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

// Group Tour
export interface GroupTourGalleryItem {
  url: string
  type: string
  order: number
  attribute: GroupTourName
}

export interface GroupTourDeparture {
  startDate: string
  endDate: string
  duration: number
  availableSeats: number
  bookingDeadline: string
}

export interface GroupTourName {
  arm: string
  eng: string
  rus: string
}

export interface GroupTourRouteItem {
  arm: string
  eng: string
  rus: string
}

export interface GroupTourEntity {
  id: string
  name: GroupTourName
  status: string
  type: number
  price: number
  priceInCurrency: number
  currency: string
  rate: number
  roomType: number
  gallery: GroupTourGalleryItem[]
  departures: GroupTourDeparture[]
  routeCountries: GroupTourRouteItem[]
  routeCities: GroupTourRouteItem[]
  createdAt: string
}

// Group Tour detail (getGroupTourInfo)
export interface GroupTourTravelers {
  infantsAllowed?: boolean
  adult: number
  child: number
  infant: number
  adultMinAge: number
  childMaxAge: number
  infantMaxAge: number
}

export interface GroupTourRoomType {
  id: number
  name: GroupTourName
  guests?: {
    maxCount: number
    minCount: number
  }
}

export interface GroupTourItineraryDay {
  dayNumber: number
  date: string
  title: GroupTourName
  description: GroupTourName
}

export interface GroupTourPolicies {
  cancellation: GroupTourName
}

export interface GroupTourAgency {
  id: string
  name: string
}

export interface GroupTourThemeTag {
  id: string
  name: GroupTourName
  icon: string
}

export interface GroupTourInfo {
  id: string
  name: GroupTourName
  description: GroupTourName
  status: string
  type: number
  themeTags: GroupTourThemeTag[]
  gallery: GroupTourGalleryItem[]
  departures: GroupTourDeparture[]
  price: number
  priceInCurrency: number
  currency: string
  rate: number
  travelers: GroupTourTravelers
  roomTypes: GroupTourRoomType[]
  /** When false, infant selector must not be rendered. When true or undefined, allow infants (max 2). */
  route: GroupTourRouteItem[]
  routeCountries: GroupTourRouteItem[]
  routeSummary: GroupTourName
  hotelNames: Record<string, string>
  included: GroupTourRouteItem[]
  excluded: GroupTourRouteItem[]
  itinerary: GroupTourItineraryDay[]
  policies: GroupTourPolicies
  agency: GroupTourAgency
}

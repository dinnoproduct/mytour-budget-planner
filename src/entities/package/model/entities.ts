export interface PackageEntity {
	id: number;
	offerId: number;
	hotOffer: boolean;
	nameArm: string;
	nameEng: string;
	nameRus: string;
	packageType: number;
	adultTravelers: number;
	childrenTravelers: number;
	infantTravelers: number;
	foodType: number;
	transferType: number;
	packageStatus: number;
	price: number;
	oldPrice: number;
	availableSeats: number;
	priceValidityDate: null | string;
	duration: number;
	nights: number;
	additionalInfoArm: string;
	additionalInfoEng: string;
	additionalInfoRus: string;
	cancelationPolicyArm: string;
	cancelationPolicyEng: string;
	cancelationPolicyRus: string;
	bookingPolicyArm: string;
	bookingPolicyEng: string;
	bookingPolicyRus: string;
	city: PackageCity;
	travelAgency: PackageTravelAgency;
	hotel: PackageHotel;
	roomType: number;
	destinationFlight: PackageFlight;
	returnFlight: PackageFlight;
	childMaxAge: number;
	usdRate: number;
	checkin: string;
	checkout: string;
	discount: number;
	remainingDays: number;
	remainingHours: number;
	lateCheckout: boolean;
}

export interface PackageCity {
	id: number;
	nameArm: string;
	nameEng: string;
	nameRus: string;
	countryId: number;
	country: PackageCountry;
}

export interface PackageCountry {
	id: number;
	nameArm: string;
	nameEng: string;
	nameRus: string;
}

export interface PackageTravelAgency {
	id: number;
	name: string;
	address: string;
	phoneNumber: string;
	email: string;
	facebook: string;
	instagram: string;
	telegram: null | string;
	establishmentDate: string;
	contactPersonDetails: string;
}

export interface PackageHotel {
	id: number;
	name: string;
	website: null | string;
	stars: number;
	cleanliness: number;
	travellersRating: number;
	facilities: number;
	descriptionArm: string;
	descriptionEng: string;
	descriptionRus: string;
	images: PackageImage[];
}

export interface PackageImage {
	url: string;
	size: number;
}

export interface PackageFlight {
	id: number;
	departureDate: string;
	arrivalDate: string;
	airCompany: PackageAirCompany;
	ticketClass: number;
	flightType: number;
	fLightCode: string;
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
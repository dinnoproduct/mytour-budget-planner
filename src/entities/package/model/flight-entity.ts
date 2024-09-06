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
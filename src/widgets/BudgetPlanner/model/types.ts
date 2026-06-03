export interface BudgetInput {
  budget: number
  nights: number
  month: string
  travellers: number
  vibe: string
}

export interface HotelOption {
  id: number
  name: string
  stars: number
  area: string
  city: string
  pricePerNight: number
  totalHotelCost: number
  totalTripCost: number
  remainingBudget: number
  image: string
  mytourUrl: string
}

export interface FlightInfo {
  route: string
  departureDate: string
  returnDate: string
  pax: number
  pricePerPerson: number
  totalPrice: number
  airline: string
  bookingUrl: string
}

export interface PlanResult {
  flight: FlightInfo
  hotels: HotelOption[]
  budgetUsed: number
  totalBudget: number
}

export const BUDGET_MIN = 200_000
export const BUDGET_MAX = 2_000_000
export const BUDGET_STEP = 50_000
export const BUDGET_DEFAULT = 600_000

export const NIGHTS_OPTIONS = [5, 7, 10, 14]

export const MONTH_OPTIONS = [
  'june',
  'july',
  'august',
  'september',
  'october',
] as const

export const TRAVELLERS_OPTIONS = [1, 2, 3, 4]

export const VIBE_OPTIONS = [
  'beach',
  'family',
  'party',
  'chill',
] as const

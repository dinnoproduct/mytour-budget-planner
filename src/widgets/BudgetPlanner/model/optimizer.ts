import { type BudgetInput, type FlightInfo, type HotelOption, type PlanResult } from './types'
import {
  CYPRUS_HOTELS,
  FLIGHT_SCHEDULES,
  MONTH_DATES,
  WIZZ_AIR_BOOKING_URL,
} from './mockData'

function getFlightInfo(input: BudgetInput): FlightInfo {
  const schedule = FLIGHT_SCHEDULES.find((s) => s.month === input.month)
    ?? FLIGHT_SCHEDULES[0]

  const monthDate = MONTH_DATES[input.month] ?? MONTH_DATES.june
  const departure = new Date(monthDate.year, monthDate.monthIndex, schedule.departureDay)
  const returnDate = new Date(departure)
  returnDate.setDate(departure.getDate() + input.nights)

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

  return {
    route: 'EVN → LCA',
    departureDate: formatDate(departure),
    returnDate: formatDate(returnDate),
    pax: input.travellers,
    pricePerPerson: schedule.pricePerPerson,
    totalPrice: schedule.pricePerPerson * input.travellers,
    airline: 'Wizz Air',
    bookingUrl: WIZZ_AIR_BOOKING_URL,
  }
}

function getHotelOptions(
  input: BudgetInput,
  flightTotalPrice: number,
): HotelOption[] {
  const remainingAfterFlight = input.budget - flightTotalPrice

  if (remainingAfterFlight <= 0) return []

  return CYPRUS_HOTELS
    .filter((hotel) => {
      const totalHotelCost = hotel.pricePerNight * input.nights * input.travellers
      if (totalHotelCost > remainingAfterFlight) return false
      if (input.vibe && !hotel.vibe.includes(input.vibe)) return false
      return true
    })
    .map((hotel) => {
      const totalHotelCost = hotel.pricePerNight * input.nights * input.travellers
      const totalTripCost = flightTotalPrice + totalHotelCost

      return {
        id: hotel.id,
        name: hotel.name,
        stars: hotel.stars,
        area: hotel.area,
        city: hotel.city,
        pricePerNight: hotel.pricePerNight,
        totalHotelCost,
        totalTripCost,
        remainingBudget: input.budget - totalTripCost,
        image: hotel.image,
        mytourUrl: `https://mytour.am/cyprus/${hotel.mytourSlug}`,
      }
    })
    .sort((a, b) => b.totalTripCost - a.totalTripCost)
    .slice(0, 6)
}

export function planTrip(input: BudgetInput): PlanResult {
  const flight = getFlightInfo(input)
  const hotels = getHotelOptions(input, flight.totalPrice)

  const avgCost =
    hotels.length > 0
      ? hotels.reduce((sum, h) => sum + h.totalTripCost, 0) / hotels.length
      : flight.totalPrice

  return {
    flight,
    hotels,
    budgetUsed: Math.round(avgCost),
    totalBudget: input.budget,
  }
}

import axios, { type AxiosInstance } from 'axios'
import {
  type FlightEntity,
  type GetFlightsByDateParams
} from '@entities/package'
import {
  type GetAvailableFlightsParams,
  type GetReturnFlightsParams
} from '@entities/package/api/types.ts'

export class FlightService {
  private readonly api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/flight`
    })

    this.api.interceptors.response.use(
      response => response.data,
      error => Promise.reject(error)
    )
  }

  async getAvailableFlights({
    city = 1,
    travelAgency = 1
  }: GetAvailableFlightsParams): Promise<FlightEntity[]> {
    return this.api('getAvailableFlights', {
      params: {
        travelAgency,
        city
      }
    })
  }

  async getReturnFlights({
    flightId
  }: GetReturnFlightsParams): Promise<FlightEntity[]> {
    return this.api('getReturnAirTickets', {
      params: {
        id: flightId
      }
    })
  }

  async getFlightsByDate(
    params: GetFlightsByDateParams
  ): Promise<FlightEntity[]> {
    return this.api('getAirTicketsByDate', {
      params
    })
  }
}

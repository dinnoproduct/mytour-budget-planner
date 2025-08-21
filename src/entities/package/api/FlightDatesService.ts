import axios, { type AxiosInstance } from 'axios'

export class FlightDatesService {
  private readonly apiVersion = 'V2'
  private readonly api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${import.meta.env.VITE_API_URL}/${this.apiVersion}/Flight/`
    })

    this.api.interceptors.response.use(
      response => response.data,
      error => Promise.reject(error)
    )
  }

  async getFlightDates(params: {
    travelAgencyId: number
    destinationId: number
    daysCountFromNow: number
    duration: number
  }): Promise<any> {
    return this.api.get('GetFlightDates', {params})
  }
}

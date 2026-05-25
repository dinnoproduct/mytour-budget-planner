import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { FlightService } from './FlightService'

vi.mock('axios')

describe('FlightService', () => {
  const createMock = vi.mocked(axios.create)
  const responseUse = vi.fn()
  const apiCall = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'
    createMock.mockReturnValue(
      Object.assign(apiCall, {
        interceptors: { response: { use: responseUse } },
      }) as never,
    )
  })

  it('creates client with flight base URL', () => {
    new FlightService()
    expect(createMock).toHaveBeenCalledWith({ baseURL: 'https://api.example.com/flight' })
    expect(responseUse).toHaveBeenCalledTimes(1)
  })

  it('getAvailableFlights requests V2 endpoint overriding baseURL with destinationId param', async () => {
    const service = new FlightService()
    await service.getAvailableFlights({ destinationId: 5 })
    expect(apiCall).toHaveBeenCalledWith('getAvailableFlights', {
      baseURL: 'https://api.example.com/V2/flight',
      params: { destinationId: 5 },
    })
  })

  it('getReturnFlights posts flight data with destinationId to V2 endpoint', async () => {
    const service = new FlightService()
    const flightInput = { id: 'f1' } as never
    await service.getReturnFlights(flightInput, { destinationId: 3 })
    expect(apiCall).toHaveBeenCalledWith('getReturnAirTicketsDates', {
      baseURL: 'https://api.example.com/V2/flight',
      params: { destinationId: 3 },
      method: 'post',
      data: flightInput,
    })
  })

  it('getFlightsByDate requests with params on base endpoint', async () => {
    const service = new FlightService()
    const params = { date: '2024-01-01', destinationId: 1 } as never
    await service.getFlightsByDate(params)
    expect(apiCall).toHaveBeenCalledWith('getAirTicketsByDate', { params })
  })

  it('propagates errors from getAvailableFlights', async () => {
    const service = new FlightService()
    const error = new Error('flight error')
    apiCall.mockRejectedValueOnce(error)
    await expect(service.getAvailableFlights({ destinationId: 1 })).rejects.toBe(error)
  })
})

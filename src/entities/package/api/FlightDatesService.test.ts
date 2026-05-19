import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { FlightDatesService } from './FlightDatesService'

vi.mock('axios')

describe('FlightDatesService', () => {
  const createMock = vi.mocked(axios.create)
  const responseUse = vi.fn()
  const get = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'
    createMock.mockReturnValue({
      get,
      interceptors: { response: { use: responseUse } },
    } as never)
  })

  it('creates client with V2 Flight base URL', () => {
    new FlightDatesService()
    expect(createMock).toHaveBeenCalledWith({ baseURL: 'https://api.example.com/V2/Flight/' })
    expect(responseUse).toHaveBeenCalledTimes(1)
  })

  it('getFlightDates sends all params to GetFlightDates endpoint', async () => {
    const service = new FlightDatesService()
    const params = { travelAgencyId: 1, destinationId: 2, daysCountFromNow: 30, duration: 7 }
    await service.getFlightDates(params)
    expect(get).toHaveBeenCalledWith('GetFlightDates', { params })
  })

  it('propagates errors', async () => {
    const service = new FlightDatesService()
    const error = new Error('not found')
    get.mockRejectedValueOnce(error)
    await expect(
      service.getFlightDates({ travelAgencyId: 1, destinationId: 2, daysCountFromNow: 30, duration: 7 }),
    ).rejects.toBe(error)
  })
})

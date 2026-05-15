import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { CityService } from './CityService'

vi.mock('axios')

describe('CityService', () => {
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

  it('creates client with city base URL', () => {
    new CityService()
    expect(createMock).toHaveBeenCalledWith({ baseURL: 'https://api.example.com/city' })
    expect(responseUse).toHaveBeenCalledTimes(1)
  })

  it('getCities calls api with getCities endpoint', async () => {
    const service = new CityService()
    await service.getCities()
    expect(apiCall).toHaveBeenCalledWith('getCities')
  })

  it('getCitiesOnlyHotel calls api with getCitiesOnlyHotel endpoint', async () => {
    const service = new CityService()
    await service.getCitiesOnlyHotel()
    expect(apiCall).toHaveBeenCalledWith('getCitiesOnlyHotel')
  })

  it('propagates errors from getCities', async () => {
    const service = new CityService()
    const error = new Error('server error')
    apiCall.mockRejectedValueOnce(error)
    await expect(service.getCities()).rejects.toBe(error)
  })
})

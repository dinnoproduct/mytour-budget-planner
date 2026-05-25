import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { PackageService } from './PackageService'

vi.mock('axios')

describe('PackageService', () => {
  const createMock = vi.mocked(axios.create)
  const responseUse = vi.fn()
  const apiCall = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'
    // PackageService calls axios.create inside each request(), so the instance must be callable.
    createMock.mockReturnValue(
      Object.assign(apiCall, {
        interceptors: { response: { use: responseUse } },
      }) as never,
    )
  })

  it('getPackageList requests /package/V2/getPackages', async () => {
    apiCall.mockResolvedValueOnce([])
    const service = new PackageService()
    await service.getPackageList()
    expect(createMock).toHaveBeenCalledWith({ baseURL: 'https://api.example.com' })
    expect(apiCall).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/package/V2/getPackages' }),
    )
  })

  it('getPackage requests /package/getPackage with id and travelAgancy query params', async () => {
    apiCall.mockResolvedValueOnce({})
    const service = new PackageService()
    await service.getPackage(5, 10)
    expect(apiCall).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/package/getPackage?id=5&travelAgancy=10' }),
    )
  })

  it('generateOffers posts to V2 package endpoint with travelAgency query param', async () => {
    apiCall.mockResolvedValueOnce([])
    const service = new PackageService()
    const input = { cityId: 1 } as never
    await service.generateOffers(input, { travelAgency: 3 })
    expect(apiCall).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/V2/package/generateOffers?travelAgency=3',
        method: 'post',
        data: input,
      }),
    )
  })

  it('generateHotelOffers posts extracted fields to V2 hotel offers endpoint', async () => {
    apiCall.mockResolvedValueOnce([])
    const service = new PackageService()
    const input = {
      travelAgency: 7,
      checkin: '2024-06-01',
      checkout: '2024-06-08',
      hotelId: 'h1',
      adults: 2,
      childs: [5],
    }
    await service.generateHotelOffers(input)
    expect(apiCall).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/V2/package/generateHotelOffers/?travelAgency=7',
        method: 'post',
        data: {
          checkin: '2024-06-01',
          checkout: '2024-06-08',
          hotelId: 'h1',
          adults: 2,
          childs: [5],
        },
      }),
    )
  })

  it('getHotelPackage requests /package/getHotelPackage with id and travelAgancy params', async () => {
    apiCall.mockResolvedValueOnce({})
    const service = new PackageService()
    await service.getHotelPackage(8, 12)
    expect(apiCall).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/package/getHotelPackage/?id=8&travelAgancy=12' }),
    )
  })

  it('propagates errors', async () => {
    const error = new Error('server error')
    apiCall.mockRejectedValueOnce(error)
    const service = new PackageService()
    await expect(service.getPackageList()).rejects.toBe(error)
  })
})

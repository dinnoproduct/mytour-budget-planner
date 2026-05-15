import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { GroupTourService } from './GroupTourService'

vi.mock('axios')

describe('GroupTourService', () => {
  const createMock = vi.mocked(axios.create)
  const responseUse = vi.fn()
  const apiCall = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'
    // GroupTourService calls axios.create inside each request(), not in constructor.
    // The returned instance must be callable (axios instances are functions).
    createMock.mockReturnValue(
      Object.assign(apiCall, {
        interceptors: { response: { use: responseUse } },
      }) as never,
    )
  })

  describe('getGroupTours', () => {
    it('requests /V2/GroupTours/getGroupTours with no query when called without params', async () => {
      apiCall.mockResolvedValueOnce({ data: [], pagination: {} })
      const service = new GroupTourService()
      await service.getGroupTours()
      expect(createMock).toHaveBeenCalledWith({ baseURL: 'https://api.example.com' })
      expect(apiCall).toHaveBeenCalledWith(
        expect.objectContaining({ url: '/V2/GroupTours/getGroupTours' }),
      )
    })

    it('appends page and limit to query string when both are provided', async () => {
      apiCall.mockResolvedValueOnce({ data: [], pagination: {} })
      const service = new GroupTourService()
      await service.getGroupTours({ page: 2, limit: 10 })
      expect(apiCall).toHaveBeenCalledWith(
        expect.objectContaining({ url: '/V2/GroupTours/getGroupTours?page=2&limit=10' }),
      )
    })

    it('omits null params from query string', async () => {
      apiCall.mockResolvedValueOnce({ data: [], pagination: {} })
      const service = new GroupTourService()
      await service.getGroupTours({ page: null, limit: null })
      expect(apiCall).toHaveBeenCalledWith(
        expect.objectContaining({ url: '/V2/GroupTours/getGroupTours' }),
      )
    })

    it('normalizes array response into paginated shape for backward compatibility', async () => {
      const tours = [{ id: '1' }, { id: '2' }] as never
      apiCall.mockResolvedValueOnce(tours)
      const service = new GroupTourService()
      const result = await service.getGroupTours()
      expect(result).toEqual({
        data: tours,
        pagination: { page: 1, limit: 2, total: 2, totalPages: 1 },
      })
    })

    it('returns paginated response as-is when server already returns object shape', async () => {
      const paginated = {
        data: [{ id: '1' }],
        pagination: { page: 1, limit: 1, total: 1, totalPages: 1 },
      }
      apiCall.mockResolvedValueOnce(paginated)
      const service = new GroupTourService()
      const result = await service.getGroupTours()
      expect(result).toEqual(paginated)
    })
  })

  it('getGroupTourInfo requests correct V2 tour info URL', async () => {
    apiCall.mockResolvedValueOnce({})
    const service = new GroupTourService()
    await service.getGroupTourInfo('tour-42')
    expect(apiCall).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/V2/GroupTours/getGroupTourInfo/tour-42' }),
    )
  })

  it('createGroupTourOffer posts body to CreateGroupTourOffer endpoint', async () => {
    apiCall.mockResolvedValueOnce({})
    const service = new GroupTourService()
    const body = { tourId: 'abc', adults: 2 } as never
    await service.createGroupTourOffer(body)
    expect(apiCall).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/V2/GroupTours/CreateGroupTourOffer',
        method: 'POST',
        data: body,
      }),
    )
  })

  it('propagates errors', async () => {
    const error = new Error('server down')
    apiCall.mockRejectedValueOnce(error)
    const service = new GroupTourService()
    await expect(service.getGroupTourInfo('t1')).rejects.toBe(error)
  })
})

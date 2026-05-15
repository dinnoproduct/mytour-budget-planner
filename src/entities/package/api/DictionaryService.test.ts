import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { DictionaryService } from './DictionaryService'

vi.mock('axios')

describe('DictionaryService', () => {
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

  it('creates client with common base URL', () => {
    new DictionaryService()
    expect(createMock).toHaveBeenCalledWith({ baseURL: 'https://api.example.com/common' })
    expect(responseUse).toHaveBeenCalledTimes(1)
  })

  it('getDictionary constructs endpoint from type and passes language param', async () => {
    const service = new DictionaryService()
    await service.getDictionary('FoodType' as never, 1)
    expect(apiCall).toHaveBeenCalledWith('getFoodType', { params: { language: 1 } })
  })

  it('getDictionary interpolates different dictionary types into the url', async () => {
    const service = new DictionaryService()
    await service.getDictionary('TicketClass' as never, 2)
    expect(apiCall).toHaveBeenCalledWith('getTicketClass', { params: { language: 2 } })
  })

  it('propagates errors', async () => {
    const service = new DictionaryService()
    const error = new Error('dict error')
    apiCall.mockRejectedValueOnce(error)
    await expect(service.getDictionary('FoodType' as never, 1)).rejects.toBe(error)
  })
})

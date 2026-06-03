import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TipsService } from './TipsService'

const { responseUse, get, createMock } = vi.hoisted(() => {
  const hoistedResponseUse = vi.fn()
  const hoistedGet = vi.fn()
  const hoistedCreateMock = vi.fn(() => ({
    get: hoistedGet,
    interceptors: { response: { use: hoistedResponseUse } },
  }))
  return {
    responseUse: hoistedResponseUse,
    get: hoistedGet,
    createMock: hoistedCreateMock,
  }
})

vi.mock('axios', () => ({ default: { create: createMock }, create: createMock }))

describe('TipsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'
    createMock.mockReturnValue({
      get,
      interceptors: { response: { use: responseUse } },
    } as never)
  })

  it('creates client with external base URL', () => {
    new TipsService()
    expect(createMock).toHaveBeenCalledWith({
      baseURL: 'https://api.example.com/external',
    })
    expect(responseUse).toHaveBeenCalled()
  })

  it('sends getTips request without auth headers', async () => {
    const service = new TipsService()
    await service.getTips('am')
    expect(get).toHaveBeenCalledWith('/tips', {
      headers: { platform: 'web', 'Content-Language': 'am' },
    })
  })
})

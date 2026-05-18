import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BannerService } from './BannerService'

// BannerService exports a module-level instance (`export const bannerService = new BannerService()`),
// so vi.hoisted is required — the factory runs before module imports.
const { responseUse, get, createMock } = vi.hoisted(() => {
  const hoistedResponseUse = vi.fn()
  const hoistedGet = vi.fn()
  const hoistedCreateMock = vi.fn(() => ({
    get: hoistedGet,
    interceptors: { response: { use: hoistedResponseUse } },
  }))
  return { responseUse: hoistedResponseUse, get: hoistedGet, createMock: hoistedCreateMock }
})

vi.mock('axios', () => ({ default: { create: createMock }, create: createMock }))

describe('BannerService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'
    createMock.mockReturnValue({
      get,
      interceptors: { response: { use: responseUse } },
    } as never)
  })

  it('creates client with external base URL', () => {
    new BannerService()
    expect(createMock).toHaveBeenCalledWith({ baseURL: 'https://api.example.com/external' })
    expect(responseUse).toHaveBeenCalled()
  })

  it('sends getBanners request with platform and language headers', async () => {
    const service = new BannerService()
    await service.getBanners('en')
    expect(get).toHaveBeenCalledWith('/Banners', {
      headers: { platform: 'web', 'Content-Language': 'en' },
    })
  })

  it('passes through the language argument', async () => {
    const service = new BannerService()
    await service.getBanners('ru')
    expect(get).toHaveBeenCalledWith('/Banners', {
      headers: { platform: 'web', 'Content-Language': 'ru' },
    })
  })

  it('propagates errors', async () => {
    const service = new BannerService()
    const error = new Error('network error')
    get.mockRejectedValueOnce(error)
    await expect(service.getBanners('en')).rejects.toBe(error)
  })
})

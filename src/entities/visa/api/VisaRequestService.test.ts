import { beforeEach, describe, expect, it, vi } from 'vitest'
import { VisaRequestService } from './VisaRequestService'

const { responseUse, post, createMock } = vi.hoisted(() => {
  const hoistedResponseUse = vi.fn()
  const hoistedPost = vi.fn()
  const hoistedCreateMock = vi.fn(() => ({
    post: hoistedPost,
    interceptors: { response: { use: hoistedResponseUse } },
  }))
  return {
    responseUse: hoistedResponseUse,
    post: hoistedPost,
    createMock: hoistedCreateMock,
  }
})

vi.mock('axios', () => ({ default: { create: createMock }, create: createMock }))

describe('VisaRequestService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'
    createMock.mockReturnValue({
      post,
      interceptors: { response: { use: responseUse } },
    } as never)
  })

  it('posts create visa request with auth headers', async () => {
    const service = new VisaRequestService()
    const payload = {
      startDate: '2026-06-03T14:22:15.328Z',
      city: 'Larnaca',
      country: 'Cyprus',
      travelersCount: 2,
      platform: 'Web',
    }

    await service.createVisaRequest(payload, 'token-1')

    expect(createMock).toHaveBeenCalledWith({
      baseURL: 'https://api.example.com/V2/VisaRequests',
    })
    expect(post).toHaveBeenCalledWith('/CreateVisaResuest', payload, {
      headers: {
        Authorization: 'Bearer token-1',
        Platform: 'Web',
      },
    })
  })
})

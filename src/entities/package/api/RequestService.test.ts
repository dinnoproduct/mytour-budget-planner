import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { RequestService } from './RequestService'

vi.mock('axios')

describe('RequestService', () => {
  const createMock = vi.mocked(axios.create)
  const responseUse = vi.fn()
  const post = vi.fn()
  const get = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'
    createMock.mockReturnValue({
      post,
      get,
      interceptors: { response: { use: responseUse } },
    } as never)
  })

  it('creates client with request base URL', () => {
    new RequestService()
    expect(createMock).toHaveBeenCalledWith({ baseURL: 'https://api.example.com/request' })
    expect(responseUse).toHaveBeenCalledTimes(1)
  })

  it('bookPackage posts to book endpoint with bearer token and Platform header', async () => {
    const service = new RequestService()
    const input = { offerId: 1 } as never
    await service.bookPackage(input, 'tok')
    expect(post).toHaveBeenCalledWith('book', input, {
      headers: { Authorization: 'Bearer tok', Platform: 'Web' },
    })
  })

  it('reservePackage merges isLateCheckout false into the payload', async () => {
    const service = new RequestService()
    const input = { offerId: 2 } as never
    await service.reservePackage(input, 'tok')
    expect(post).toHaveBeenCalledWith(
      'reserve',
      { offerId: 2, isLateCheckout: false },
      { headers: { Authorization: 'Bearer tok', Platform: 'Web' } },
    )
  })

  it('payRemainingAmount includes optional paymentSystem and amountToBePaid when provided', async () => {
    const service = new RequestService()
    await service.payRemainingAmount(99, 'tok', 'visa', 500)
    expect(post).toHaveBeenCalledWith('payRemainderAmount', {}, {
      params: { id: 99, paymentSystem: 'visa', amountToBePaid: 500 },
      headers: { Authorization: 'Bearer tok' },
    })
  })

  it('payRemainingAmount omits optional params when not provided', async () => {
    const service = new RequestService()
    await service.payRemainingAmount(99, 'tok')
    expect(post).toHaveBeenCalledWith('payRemainderAmount', {}, {
      params: { id: 99 },
      headers: { Authorization: 'Bearer tok' },
    })
  })

  it('cancelRequest posts requestId with json-patch content type', async () => {
    const service = new RequestService()
    await service.cancelRequest(7, 'tok')
    expect(post).toHaveBeenCalledWith('cancelRequest', 7, {
      headers: { Authorization: 'Bearer tok', 'Content-Type': 'application/json-patch+json' },
    })
  })

  it('getCancellationMessage sends requestId, language, and auth header', async () => {
    const service = new RequestService()
    await service.getCancellationMessage(5, 'en', 'tok')
    expect(get).toHaveBeenCalledWith('getCancelationMessage', {
      params: { requestId: 5, language: 'en' },
      headers: { Authorization: 'Bearer tok' },
    })
  })

  it('getUserRequests sends bearer auth header', async () => {
    const service = new RequestService()
    await service.getUserRequests('tok')
    expect(get).toHaveBeenCalledWith('getUserRequests', {
      headers: { Authorization: 'Bearer tok' },
    })
  })

  it('createRequest posts input with auth header', async () => {
    const service = new RequestService()
    const input = { packageId: 1 } as never
    await service.createRequest(input, 'tok')
    expect(post).toHaveBeenCalledWith('createRequest', input, {
      headers: { Authorization: 'Bearer tok' },
    })
  })

  it('updateRequest posts input with auth header', async () => {
    const service = new RequestService()
    const input = { requestId: 1 } as never
    await service.updateRequest(input, 'tok')
    expect(post).toHaveBeenCalledWith('updateRequest', input, {
      headers: { Authorization: 'Bearer tok' },
    })
  })

  it('propagates errors from bookPackage', async () => {
    const service = new RequestService()
    const error = new Error('payment failed')
    post.mockRejectedValueOnce(error)
    await expect(service.bookPackage({} as never, 'tok')).rejects.toBe(error)
  })
})

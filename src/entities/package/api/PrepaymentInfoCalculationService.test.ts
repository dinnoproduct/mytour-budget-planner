import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { PrepaymentInfoCalculationService } from './PrepaymentInfoCalculationService'

vi.mock('axios')

describe('PrepaymentInfoCalculationService', () => {
  const createMock = vi.mocked(axios.create)
  const responseUse = vi.fn()
  const post = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'
    createMock.mockReturnValue({
      post,
      interceptors: { response: { use: responseUse } },
    } as never)
  })

  it('creates client with V2 PrepaymentInfoCalculation base URL', () => {
    new PrepaymentInfoCalculationService()
    expect(createMock).toHaveBeenCalledWith({
      baseURL: 'https://api.example.com/V2/PrepaymentInfoCalculation/',
    })
    expect(responseUse).toHaveBeenCalledTimes(1)
  })

  it('calculate posts params to Calculate endpoint', async () => {
    const service = new PrepaymentInfoCalculationService()
    const params = { offerId: 1, adults: 2 } as never
    await service.calculate(params)
    expect(post).toHaveBeenCalledWith('Calculate', params)
  })

  it('propagates errors', async () => {
    const service = new PrepaymentInfoCalculationService()
    const error = new Error('calculation failed')
    post.mockRejectedValueOnce(error)
    await expect(service.calculate({} as never)).rejects.toBe(error)
  })
})

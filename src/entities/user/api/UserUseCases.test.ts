import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UserUseCases } from './UserUseCases'

const userService = {
  getUser: vi.fn(),
  updateUser: vi.fn(),
}

const authService = {
  register: vi.fn(),
  confirmRegistration: vi.fn(),
  login: vi.fn(),
  confirmLogin: vi.fn(),
  resendOTP: vi.fn(),
}

describe('UserUseCases', () => {
  const useCases = new UserUseCases({ userService: userService as never, authService: authService as never })

  beforeEach(() => vi.clearAllMocks())

  it('getUser delegates to userService.getUser', async () => {
    userService.getUser.mockResolvedValueOnce({ id: 1 })
    const result = await useCases.getUser('tok')
    expect(userService.getUser).toHaveBeenCalledWith('tok')
    expect(result).toEqual({ id: 1 })
  })

  it('updateUser delegates to userService.updateUser', async () => {
    const input = { firstName: 'John' } as never
    userService.updateUser.mockResolvedValueOnce(true)
    const result = await useCases.updateUser('tok', input)
    expect(userService.updateUser).toHaveBeenCalledWith('tok', input)
    expect(result).toBe(true)
  })

  it('register delegates to authService.register', async () => {
    const data = { phone: '+374' } as never
    await useCases.register(data)
    expect(authService.register).toHaveBeenCalledWith(data)
  })

  it('confirmRegistration delegates to authService.confirmRegistration', async () => {
    const data = { code: '1234' } as never
    await useCases.confirmRegistration(data)
    expect(authService.confirmRegistration).toHaveBeenCalledWith(data)
  })

  it('login delegates to authService.login', async () => {
    const data = { phone: '+374' } as never
    await useCases.login(data)
    expect(authService.login).toHaveBeenCalledWith(data)
  })

  it('confirmLogin delegates to authService.confirmLogin', async () => {
    const data = { code: '5678' } as never
    await useCases.confirmLogin(data)
    expect(authService.confirmLogin).toHaveBeenCalledWith(data)
  })

  it('resendOTP delegates to authService.resendOTP', async () => {
    const data = { phone: '+374' } as never
    await useCases.resendOTP(data)
    expect(authService.resendOTP).toHaveBeenCalledWith(data)
  })

  it('propagates errors from userService', async () => {
    const error = new Error('unauthorized')
    userService.getUser.mockRejectedValueOnce(error)
    await expect(useCases.getUser('bad-token')).rejects.toBe(error)
  })
})

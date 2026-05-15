import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('getTabSessionId', () => {
  const store: Record<string, string> = {}
  const mockSessionStorage = {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]) }),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockSessionStorage.clear()
    vi.stubGlobal('sessionStorage', mockSessionStorage)
    vi.stubGlobal('crypto', { randomUUID: vi.fn(() => 'test-uuid-1234') })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('generates and stores a new session id when none exists', async () => {
    const { getTabSessionId } = await import('./session')
    const id = getTabSessionId()
    expect(mockSessionStorage.setItem).toHaveBeenCalledWith('tab_session_id', 'test-uuid-1234')
    expect(id).toBe('test-uuid-1234')
  })

  it('returns the existing session id without generating a new one', async () => {
    store['tab_session_id'] = 'existing-id'
    const { getTabSessionId } = await import('./session')
    const id = getTabSessionId()
    expect(crypto.randomUUID).not.toHaveBeenCalled()
    expect(id).toBe('existing-id')
  })
})

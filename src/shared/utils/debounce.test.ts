import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { debounce } from './debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls wrapped function once after wait time', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced('arg-1')
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('arg-1')
  })

  it('only runs latest invocation when called repeatedly', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 200)

    debounced('first')
    vi.advanceTimersByTime(100)
    debounced('second')
    vi.advanceTimersByTime(100)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('second')
  })
})

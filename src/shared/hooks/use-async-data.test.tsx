import { renderHook, act, waitFor } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { useAsyncData } from './use-async-data'

// Helper to flush all pending promises
const flushPromises = () => new Promise(setImmediate)

describe('useAsyncData', () => {
  it('fetches data successfully', async () => {
    const fetchFn = vi.fn().mockResolvedValue('data')
    const { result } = renderHook(() => useAsyncData(fetchFn))
    expect(result.current.loading).toBe(true)
    await act(async () => {
      await flushPromises()
    })
    expect(result.current.data).toBe('data')
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  }, 20000)

  it('mutate updates the data', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ a: 1, b: 2 })
    const { result } = renderHook(() => useAsyncData(fetchFn))
    await act(async () => {
      await flushPromises()
    })
    act(() => {
      result.current.mutate({ b: 42 })
    })
    expect(result.current.data).toEqual({ a: 1, b: 42 })
  }, 20000)

  it('aborts request on unmount', async () => {
    let aborted = false
    const fetchFn = vi.fn().mockImplementation((signal: AbortSignal) => {
      return new Promise((_, reject) => {
        signal.addEventListener('abort', () => {
          aborted = true
          reject(new DOMException('Aborted', 'AbortError'))
        })
      })
    })
    const { unmount } = renderHook(() => useAsyncData(fetchFn))
    await act(async () => {
      unmount()
      await flushPromises()
    })
    expect(aborted).toBe(true)
  }, 20000)

  it('caches results and returns cached data within cacheTime', async () => {
    vi.useFakeTimers()
    let now = Date.now()
    vi.setSystemTime(now)
    let callCount = 0
    const fetchFn = vi.fn().mockImplementation(() => {
      callCount++
      return Promise.resolve('cached-data')
    })
    const cacheKey = 'test-cache'
    // First mount
    const { result, unmount } = renderHook(() =>
      useAsyncData(fetchFn, { cacheKey, cacheTime: 1000 })
    )
    await act(async () => {
      await flushPromises()
    })
    expect(result.current.data).toBe('cached-data')
    expect(callCount).toBe(1)
    // Remount within cacheTime
    unmount()
    const { result: result2, unmount: unmount2 } = renderHook(() =>
      useAsyncData(fetchFn, { cacheKey, cacheTime: 1000 })
    )
    await act(async () => {
      await flushPromises()
    })
    expect(result2.current.data).toBe('cached-data')
    expect(callCount).toBe(1)
    // Advance time past cacheTime and remount
    unmount2()
    await act(async () => {
      now += 1001
      vi.setSystemTime(now)
      vi.advanceTimersByTime(1001)
    })
    const { result: result3 } = renderHook(() =>
      useAsyncData(fetchFn, { cacheKey, cacheTime: 1000 })
    )
    await act(async () => {
      await flushPromises()
    })
    await waitFor(() => {
      expect(callCount).toBe(2)
      expect(result3.current.data).toBe('cached-data')
    })
    vi.useRealTimers()
  }, 50000)

  it('retries on failure with exponential delay', async () => {
    vi.useFakeTimers()
    const fetchFn = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail1'))
      .mockRejectedValueOnce(new Error('fail2'))
      .mockResolvedValue('success')
    const { result } = renderHook(() =>
      useAsyncData(fetchFn, { retryCount: 2, retryDelay: 100 })
    )
    // Wait for loading state
    await waitFor(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.loading).toBe(true)
    })
    // First fail
    await act(async () => {
      await flushPromises()
    })
    // Advance timer for first retry (100ms)
    await act(async () => {
      vi.advanceTimersByTime(100)
      await flushPromises()
    })
    // Second fail (exponential delay: 200ms)
    await act(async () => {
      vi.advanceTimersByTime(200)
      await flushPromises()
    })
    // Should succeed now
    await act(async () => {
      await flushPromises()
    })
    await waitFor(() => {
      expect(result.current).not.toBeNull()
      expect(result.current.data).toBe('success')
      expect(result.current.error).toBeNull()
    })
    expect(fetchFn).toHaveBeenCalledTimes(3)
    vi.useRealTimers()
  }, 50000)
})

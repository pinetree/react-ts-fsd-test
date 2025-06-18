import { useEffect, useState } from 'react'

interface UseAsyncDataOptions {
  retryCount?: number
  retryDelay?: number
  cacheTime?: number
  cacheKey?: string
}

interface UseAsyncDataState<T> {
  data: T | null
  error: Error | null
  loading: boolean
  retry: () => void
  mutate: (data: Partial<T>) => void
}

export interface UseAsyncDataFetchFn<T> {
  (signal: AbortSignal): Promise<T>
}

type UseAsyncDataLocalState<T> = Pick<
  UseAsyncDataState<T>,
  'data' | 'error' | 'loading'
>

// TODO: add cache to local storage
const cache = new Map<string, { data: unknown; timestamp: number }>()

const setErrorState = (error: unknown) => {
  return {
    data: null,
    loading: false,
    error: error instanceof Error ? error : new Error('Unknown error'),
  }
}

export const useAsyncData = <T>(
  fetchFn: UseAsyncDataFetchFn<T>,
  options?: UseAsyncDataOptions
): UseAsyncDataState<T> => {
  const [state, setState] = useState<UseAsyncDataLocalState<T>>({
    data: null,
    error: null,
    loading: false,
  })
  const [retriesPerformed, setRetriesPerformed] = useState(0)
  const [forceRefetch, setForceRefetch] = useState<Nullable<number>>(null)

  const {
    cacheKey,
    cacheTime = 1000,
    retryCount,
    retryDelay = 100,
  } = options || {}
  if (options?.cacheTime && !cacheKey) {
    console.warn('cacheKey is required when cacheTime is provided')
  }

  useEffect(() => {
    const abortController = new AbortController()
    let isMounted = true

    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true }))

      if (cacheKey) {
        const cachedData = cache.get(cacheKey)
        if (cachedData && Date.now() - cachedData.timestamp < cacheTime) {
          console.log('return from cache')
          setState({ data: cachedData.data as T, loading: false, error: null })
          return
        }
      }

      try {
        const data = await fetchFn(abortController.signal)
        if (isMounted) {
          if (cacheKey) {
            cache.set(cacheKey, { data, timestamp: Date.now() })
          }

          setState({ data, loading: false, error: null })
        }
      } catch (error) {
        if (
          isMounted &&
          !(error instanceof Error && error.name === 'AbortError')
        ) {
          if (retryCount) {
            if (retriesPerformed < retryCount) {
              setRetriesPerformed(prev => prev + 1)

              const exponentialDelay =
                retryDelay * Math.pow(2, retriesPerformed)

              setTimeout(() => {
                console.log('retry', { exponentialDelay, retriesPerformed })
                fetchData()
              }, exponentialDelay)
            } else {
              setState(setErrorState(error))
            }
          } else {
            setState(setErrorState(error))
          }
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [
    cacheKey,
    cacheTime,
    fetchFn,
    retryCount,
    retryDelay,
    retriesPerformed,
    forceRefetch,
  ])

  const retry = () => {
    setForceRefetch(Date.now())
  }

  const mutate = (data: Partial<T>) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, ...data } as T,
    }))
  }

  return {
    ...state,
    retry,
    mutate,
  }
}

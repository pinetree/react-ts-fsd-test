import { useEffect, useState } from 'react'

interface UseAsyncDataOptions {
  retryCount?: number
  retryDelay?: number
  cacheTime?: number
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

export const useAsyncData = <T>(
  fetchFn: UseAsyncDataFetchFn<T>,
  options?: UseAsyncDataOptions
): UseAsyncDataState<T> => {
  const [state, setState] = useState<UseAsyncDataLocalState<T>>({
    data: null,
    error: null,
    loading: false,
  })

  useEffect(() => {
    const abortController = new AbortController()
    let isMounted = true

    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true }))
      try {
        const data = await fetchFn(abortController.signal)
        if (isMounted) {
          setState({ data, loading: false, error: null })
        }
      } catch (error) {
        if (
          isMounted &&
          !(error instanceof Error && error.name === 'AbortError')
        ) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error : new Error('Unknown error'),
          })
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [fetchFn])

  const retry = () => {
    setState(prev => ({ ...prev, loading: true }))
  }

  const mutate = (data: Partial<T>) => {
    console.log(data)
    // setData(prev => (prev ? { ...prev, ...data } : data))
  }

  return {
    ...state,
    retry,
    mutate,
  }
}

import { useRef, useState } from 'react'

export interface InfiniteQueryState<T> {
  pages: T[][]
  isLoading: boolean
  isError: boolean
  hasNextPage: boolean
  fetchNextPage: () => void
  retry: () => void
}

export interface InfiniteQueryOptions<T> {
  queryKey: string
  queryFn: (page: number, pageSize: number) => Promise<InfiniteQueryFnResult<T>>
  pageSize: number
}

export interface InfiniteQueryFnResult<T> {
  data: T[]
  hasMore: boolean
  nextPage: number
}

export const MAX_RETRIES = 3

export const useInfiniteQuery = <T>(
  options: InfiniteQueryOptions<T>
): InfiniteQueryState<T> => {
  const [pages, setPages] = useState<T[][]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [nextPage, setNextPage] = useState(1)
  // Любой ререндер хост компонента сбросит retries в 0 и это не будет работать
  // лучше использовать useRef
  // let retries = 0
  const retries = useRef(0)
  
  const fetchNextPage = async () => {
    setIsLoading(true)
    try {
      const {
        data,
        hasMore,
        nextPage: newNextPage,
      } = await options.queryFn(nextPage, options.pageSize)
      setPages(prev => [...prev, data])
      setHasNextPage(hasMore)
      setNextPage(newNextPage)
      retries.current = 0
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Network error')) {
          console.log('Network error', retries)
          if (retries.current < MAX_RETRIES) {
            fetchNextPage()
            retries.current++
          } else {
            setIsError(true)
            setHasNextPage(false)
          }
        }
      } else {
        setIsError(true)
        setHasNextPage(false)
      }
    } finally {
      if (retries.current === 0 || retries.current === MAX_RETRIES) {
        setIsLoading(false)
      }
    }
  }

  return {
    pages,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    retry: () => {
      setIsError(false)
      setPages([])
    },
  }
}

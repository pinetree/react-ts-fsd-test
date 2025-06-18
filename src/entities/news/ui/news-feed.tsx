import { useCallback, useEffect, useRef } from 'react'
import { useInfiniteQuery } from '@/shared/hooks/use-infinite-query'
import { Skeleton } from '@/shared/ui/skeleton'
import { fetchNews } from '../api'
import './news-feed.css'

export const NewsFeed = () => {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const parentRef = useRef<HTMLDivElement>(null)

  const { pages, isLoading, isError, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: 'news',
      queryFn: fetchNews,
      pageSize: 20,
    })

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasNextPage && !isLoading) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isLoading]
  )

  useEffect(() => {
    const element = loadMoreRef.current

    if (!element) return

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    })

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleObserver])

  // const virtualizer = useVirtualizer({
  //   count: hasNextPage ? pages.length + 1 : pages.length,
  //   getScrollElement: () => parentRef.current!,
  //   windowSize: 10,
  // })

  // console.log(virtualizer.getVirtualItems())

  if (!pages) return null

  const news = pages.flat() ?? []

  console.log({ news, isLoading, isError, hasNextPage })

  return (
    <div className="news-feed" ref={parentRef}>
      {news.map(item => {
        /* {virtualizer.getVirtualItems().map(virtualItem => {
        const item = news[virtualItem.index]

        if (!item) return null */

        return (
          <div className="news-feed__item" key={item.id}>
            <div className="news-feed__item-title">{item.title}</div>
            <div className="news-feed__item-summary">
              <div className="news-feed__item-summary-text">{item.summary}</div>
              <div className="news-feed__item-summary-image">
                <img src={item.imageUrl} alt={item.title} />
              </div>
            </div>
          </div>
        )
      })}
      <div ref={loadMoreRef} className="news-feed__load-more">
        {isLoading ? <Skeleton /> : hasNextPage ? <div>Load more</div> : null}
      </div>
      {isError && <div>Error loading news</div>}
    </div>
  )
}

import { useRef } from 'react'
import { fetchNews } from '../api'
import { NewsSkeleton } from './news-skeleton'
import './news-feed.css'
import { useIntersection, useInfiniteQuery } from '@/shared/hooks'

const INTERSECTION_OPTIONS: IntersectionObserverInit = {
  threshold: 0.1,
}

export const NewsFeed = () => {
  // Удалил реф на observer, он не нужен
  // Удалил реф на loadMoreRef, так как теперь хук useIntersection его создает и возвращает
  const parentRef = useRef<HTMLDivElement>(null)

  const { pages, isLoading, isError, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: 'news',
      queryFn: fetchNews,
      pageSize: 20,
    })

  // Вынес в отдельный хук  
  const loadMoreRef = useIntersection(target => {
    if (target.isIntersecting && hasNextPage && !isLoading) {
      fetchNextPage()
    }
  }, INTERSECTION_OPTIONS)

  // TODO: implement pull to refresh

  // TODO: Implement virtualizer
  // const virtualizer = useVirtualizer({
  //   count: hasNextPage ? pages.length + 1 : pages.length,
  //   getScrollElement: () => parentRef.current!,
  //   windowSize: 10,
  // })

  // console.log(virtualizer.getVirtualItems())

  if (!pages) return null

  // console.log({ news, isLoading, isError, hasNextPage })

  return (
    <div className="news-feed" ref={parentRef}>
      {/*
        Переделал на flatMap + map, чтобы избежать лишних итераций по массиву (хоть он потенциально и небольшой)
      */}
      {pages.flatMap(page => {
        /* {virtualizer.getVirtualItems().map(virtualItem => {
        const item = news[virtualItem.index]

        if (!item) return null */

        return page.map(item => (
          <div className="news-feed__item" key={item.id}>
            <div className="news-feed__item-title">{item.title}</div>
            <div className="news-feed__item-summary">
              <div className="news-feed__item-summary-text">{item.summary}</div>
              <div className="news-feed__item-summary-image">
                <img src={item.imageUrl} alt={item.title} />
              </div>
            </div>
          </div>
        ))
      })}
      {hasNextPage ? (
        <div ref={loadMoreRef} className="news-feed__load-more">
          &nbsp;
        </div>
      ) : null}
      {isLoading && <NewsSkeleton />}
      {isError && <div>Error loading news</div>}
    </div>
  )
}

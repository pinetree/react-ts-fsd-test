import { SkeletonLine } from '@/shared/ui/skeleton'
import './news-feed.css'

const NewsPostSkeleton = () => {
  return (
    <div className="news-post-skeleton">
      <SkeletonLine width="40%" height="20px" />
      <SkeletonLine width="100%" height="20px" />
      <SkeletonLine width="50%" height="40px" />
    </div>
  )
}

export const NewsSkeleton = () => {
  const news = Array.from({ length: 9 }, (_, index) => index)
  return (
    <div className="news-skeleton">
      {news.map(item => (
        <NewsPostSkeleton key={item} />
      ))}
    </div>
  )
}

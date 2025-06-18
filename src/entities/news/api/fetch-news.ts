import type { InfiniteQueryFnResult } from '@/shared/hooks/use-infinite-query'
import type { NewsItem } from '../model/types'

// Мок API для новостей
export const fetchNews = async (
  page: number,
  limit: number = 20
): Promise<InfiniteQueryFnResult<NewsItem>> => {
  // Симуляция задержки сети
  await new Promise(resolve => setTimeout(resolve, 3000))

  // Иногда возвращаем ошибку для тестирования
  if (Math.random() < 0.5) {
    throw new Error('Network error')
  }

  return {
    data: generateNewsItems(page, limit),
    hasMore: page < 10, // всего 10 страниц
    nextPage: page + 1,
  }
}

const generateNewsItems = (page: number, limit: number) => {
  return Array.from({ length: limit }, (_, index) => ({
    id: `${page}-${index}`,
    title: `News ${page}-${index}`,
    summary: `Summary ${page}-${index}`,
    imageUrl: `https://placehold.jp/${index * 10}6699/cccc00/100x20.png`,
    publishedAt: `2025-01-01`,
    author: `Author ${page}-${index}`,
  }))
}

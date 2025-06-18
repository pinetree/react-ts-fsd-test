import { useAsyncData } from '@/shared/hooks'
import { fetchUser } from '../api/fetch-user'

export const UseAsyncDataPage = () => {
  const { data, loading, error, retry, mutate } = useAsyncData(fetchUser, {
    cacheKey: 'user',
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retryCount: 3,
    retryDelay: 100,
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data</div>

  return (
    <div>
      <h1>User</h1>
      <p>{data.name}</p>
      <p>{data.email}</p>
      <button onClick={() => mutate({ name: 'John Doe' })}>Mutate</button>
      <button onClick={retry}>Retry</button>
    </div>
  )
}

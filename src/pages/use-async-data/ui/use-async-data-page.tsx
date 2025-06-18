import { useAsyncData } from '@/shared/hooks'
import { fetchUser } from '../api/fetch-user'

export const UseAsyncDataPage = () => {
  const { data, loading, error } = useAsyncData(fetchUser)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data</div>

  return (
    <div>
      <h1>User</h1>
      <p>{data.name}</p>
      <p>{data.email}</p>
    </div>
  )
}

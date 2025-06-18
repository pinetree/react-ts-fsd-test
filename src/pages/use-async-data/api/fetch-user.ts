import type { UseAsyncDataFetchFn } from '@/shared/hooks/use-async-data'

type User = {
  id: number
  name: string
  email: string
}

export const fetchUser: UseAsyncDataFetchFn<User> = async (
  signal: AbortSignal
) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users/1', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }
  return response.json()
}

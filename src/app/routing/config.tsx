import { MainPage } from '@/pages/main'
import { UseAsyncDataPage } from '@/pages/use-async-data'

export const routes = [
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/use-async-data',
    element: <UseAsyncDataPage />,
  },
]

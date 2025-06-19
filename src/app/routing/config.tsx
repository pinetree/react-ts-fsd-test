import { MainPage } from '@/pages/main'
import { ModalPage } from '@/pages/modal'
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
  {
    path: '/modal',
    element: <ModalPage />,
  },
]

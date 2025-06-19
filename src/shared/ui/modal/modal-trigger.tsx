import type { ReactNode } from 'react'
import { useModal } from './context'

export type ModalTriggerProps = {
  children: ReactNode
}

export const ModalTrigger = ({ children }: ModalTriggerProps) => {
  const { handleOpen } = useModal()

  return <div onClick={handleOpen}>{children}</div>
}

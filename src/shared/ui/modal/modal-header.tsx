import type { ReactNode } from 'react'
import './modal.css'

export type ModalHeaderProps = {
  children: ReactNode
}

export const ModalHeader = ({ children }: ModalHeaderProps) => {
  return <div className="modal-header">{children}</div>
}

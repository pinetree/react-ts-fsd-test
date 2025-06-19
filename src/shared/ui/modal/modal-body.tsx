import type { ReactNode } from 'react'

export type ModalBodyProps = {
  children: ReactNode
}

export const ModalBody = ({ children }: ModalBodyProps) => {
  return <div className="modal-body">{children}</div>
}

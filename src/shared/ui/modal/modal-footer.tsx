import type { ReactNode } from 'react'

export type ModalFooterProps = {
  children: ReactNode
}

export const ModalFooter = ({ children }: ModalFooterProps) => {
  return <div className="modal-footer">{children}</div>
}

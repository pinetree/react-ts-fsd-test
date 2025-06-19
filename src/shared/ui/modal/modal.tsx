import { type ReactElement } from 'react'
import { ModalProvider } from './context'
import { ModalContent, type ModalContentProps } from './modal-content'
import { ModalTrigger, type ModalTriggerProps } from './modal-trigger'
import { ModalHeader } from './modal-header'
import { ModalClose } from './modal-close'
import { ModalBody } from './modal-body'
import { ModalFooter } from './modal-footer'
import './modal.css'

type AllowedModalChildren =
  | ReactElement<ModalTriggerProps>
  | ReactElement<ModalContentProps>

type ModalProps = {
  children: AllowedModalChildren | AllowedModalChildren[]
}

const Modal = ({ children }: ModalProps) => {
  return <ModalProvider>{children}</ModalProvider>
}

Modal.Trigger = ModalTrigger
Modal.Content = ModalContent
Modal.Header = ModalHeader
Modal.Close = ModalClose
Modal.Body = ModalBody
Modal.Footer = ModalFooter

export { Modal }

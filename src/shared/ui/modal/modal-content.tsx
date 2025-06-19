import { useEffect, type ReactElement } from 'react'
import { useFocusTrap } from '@/shared/hooks/use-focus-trap'
import { Portal } from '../portal'
import { useModal } from './context'
import type { ModalHeaderProps } from './modal-header'

type AllowedModalContentChildren = ReactElement<ModalHeaderProps>

export type ModalContentProps = {
  children: AllowedModalContentChildren | AllowedModalContentChildren[]
}

export const ModalContent = ({ children }: ModalContentProps) => {
  const { modalId, isOpen, handleClose } = useModal()
  const modalRef = useFocusTrap(isOpen)

  useEffect(() => {
    const closeOnEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    const closeOnTargetCloseClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.dataset.target === 'close' &&
        (target.closest('.modal') as HTMLElement)?.dataset.modalId === modalId
      ) {
        handleClose()
      }
    }

    window.addEventListener('click', closeOnTargetCloseClick)
    window.addEventListener('keydown', closeOnEsc)

    return () => {
      window.removeEventListener('click', closeOnTargetCloseClick)
      window.removeEventListener('keydown', closeOnEsc)
    }
  }, [handleClose, modalId])

  return (
    <Portal>
      {isOpen && (
        <div className="modal" data-modal-id={modalId} ref={modalRef}>
          <div className="modal-overlay" onClick={handleClose} />
          <div className="modal-content">{children}</div>
        </div>
      )}
    </Portal>
  )
}

import { useModal } from './context'
import closeIcon from './close.svg'
import './modal.css'

export const ModalClose = () => {
  const { handleClose } = useModal()

  return (
    <div className="modal-close" onClick={handleClose}>
      <img src={closeIcon} alt="Close" />
    </div>
  )
}

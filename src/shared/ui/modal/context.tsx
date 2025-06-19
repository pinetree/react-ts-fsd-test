import {
  createContext,
  useContext,
  useId,
  useState,
  type ReactNode,
} from 'react'

type ModalContextState = {
  modalId: string
  isOpen: boolean
  handleOpen: () => void
  handleClose: () => void
}

const ModalContext = createContext<ModalContextState>({
  modalId: '',
  isOpen: false,
  handleOpen: () => {},
  handleClose: () => {},
})

export const useModal = () => useContext(ModalContext)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const modalId = useId()
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  return (
    <ModalContext.Provider value={{ modalId, isOpen, handleOpen, handleClose }}>
      {children}
    </ModalContext.Provider>
  )
}

import { Modal } from '@/shared/ui/modal'

export const ModalPage = () => {
  return (
    <Modal>
      <Modal.Trigger>
        <button type="button">Open Modal</button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <h2>Modal</h2>
          <Modal.Close />
        </Modal.Header>
        <Modal.Body>
          <p>Modal content</p>
          <Modal>
            <Modal.Trigger>
              <button type="button">Open Modal2</button>
            </Modal.Trigger>
            <Modal.Content>
              <Modal.Header>
                <h2>Modal2</h2>
                <Modal.Close />
              </Modal.Header>
              <Modal.Body>
                <p>Modal content2</p>
              </Modal.Body>
              <Modal.Footer>
                <button type="button" data-target="close">
                  Отмена2
                </button>
                <button type="button">Сохранить2</button>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" data-target="close">
            Отмена
          </button>
          <button type="button">Сохранить</button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

function ModalEliminar({ isOpen, selectedCita, confirmDelete, handleClose }) {
  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent>
        <ModalHeader>Confirmar eliminación</ModalHeader>
        <ModalBody>
          <p>¿Estás seguro de que deseas eliminar la cita de {selectedCita?.nombre}?</p>
          <p className="text-sm text-gray-500">Esta acción no se puede deshacer.</p>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={handleClose}>Cancelar</Button>
          <Button color="danger" onPress={confirmDelete}>Eliminar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ModalEliminar;

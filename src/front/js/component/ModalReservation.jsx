import React, { useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import "../../styles/modalReservation.css"

export const ModalReservation = ({ show, handleCloseModal, pharmacy, medicineId, pharmacyId }) => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate()

    const handleReserve = async () => {
        const result = await actions.createOrderReservation(medicineId, pharmacyId);
        if (result.success) {
            handleCloseModal();
            navigate('/order-confirmation');
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleCloseModal} animation={false}>
                <Modal.Header className="header-modal" closeButton>
                    <Modal.Title>Completa tu Pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body className="body-modal">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Usuario</Form.Label>
                            <Form.Control type="text" placeholder={store.email} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Medicamento</Form.Label>
                            <Form.Control type="text" placeholder={store.selectedMedicine} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Farmacia</Form.Label>
                            <Form.Control type="text" placeholder={pharmacy.pharmacy_name} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Número de Pedido</Form.Label>
                            <p className="nr-pedido">Confirme para generar su numero de Pedido</p>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="footer-modal">
                    <Button variant="secondary" className="btn-close-lower" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                    <Button variant="" className="btn-confirm" onClick={handleReserve}>
                        Confirmar Pedido
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
};

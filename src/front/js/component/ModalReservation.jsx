import React, { useContext, useState, useEffect } from 'react';
import { Modal, Button, Form, Toast } from 'react-bootstrap';
import { Context } from '../store/appContext';

export const ModalReservation =({ show, handleCloseModal, pharmacy, medicineId, pharmacyId }) => {
    const { store, actions } = useContext(Context);
    // const [show, setShow] = useState(false); -->added to CardResults
    const [reservationNumber, setReservationNumber] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

     // generate a unique reservation number only when the modal is opened, and runs whenever show changes
    useEffect(() => {
        if (show) {
            const uniqueNumber = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
            setReservationNumber(uniqueNumber);
        }
    }, [show]);

    useEffect(() => {
        if (store.lastCreatedOrder) {
            setToastMessage("Reserva realizada con éxito.");
            setShowToast(true);
        }
    }, [store.lastCreatedOrder]);

    const handleReserve = () => {
        actions.createOrderReservation(medicineId, pharmacyId); 
        handleCloseModal()
        // setToastMessage("Reserva realizada con éxito.");
        // setShowToast(true);
 
        
    };

    return (
        <>
        <Modal show={show} onHide={handleCloseModal} animation={false}>
        <Modal.Header closeButton>
        <Modal.Title>Haz tu Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
            <Form.Group className="mb-3">
            <Form.Label>Usuario</Form.Label>
            <Form.Control type="text" placeholder={store.email} readOnly /> {/*ADD email to store!! or take it from session?*/}
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Medicamento</Form.Label>
            <Form.Control type="text" placeholder={store.selectedMedicine} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Pharmacy</Form.Label>
            <Form.Control type="text" placeholder={pharmacy.pharmacy_name} readOnly />           {/*CHECK/ADD pharmacy to store? or take it from session?*/}
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Numero de reserva</Form.Label>
            <Form.Control type="text" placeholder={reservationNumber} readOnly />
            </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
        </Button>
        <Button variant="primary" onClick={handleReserve}>
            Confirmar Reserva
        </Button>
        </Modal.Footer>
    </Modal>
    <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide position="top-end">
    <Toast.Header>
        <strong className="me-auto">Reserva confirmada</strong>
    </Toast.Header>
    <Toast.Body>Tu numero de reserva es: {reservationNumber}</Toast.Body>
    </Toast>
    </>
    )
};

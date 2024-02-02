import React, { useContext, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap'
import { Context } from '../store/appContext';

export const ModalReservation =({ show, handleClose, pharmacy, medicineId, pharmacyId }) => {
    const { store, actions } = useContext(Context);
    // const [show, setShow] = useState(false); -->added to CardResults
    const [reservationNumber, setReservationNumber] = useState("");

    const handleReserve = () => {
        actions.createOrderReservation(medicineId, pharmacyId, reservationNumber);
        handleClose(); 
    };
    
    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);
    // const handleReserve = () => {
    //     actions.createOrderReservation(store.selectedMedicine.id, pharmacy.id, reservationNumber);
    //     handleClose();
    // };

    return (
        <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
        <Modal.Title>Medicine Reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
            <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder={store.username} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Medicine</Form.Label>
            <Form.Control type="text" placeholder={store.selectedMedicine.name} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Pharmacy</Form.Label>
            <Form.Control type="text" placeholder={pharmacy.name} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Reservation Number</Form.Label>
            <Form.Control type="text" placeholder="Enter reservation number" value={reservationNumber} onChange={(e) => setReservationNumber(e.target.value)} />
            </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
            Close
        </Button>
        <Button variant="primary" onClick={handleReserve}>
            Confirm Reservation
        </Button>
        </Modal.Footer>
    </Modal>

    )
};

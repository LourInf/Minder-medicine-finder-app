
import React, { useContext, userContext, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';


export const ModalModification = ({ show, handleCloseModal, patient_id }) => {

    const { store, actions } = useContext(Context);
    const [ newData, setNewData ] = useState({});
    const navigate = useNavigate();


    const handleModification = async () => {
        // const result = 
        await actions.updatePatient(patient_id, newData);
        handleCloseModal();
        navigate("/patient");
        //  Comprobación de errores??
    }

    const handleDeletePatient = async () => {
        // await actions.deletePatient_User(patient_id);
        await actions.getPatientId(patient_id);
        handleCloseModal();
        navigate("/");

    }



    return (
        <>
        <Modal show={show} onHide={handleCloseModal} animation={false}>
        <Modal.Header closeButton>
        <Modal.Title>Edita tu perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
            <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder={store.patient_name} onChange={(e) => setNewData({"name": e.target.value})}/>
            </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
        </Button>
        <Button variant="danger" onClick={handleDeletePatient}>
            Borrar paciente
        </Button>
        <Button variant="primary" onClick={handleModification}>
            Editar
        </Button>
        </Modal.Footer>
        </Modal>
        </>
    );



}





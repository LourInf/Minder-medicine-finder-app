
import React, { useContext, userContext, useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';


export const ModalModification = ({ show, handleCloseModal, pharmacy_id }) => {

    const { store, actions } = useContext(Context);
    const [newData, setNewData] = useState({});
    const [detailsPharma, setDetailsPharma] = useState({});
    const navigate = useNavigate();



    useEffect(() => {

        const getPharmaDetails = async () => {
            setDetailsPharma(await actions.getOurPharmacyDetails(store.user_id));
            console.log("details dentro -> ", detailsPharma);
            // return details;
        }

        getPharmaDetails();
        console.log("detailsPharma fuera -> ", detailsPharma);


    }, []);



    const handleModification = async () => {
        // const result = 
        await actions.updatePharmacy(pharmacy_id, newData);
        handleCloseModal();
        navigate("/pharmacy");
        //  Comprobación de errores??
    }

    const handleDeletePharmacy = async () => {
        // await actions.deletePatient_User(patient_id);
        const deleted = await actions.deletePharmacy_User(pharmacy_id);
        handleCloseModal();
        console.log("deleted -> ", deleted);
        if (deleted.deleted) {
            actions.logout();
            navigate("/");
            return
        }
        alert("Error deleting the pharmacy, try again later");

    }



    return (


        // <p><b>ID de usuario</b>: {store.user_id}</p>
        // <p><b>ID de Farmacia</b> (Nuestra BD): {store.pharmacy_id}</p>
        // <p><b>Nombre de farmacia</b>: {detailsPharma.pharmacy_name}</p>
        // <p><b>Número de Farmacia SOE</b>: {detailsPharma.pharmacy_SOE}</p>
        // <p><b>Ciudad</b>: {detailsPharma.pharmacy_address}</p>
        // <p><b>24H</b>: {detailsPharma.pharmacy_24H ? "Sí" : "No"}</p>
        // <p><b>Teléfono</b>: {detailsPharma.pharmacy_phone}</p>
        // <p><b>Horarios</b>: {detailsPharma.pharmacy_working_hours}</p>

        // "pharmacy_id": pharmacy.id,
        // "pharmacy_user_id": pharmacy.users.id,
        // "pharmacy_name": pharmacy.pharmacy_name,
        // "pharmacy_SOE": pharmacy.SOE_pharmacy_number,
        // "pharmacy_address": pharmacy.address,
        // "pharmacy_phone": pharmacy.phone,
        // "pharmacy_24H": pharmacy.is_24h,
        // "pharmacy_working_hours": pharmacy.working_hours,
        // "pharmacy_orders": pharmacy.orders

        <>
            {store.user_id !== null && detailsPharma.pharmacy_name ? (
                <Modal show={show} onHide={handleCloseModal} animation={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edita tu Farmacia</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre de Farmacia</Form.Label>
                                <Form.Control type="text" placeholder={detailsPharma.pharmacy_name} onChange={(e) => setNewData({ "pharmacy_name": e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Número SOE de farmacia</Form.Label>
                                <Form.Control type="text" placeholder={detailsPharma.pharmacy_SOE} onChange={(e) => setNewData({ "SOE_pharmacy_number": e.target.value })} />
                            </Form.Group>                            
                            <Form.Group className="mb-3">
                                <Form.Label>Teléfono de Farmacia</Form.Label>
                                <Form.Control type="text" placeholder={detailsPharma.pharmacy_phone} onChange={(e) => setNewData({ "phone": e.target.value })} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Horarios de Farmacia</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder={detailsPharma.pharmacy_working_hours} onChange={(e) => setNewData({ "working_hours": e.target.value })} />
                                <textarea className='form-control mt-2' rows={3} value={detailsPharma.pharmacy_working_hours} readOnly/>
                                <Form.Label>Horario Actual</Form.Label>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cerrar
                        </Button>
                        <Button variant="danger" onClick={handleDeletePharmacy}>
                            Borrar farmacia
                        </Button>
                        <Button variant="primary" onClick={handleModification}>
                            Editar
                        </Button>
                    </Modal.Footer>
                </Modal>
            ) : (
                <p>Cargando tu información</p>
            )}

        </>
    );



}





import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/cardResults.css";
import { Card, Button, ListGroup, ListGroupItem, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { faPhone, faKeyboard, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { ModalReservation } from './ModalReservation.jsx';
import { useNavigate } from "react-router-dom";


export const CardResults = ({ medicineId, pharmacyId, pharmacy, buttonType }) => { 
  const { store, actions } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  // const [showToast, setShowToast] = useState(false);
  // const [toastMessage, setToastMessage] = useState("");

  const handleButtonClick = () => {
    if (buttonType === 'reserve') {
      handleReserveOnline();
    } else if (buttonType === 'details') {
      navigate(`/pharmacies-details/${place_id}`);
    }
  };

  const handleReserveOnline = () => {
    actions.setSelectedPharmacy(pharmacy);
    if (!store.isLoggedIn) {
      actions.setUrlLogin(medicineId)
      navigate('/login');  
    } else {
      // User is logged in, then show the modal directly
      setShowModal(true);
    }
  };

  
  const closeModal = () => {
    setShowModal(false);
  };


  // const displayToast = (message) => {
  //   setToastMessage(message);
  //   setShowToast(true);
  //   //const toastTimeout = setTimeout(() => setShowToast(false), 5000);
  // };

  // useEffect(() => {
  //   return () => {
  //     clearTimeout(toastTimeout);
  //   };
  // }, []);
  

  return (
    <div>
      {/* <small className="distance-item mb-2 text-muted">0.4km</small> */}
      <div className="card-wrapper">
        <Card className="card-container">
            <Card.Body>
                <Card.Title>{pharmacy?.pharmacy_name || pharmacy?.name}</Card.Title>
                <ListGroup className="list-group">
                <ListGroupItem className={`working-hours-item ${pharmacy?.opening_hours?.open_now ? 'text-success' : 'text-danger'}`}>
                  <FontAwesomeIcon icon={faClock} className="pe-2" />{pharmacy?.opening_hours?.open_now ? "Abierta Ahora" : "Cerrada Ahora"}
                </ListGroupItem>
                </ListGroup>
            </Card.Body>
            <Card.Footer className="text-muted">
                <div className="card-actions">
                    <Button variant={buttonType === 'reserve' ? 'outline-success' : 'outline-warning'} size="sm" className="btn-reserve-online" onClick={handleButtonClick}>
                        {buttonType === 'reserve' ? <FontAwesomeIcon icon={faKeyboard} /> : <FontAwesomeIcon icon={faInfoCircle} />}
                        {buttonType === 'reserve' ? 'Reservar Online' : 'Datos de contacto'}
                    </Button>
                    <OverlayTrigger key="top" placement="top"
                      overlay={<Tooltip id={`tooltip-top`}> Teléfono: {pharmacy.phone}</Tooltip>}>
                      <Card.Link className="btn-reserve-phone" variant="outline-primary" size="sm"><FontAwesomeIcon icon={faPhone} /> Reservar por teléfono</Card.Link>
                    </OverlayTrigger>
                </div>
            </Card.Footer>
        </Card>
      {showModal && <ModalReservation show={showModal} handleCloseModal={closeModal} pharmacy={pharmacy} medicineId={medicineId} pharmacyId={pharmacyId}/>}
      {/* <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide position="top-center">
        <Toast.Header>
          <strong className="me-auto">Reserva confirmada</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast> */}
      </div>
    </div>
  );
}

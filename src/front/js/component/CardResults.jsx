import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/cardResults.css";
import { Card, Button, ListGroup, ListGroupItem, Toast } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { faPhone, faKeyboard } from '@fortawesome/free-solid-svg-icons'
import { ModalReservation } from './ModalReservation.jsx';
import { useNavigate } from "react-router-dom";


export const CardResults = ({ medicineId, pharmacyId, pharmacy }) => { 
  const { store, actions } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleReserveOnline = () => {
    if (!store.isLoggedIn) {
      actions.setUrlLogin(medicineId)
      // const afterLogin = () => setShowModal(true);
      // actions.setPostLoginAction(afterLogin);
      navigate('/login');
    } else {
      // User is logged in, then show the modal directly
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  return (
    <div>
      <small className="distance-item mb-2 text-muted">0.4km</small>
      <div className="card-wrapper">
        <Card className="card-container details">
          <Card.Body>
            <Card.Title>{pharmacy?.pharmacy_name || pharmacy?.name}</Card.Title>   {/*we have different name conventions in google API vs our DB, so we need to put both (eg. pharmacy_name in our DB and pharmacy.name in google API)*/}
            <ListGroup className="list-group card-group">
              <ListGroupItem className="address-item">  {pharmacy?.vicinity || pharmacy.address}</ListGroupItem>
              <ListGroupItem className="working-hours-item">   {pharmacy?.opening_hours || pharmacy?.working_hours ? (
                                    <span className="icon-clock">
                                        <FontAwesomeIcon icon={faClock} />
                                        {pharmacy.opening_hours?.open_now ? "Abierto Ahora" : "Cerrado" }
                                    </span>
                                ) : "consultar horario"}
             </ListGroupItem>
            </ListGroup>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted disponibilidad-text">Disponibilidad actualizada hace 3h</small>
          </Card.Footer>
        </Card>
        <Card className="card-container contact">
          <Card.Body>
            <ListGroup className="list-group card-group">
             <Button variant="outline-primary" size="sm" className="btn-reserve-online" onClick={handleReserveOnline}><span className="icon-keyboard"><FontAwesomeIcon icon={faKeyboard} /> Reservar online</span></Button>
              <Card.Link href="#"><span className="icon-phone"><FontAwesomeIcon icon={faPhone} /> Reservar por teléfono</span></Card.Link>
            </ListGroup>
          </Card.Body>
        </Card>
      {showModal && <ModalReservation show={showModal} handleCloseModal={closeModal} pharmacy={pharmacy} medicineId={medicineId} pharmacyId={pharmacyId} displayToast={displayToast}/>}
      <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide position="top-center">
        <Toast.Header>
          <strong className="me-auto">Reserva confirmada</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
      </div>
    </div>
  );
}

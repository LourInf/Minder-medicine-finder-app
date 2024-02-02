import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/cardResults.css";
import { Card, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { faPhone, faKeyboard } from '@fortawesome/free-solid-svg-icons'
import { ModalReservation } from './ModalReservation.jsx';
import { useNavigate } from "react-router-dom";


export const CardResults = ({ medicineId, pharmacyId, pharmacy }) => { 
  const { store, actions } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

    // Check if the user is logged in before showing the modal
    const handleReserveOnline = () => {
      if (!store.isLoggedIn) {
        // Save the post-login action before redirecting
        actions.setPostLoginAction({ type: 'reserve', medicineId, pharmacyId });
    
        // Redirect to login
        navigate('/login');
      } else {
        // User is logged in, show the reservation modal
        setShowModal(true);
      }
    };



  // const handleReserveOnline = () => {
  //   actions.createOrderReservation(medicineId, pharmacyId);
  // };

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
        {/* Conditional rendering of the ModalReservation based on showModal state */}
      {showModal && <ModalReservation show={showModal} handleClose={handleReserveOnline} pharmacy={pharmacy} medicineId={medicineId} pharmacyId={pharmacyId} />}
      </div>
    </div>
  );
}

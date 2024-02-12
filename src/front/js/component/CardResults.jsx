import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/cardResults.css";
import { Card, Button, ListGroup, ListGroupItem, Tooltip, OverlayTrigger, Table, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { faPhone, faKeyboard, faInfoCircle, faStoreAlt } from '@fortawesome/free-solid-svg-icons'
import { ModalReservation } from './ModalReservation.jsx';
import { useNavigate } from "react-router-dom";
import logoImage from "../../img/logo.png"


export const CardResults = ({ medicineId, cityName, pharmacyId, pharmacy, buttonType }) => { 
  const { store, actions } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();


  const handleReserveOnline = () => {
    actions.setSelectedPharmacy(pharmacy);
    if (!store.isLoggedIn) {
      actions.setUrlLogin(medicineId, cityName)
      navigate('/login');  
    } else {
      // User is logged in, then show the modal directly
      setShowModal(true);
    }
  };

  
  const closeModal = () => {
    setShowModal(false);
  };


  return (
    <div>
      <div className="card-wrapper">
        <div className="custom-card-body">
          <img src={logoImage} alt="Pharmacy Logo" className="pharmacy-logo" /> 
          <h2 className="custom-card-title">{pharmacy?.pharmacy_name || 'Nombre de la Farmacia'}</h2>
          <div className="details">
            <div className="working-hours">
              <FontAwesomeIcon icon={faClock} className="pe-2" />
              {pharmacy?.working_hours || 'Horario no disponible'}
            </div>
            {pharmacy?.is_24h && (
              <div className="text-success">
                <FontAwesomeIcon icon={faStoreAlt} className="pe-2" />
                Farmacia de 24 Horas
              </div>
            )}
          </div>
        </div>
        <div className="custom-card-footer">
          <div className="card-actions">
            <Button variant={buttonType === 'reserve' ? 'outline-success' : 'outline-warning'} size="sm" className="btn-reserve-online" onClick={handleReserveOnline}>
              <FontAwesomeIcon icon={faKeyboard} /> Reservar Online 
            </Button>
            <OverlayTrigger key="top" placement="top"  delay={{ show: 250, hide: 400 }} overlay={<Tooltip id={`tooltip-top`}> Tel: {pharmacy?.phone}</Tooltip>}>
                    <Card.Link className="btn-reserve-phone" variant="outline-primary" size="sm"><FontAwesomeIcon icon={faPhone} /> Teléfono</Card.Link>
                    </OverlayTrigger>
          </div>
        </div>
        {showModal && <ModalReservation show={showModal} handleCloseModal={closeModal} pharmacy={pharmacy} medicineId={medicineId} pharmacyId={pharmacyId} />}
      </div>
    </div>
  );
};
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/cardResults.css";
import { Card, Button, ListGroup, ListGroupItem, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { faPhone, faKeyboard, faInfoCircle, faStoreAlt } from '@fortawesome/free-solid-svg-icons'
import { ModalReservation } from './ModalReservation.jsx';
import { useNavigate } from "react-router-dom";
import logoImage from "../../img/logo.png"


export const CardResults = ({ medicineId, cityName, pharmacyId, pharmacy, buttonType, place_id }) => { 
  const { store, actions } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = (place_id) => {
    if (buttonType === 'reserve') {
      handleReserveOnline();
    } else if (buttonType === 'details') {
      navigate(`/pharmacies-details/${place_id}`);
    }
  };

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
    <div className="card-wrapper custom-card-container">
      <div className="custom-card-body">
        <h2 className="custom-card-title">{pharmacy?.pharmacy_name || pharmacy?.name}</h2>
        <div className="details">
          <div className={`working-hours-item ${pharmacy?.opening_hours?.open_now ? 'text-success' : 'text-danger'}`}>
            <FontAwesomeIcon icon={faClock} className="pe-2" />
            {pharmacy?.opening_hours?.open_now ? "Abierta Ahora" : "Cerrada Ahora"}
          </div>
          {pharmacy?.is_24h && (
            <div className="text-success">
              <FontAwesomeIcon icon={faStoreAlt} className="pe-2" />
              Farmacia de 24 Horas
            </div>
          )}
        </div>
      </div>
      <div className="custom-card-footer text-muted">
        <div className="card-actions">
          <Button variant={buttonType === 'reserve' ? 'outline-success' : 'outline-warning'} size="sm" className="btn-reserve-online" onClick={() => handleButtonClick(place_id)}>
                        {buttonType === 'reserve' ? <FontAwesomeIcon icon={faKeyboard} /> : <FontAwesomeIcon icon={faInfoCircle} />}
                        {buttonType === 'reserve' ? 'Reservar Online' : 'Datos de contacto'}
                    </Button>
                    <OverlayTrigger key="top" placement="top"
                      overlay={<Tooltip id={`tooltip-top`}> Tel: {pharmacy.phone}</Tooltip>}>
                    <Card.Link className="btn-reserve-phone" variant="outline-primary" size="sm"><FontAwesomeIcon icon={faPhone} /> Reservar por teléfono</Card.Link>
                    </OverlayTrigger>

        </div>
      </div>
    </div>
    {showModal && <ModalReservation show={showModal} handleCloseModal={closeModal} pharmacy={pharmacy} medicineId={medicineId} pharmacyId={pharmacyId} />}
  </div>
);
};
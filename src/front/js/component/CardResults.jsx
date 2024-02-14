import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/cardResults.css";
import { Card, Button, Tooltip, OverlayTrigger, Collapse } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { faPhone, faKeyboard, faInfoCircle, faStoreAlt, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { ModalReservation } from './ModalReservation.jsx';
import { useNavigate } from "react-router-dom";
import logoImage from "../../img/logo.png"


export const CardResults = ({ medicineId, cityName, pharmacyId, pharmacy, buttonType }) => { 
  const { store, actions } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const [openWorkingHours, setOpenWorkingHours] = useState(false);
  const [openPhone, setOpenPhone] = useState(false);
  const [openAddress, setOpenAddress] = useState(false);
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
      <div className="card-wrapper d-flex flex-row justify-content-between">
        
        <div className="custom-card-body d-flex align-items-center">
          <img src={logoImage} alt="Pharmacy Logo" className="pharmacy-logo" /> 
          <div className="d-flex flex-column">
          <h3 className="custom-card-title">{pharmacy?.pharmacy_name || 'Nombre de la Farmacia'}</h3>
          {pharmacy?.is_24h && (
          <div className="text-24h d-flex flex-column-start">
            Abierta 24h
          </div>
        )}
      </div>
      </div>
          <div className="details-style d-flex flex-column align-items-start">
            <Button variant= "" onClick={() => setOpenWorkingHours(!openWorkingHours)} aria-controls="working-hours-collapse" aria-expanded={openWorkingHours} className="btn-details-style d-flex justify-content-start p-0 text-decoration-none"> <FontAwesomeIcon icon={faClock} className="me-2" />
              Horario de trabajo
              <FontAwesomeIcon icon={openWorkingHours ? faChevronUp : faChevronDown} className="ms-auto" />
            </Button>
            <Collapse in={openWorkingHours}>
              <ul id="working-hours-collapse" className="list-unstyled mt-4">
                {pharmacy?.working_hours && typeof pharmacy.working_hours === 'string' ? (
                  pharmacy.working_hours.split(';').map((hour, index) => (
                    <li key={index}>{hour.trim()}</li>))
                ) : (
                  <li>Horario no disponible</li>)}
              </ul>
            </Collapse>
            <Button variant= "" onClick={() => setOpenPhone(!openPhone)} aria-controls="phone-collapse" aria-expanded={openPhone} className="btn-details-style d-flex justify-content-start p-0 text-decoration-none mt-2">
              <FontAwesomeIcon icon={faPhone} className="me-2" />Teléfono
              <FontAwesomeIcon icon={openPhone ? faChevronUp : faChevronDown} className="ms-auto" />
            </Button>
            <Collapse in={openPhone}>
              <div id="phone-collapse" className="m-2">
               {pharmacy?.phone ? (
                <a href={`tel:${pharmacy.phone}`} className="phone-link">
                  {pharmacy.phone}
                </a>
              ) : 'Teléfono no disponible'}
            </div>
            </Collapse>
            <Button variant= "" onClick={() => setOpenAddress(!openAddress)} aria-controls="address-collapse" aria-expanded={openAddress} className="btn-details-style d-flex justify-content-start p-0 text-decoration-none mt-2"> <FontAwesomeIcon icon={faStoreAlt} className="me-2" />
              Dirección
              <FontAwesomeIcon icon={openAddress ? faChevronUp : faChevronDown} className="ms-auto" />
            </Button>
            <Collapse in={openAddress}>
              <div id="address-collapse" className="m-2">
                {pharmacy?.address ? (
                  <p>{pharmacy.address}</p>
                ) : (
                  <p>Dirección no disponible</p>)}
              </div>
            </Collapse>
          </div>
          <div className="card-actions d-flex align-items-center">
            <Button variant={buttonType === 'reserve' ? 'outline-success' : 'outline-warning'} size="sm" className="btn-reserve-online" onClick={handleReserveOnline}>
              <FontAwesomeIcon icon={faKeyboard} /> Reservar Online </Button>
          </div>
        {showModal && <ModalReservation show={showModal} handleCloseModal={closeModal} pharmacy={pharmacy} medicineId={medicineId} pharmacyId={pharmacyId} />}
      </div>
  );
};
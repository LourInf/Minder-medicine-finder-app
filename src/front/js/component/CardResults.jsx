import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import "../../styles/cardResults.css";
import { Card, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { faPhone, faKeyboard } from '@fortawesome/free-solid-svg-icons'

export const CardResults = ({ medicineId, pharmacyId, pharmacy }) => { 
  const { store, actions } = useContext(Context);

  const handleReserveOnline = () => {
    actions.createOrderReservation(medicineId, pharmacyId);
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
      </div>
    </div>
  );
}

import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import "../../styles/orderConfirmation.css";
import confetti from "../../img/confetti.png";
import { Button } from 'react-bootstrap';

export const OrderConfirmation = () => { 
  const { store } = useContext(Context);
  const navigate = useNavigate();

  const orderDetails = store.orderConfirmationDetails;

  return (
    <div className="container-order-confirmation text-center">
    <img src={confetti} className="confetti-image" alt="Confetti" />
      <h3 className="main-text m-3">Pedido realizado ¡Gracias!</h3>
      {orderDetails ? (
        <>
          <h3>Tu numero de reserva es: {orderDetails.id}</h3>
          <p className="pb-3 pt-3">En breve recibirá la confirmación por parte de la farmacia</p>
          <Button variant="" onClick={() => navigate('/patient/orders')} className="btn-goto-reservations">Ver mis reservas</Button>
          <Button variant="" onClick={() => navigate('/')} className="btn-search-again ms-2">Buscar otro medicamento</Button>
        </>
      ) : (
        <p>No hay ninguna reserva.</p>
      )}
    </div>
  );
};
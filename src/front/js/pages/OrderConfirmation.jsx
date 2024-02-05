import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import "../../styles/cardResults.css";
import confetti from "../../img/confetti.png";
import { Button } from 'react-bootstrap';

export const OrderConfirmation = () => { 
  const { store } = useContext(Context);
  const navigate = useNavigate();

  const orderDetails = store.orderConfirmationDetails;

  return (
    <div className="container text-center">
    <img src={confetti} alt="Confetti" />
      <h3>Pedido realizado ¡Gracias!</h3>
      {orderDetails ? (
        <>
          <h3>Tu numero de reserva es: {orderDetails.id}</h3>
          <p>¡Pedido confirmado! Gracias por su reserva.</p>
          <Button variant="info" onClick={() => navigate('/patient/orders')}>Ver mis reservas</Button>
          <Button variant="outline-info" onClick={() => navigate('/')} className="ms-2">Buscar otro medicamento</Button>
        </>
      ) : (
        <p>No hay ninguna reserva.</p>
      )}
    </div>
  );
};
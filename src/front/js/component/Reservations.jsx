import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js" 
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';

export const Reservations = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getPharmacyOrders();
    }, [actions.getPharmacyOrders]);

    return (
      <div className="container">
        <h3 className="m-3 text-center">Reservas:</h3>
        <p className="m-3 text-center">Total reservas:{store.ordersToPharmacy.length} </p>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th># Reserva</th>
              <th>Medicamento</th> 
              <th>Usuario</th> 
              <th>Tiempo de reserva</th> {/*tienes hasta <fecha> para recoger el medicamento*/}
              <th>Order Status</th> {/*Pendiente, Aceptada, Cancelada, Recogida*/}
              </tr>
          </thead>
          
          <tbody>
          {store.ordersToPharmacy.map((reservation, index) => (
            <tr key={index}>
              <td>Reserva número {reservation.id}</td>
              <td>{reservation.medicine ? reservation.medicine.medicine_name : 'N/A'}</td>
              <td>{reservation.pharmacy ? reservation.patient.name : 'N/A'}</td>
              <td>Tiene 24h para recoger el medicamento</td>
              <td>{reservation.order_status}</td>
            </tr>
          ))}
          </tbody>
        </Table>    
              
      </div>
    );
  };

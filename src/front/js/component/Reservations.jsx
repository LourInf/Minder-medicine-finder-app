import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js" 
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';

export const Reservations = () => {
  const { store, actions } = useContext(Context);

   // Filter the orders to get reservations for the selected pharmacy
   const selectedPharmacyId = store.selectedPharmacy ? store.selectedPharmacy.id : null;
   const reservations = store.orders.filter(order => order.order_status === "Pendiente" && order.pharmacy_id === selectedPharmacyId);
 

    return (
      <div className="container">
        <h3 className="m-3 text-center">Reservas:</h3>
        <p className="m-3 text-center">Total reservas:{reservations.length} </p>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th># Reserva</th>
              <th>Medicamento</th> 
              <th>Farmacia</th> 
              <th>Tiempo de reserva</th> {/*tienes hasta <fecha> para recoger el medicamento*/}
              <th>Order Status</th> {/*Pendiente, Aceptada, Cancelada, Recogida*/}
              </tr>
          </thead>
          
          <tbody>
          {reservations.map((reservation, index) => (
            <tr key={index}>
              <td>Reserva número {reservation.id}</td>
              <td>{reservation.medicine.medicine_name}</td>
              <td>{reservation.pharmacy.pharmacy_name}</td>
              <td>Tienes hasta {reservation.validity_date} para recoger el medicamento</td>
              <td>{reservation.order_status}</td>
            </tr>
          ))}
          </tbody>
        </Table>    
              
      </div>
    );
  };

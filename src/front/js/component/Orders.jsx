import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js" 
import Table from 'react-bootstrap/Table';

export const Orders = () => {
  const { store, actions } = useContext(Context);

    return (
      <div className="container">
        <h3 className="m-3 text-center">Orders:</h3>
        <p className="m-3 text-center">Total active orders: </p>
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
            <tr>
              <td>Reserva numer 1</td>
              <td>Medicamento A</td>
              <td>Famacia 1 A</td>
              <td>Tiene 24h para recoger el medicamento</td>
              <td>Pendiente</td>
            </tr>
          </tbody>
        </Table>    
      </div>
    );
  };
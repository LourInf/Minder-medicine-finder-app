import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js" 
import Table from 'react-bootstrap/Table';

export const Orders = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getOrders();
  }, []); 


    return (
      <div className="container">
        <h3 className="m-3 text-center">Estas son todas tus reservas</h3>
        {/*<p className="m-3 text-center">Total active orders: {store.orders.length}</p>*/}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th># Reserva</th>
                        <th>Medicamento</th>
                        <th>Farmacia</th>
                        <th>Tiempo de reserva</th>
                        <th>Order Status</th>
                    </tr>
                </thead>
                <tbody>
                    {store.orders.map((order, index) => (
                        <tr key={index}>
                            <td>{order.id}</td>
                            <td>{store.selectedMedicine}</td>  {/* NOT WORKING! */}
                            <td>tbd - Pharmacy name </td>  {/* Where to get pharmacy name from??? */}
                            <td>Tiene 24 h para recoger el medicamento</td>
                            <td>{order.order_status}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
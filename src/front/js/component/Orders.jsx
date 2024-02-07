import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js" 
import  { Table, Badge, Button }  from 'react-bootstrap';

export const Orders = () => {
  const { store, actions } = useContext(Context);
  const [filter, setFilter] = useState('');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pendiente':
        return <Badge pill bg="warning" text="dark" className="p-2">Pendiente</Badge>;
      case 'Aceptada':
        return <Badge pill bg="success" className="p-2">Aceptada</Badge>;
      case 'Rechazada':
        return <Badge pill bg="danger" className="p-2">Cancelada</Badge>;
      case 'Recogida':
        return <Badge pill bg="info" className="p-2">Recogida</Badge>;
      default:
        return <Badge pill bg="secondary" className="p-2">Desconocido</Badge>;
    }
  };


  //we run it when log in once, and then again here, in case new orders or modifications are made while logged in
  useEffect(() => {
    actions.getUserOrders();
  }, []); 

  const handleCancelOrder = (orderId) => {
    console.log("Cancelling order with status: Rechazada");
    actions.updateOrderStatus(orderId, "REJECTED");
    actions.getUserOrders()
};

  const handleFilterClick = (status) => {
    setFilter(status);
};

  const filteredOrders = store.orders.filter(order => filter === '' || order.order_status === filter);

    return (
      <div className="container">
        <h3 className="m-3 text-center">Estas son todas tus reservas</h3>
        {/*<p className="m-3 text-center">Total active orders: {store.orders.length}</p>*/}
        <div className="d-flex justify-content-center mb-3">
          <Badge pill bg="warning" text="dark" className="mx-2 p-2" onClick={() => handleFilterClick('Pendiente')} style={{ cursor: 'pointer' }}>Pendiente</Badge>
          <Badge pill bg="success" className="mx-2 p-2" onClick={() => handleFilterClick('Aceptada')} style={{ cursor: 'pointer' }}>Aceptada</Badge>
          <Badge pill bg="danger" className="mx-2 p-2" onClick={() => handleFilterClick('Cancelada')} style={{ cursor: 'pointer' }}>Cancelada</Badge>
          <Badge pill bg="info" className="mx-2 p-2" onClick={() => handleFilterClick('Recogida')} style={{ cursor: 'pointer' }}>Recogida</Badge>
          <Badge pill bg="secondary" className="mx-2 p-2" onClick={() => setFilter('')} style={{ cursor: 'pointer' }}>Mostrar Todo</Badge>
        </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th># Reserva</th>
                        <th>Medicamento</th>
                        <th>Farmacia</th>
                        <th>Tiempo de reserva</th>
                        <th>Order Status</th>
                        <th>Acción</th> 
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order, index) => (
                        <tr key={index}>
                            <td>{order.id}</td>
                            <td>{order.medicine_name}</td> 
                            <td>{order.pharmacy_name}</td> 
                            <td>Tiene 24 h para recoger el medicamento</td>
                            <td>{getStatusBadge(order.order_status)}</td>
                            <td>{order.order_status === "Pendiente" && (<Button  variant="outline-danger"  className="rounded-pill"  onClick={() => handleCancelOrder(order.id)}>Cancelar</Button> )}</td> {/* REMOVED FOR NOW: <Button variant="outline-success" className="rounded-pill ">Ver Detalles</Button> */}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
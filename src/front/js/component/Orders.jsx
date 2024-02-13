import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js" 
import  { Table, Badge, Button }  from 'react-bootstrap';
import "../../styles/orders.css";

export const Orders = () => {
  const { store, actions } = useContext(Context);
  const [filter, setFilter] = useState('');

  actions.removeUnnecessaryItems();

  const pendienteCount = store.ordersToPharmacy.filter(order => order.order_status === 'Pendiente').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pendiente':
        return <Badge pill bg="" className="badge-soft-warning p-2">Pendiente</Badge>;
      case 'Aceptada':
        return <Badge pill bg="" className="badge-soft-success p-2">Aceptada</Badge>;
      case 'Rechazada':
        return <Badge pill bg="" className="badge-soft-danger p-2">Cancelada</Badge>;
      case 'Recogida':
        return <Badge pill bg="" className="badge-soft-info p-2">Recogida</Badge>;
      default:
        return <Badge pill bg="" className="badge-soft-secondary p-2">Desconocido</Badge>;
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
      <div className="orders-container">
        <div className="filters-container d-flex flex-column align-items-center mb-3">
          <span className="filter-text mb-2">Filtros:</span> 
          <div className="pills-menu-style d-flex justify-content-center">
            <Badge pill bg="" className="badge-soft-warning filter-badge mx-2 p-2" onClick={() => handleFilterClick('Pendiente')} style={{ cursor: 'pointer' }}> Pendiente {pendienteCount > 0 && (
              <Badge pill bg="danger" className="position-absolute badge-notification">{pendienteCount}</Badge>)}</Badge>
            <Badge pill bg="" className="badge-soft-success filter-badge mx-2 p-2" onClick={() => handleFilterClick('Aceptada')} style={{ cursor: 'pointer' }}>Aceptada</Badge>
            <Badge pill bg="" className="badge-soft-danger filter-badge mx-2 p-2" onClick={() => handleFilterClick('Rechazada')} style={{ cursor: 'pointer' }}>Cancelada</Badge>
            <Badge pill bg="" className="badge-soft-info filter-badge mx-2 p-2" onClick={() => handleFilterClick('Recogida')} style={{ cursor: 'pointer' }}>Recogida</Badge>
            <Badge pill bg="" className="badge-soft-secondary filter-badge mx-2 p-2" onClick={() => setFilter('')} style={{ cursor: 'pointer' }}>Mostrar Todo</Badge>
          </div>
        </div>
        <div className="table-container hover-shadow">
            <Table table-style>
                <thead className="table-head-style">
                    <tr>
                        <th className="table-cell header" style={{ color: "#3ab0a7", }}>Reserva</th>
                        <th className="table-cell header" style={{ color: "#00c895", }}>Medicamento</th>
                        <th className="table-cell header" style={{ color: "#00a747", }}>Farmacia</th>
                        <th className="table-cell header" style={{ color: "#3ab0a7", }}>Tiempo de reserva</th>
                        <th className="table-cell header" style={{ color: "#007085", }}>Estado</th>
                        <th className="table-cell header">Acción</th> 
                    </tr>
                </thead>
                <tbody className="table-body">
                    {filteredOrders.map((order, index) => (
                        <tr key={index}>
                            <td className="table-cell body-row order-nr"># {order.id}</td>
                            <td className="table-cell body-row">{order.medicine_name}</td> 
                            <td className="table-cell body-row">{order.pharmacy_name}</td>
                            <td className="table-cell body-row time">
                              {order.order_status === "Aceptada" && "Dispone de 24 h para recogerlo"}
                            </td>
                            <td className="table-cell body-row">{getStatusBadge(order.order_status)}</td>
                            <td className="table-cell body-row">{order.order_status === "Pendiente" && (<Button  variant="outline-danger"  className="rounded-pill"  onClick={() => handleCancelOrder(order.id)}>Cancelar</Button> )}</td> {/* REMOVED FOR NOW: <Button variant="outline-success" className="rounded-pill ">Ver Detalles</Button> */}
                        </tr>
                    ))}
                </tbody>
            </Table>
          </div>
        </div>
    );
};
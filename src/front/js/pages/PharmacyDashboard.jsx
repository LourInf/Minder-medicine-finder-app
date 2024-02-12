import React,  { useContext, useState, useEffect }  from "react";
import { Context } from "../store/appContext.js" //2.Import Context
import { Link, Outlet } from "react-router-dom"; //(React Outlet) 4.import Outlet in parent route component to render its child nested routes
                                                // 5. Import and use Link to create navigation links for the child components. 
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";

export const PharmacyDashboard = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

   // Redirect if not logged in or not a pharmacy
   useEffect(() => {
    if (!store.isLoggedIn || !store.isPharmacy) {
    actions.setNotification("Para acceder tiene que ser una farmacia", "error");
      navigate('/');
    }
  }, [store.isLoggedIn, store.isPharmacy, navigate]);



  return (
 
    <div className="dashboard">
      <h1 className="title">Área Farmacia</h1>
      <Nav variant="tabs" defaultActiveKey="/pharmacy/availability">
        <LinkContainer to="/pharmacy/availability"> 
          <Nav.Link className="dashboard-nav">Disponibilidad</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/pharmacy/reservations">
          <Nav.Link className="dashboard-nav">Reservas</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/pharmacy/pharmacy-profile">
          <Nav.Link className="dashboard-nav">Mi perfil</Nav.Link>
        </LinkContainer>
      </Nav>
      <Outlet /> 
    </div>
  );
};


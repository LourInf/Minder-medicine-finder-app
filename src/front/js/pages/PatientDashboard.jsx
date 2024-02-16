import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js"
import { Link, Outlet } from "react-router-dom"; //(React Outlet) 4.import Outlet in parent route component to render its child nested routes
// 5. Import and use Link to create navigation links for the child components. 
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";

export const PatientDashboard = () => {
  const { store, actions } = useContext(Context);
  actions.removeUnnecessaryItems();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page if patient is not logged in
    if (!store.isLoggedIn || store.isPharmacy) {
      actions.setNotification("Para acceder tiene que ser un paciente", "error");
      navigate('/login');
    }
  }, [store.isLoggedIn, store.isPharmacy, navigate]);

  // Access the email from store
  const patientEmail = store.email || ''; // Fallback in case there's no email show nth

  return (
    <div className="dashboard">
      <h1 className="title"> Área Paciente {patientEmail && <span className="text-email">{patientEmail}</span>} </h1>
      <Nav variant="tabs" defaultActiveKey="/patient/orders">
        <LinkContainer to="/patient/orders">
          <Nav.Link className="dashboard-nav">Mis Reservas</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/patient/patient-profile">
          <Nav.Link className="dashboard-nav">Mi Perfil</Nav.Link>
        </LinkContainer>
      </Nav>
      <Outlet />
    </div>
  );
};

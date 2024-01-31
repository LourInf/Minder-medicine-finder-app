import React,  { useContext, useState, useEffect }  from "react";
import { Context } from "../store/appContext.js" 
import { Link, Outlet } from "react-router-dom"; //(React Outlet) 4.import Outlet in parent route component to render its child nested routes
                                                // 5. Import and use Link to create navigation links for the child components. 
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from "react-router-dom";

export const PatientDashboard = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page if patient is not logged in
    if (!store.isLoggedIn) {
      navigate('/login');
    }
  }, [store.isLoggedIn, navigate]);



return (
    <div>
      <h1>Patient Dashboard</h1>
      <Nav variant="tabs" defaultActiveKey="/patient/orders">
        <LinkContainer to="/patient/orders"> 
          <Nav.Link>Orders</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/patient/patient-profile">
          <Nav.Link>PatientProfile</Nav.Link>
        </LinkContainer>
      </Nav>
      <Outlet />
    </div>
  );
};

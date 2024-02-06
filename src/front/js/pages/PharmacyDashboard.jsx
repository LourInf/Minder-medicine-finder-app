import React,  { useContext, useState, useEffect }  from "react";
import { Context } from "../store/appContext.js" //2.Import Context
import { Link, Outlet } from "react-router-dom"; //(React Outlet) 4.import Outlet in parent route component to render its child nested routes
                                                // 5. Import and use Link to create navigation links for the child components. 
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from "react-router-dom";

export const PharmacyDashboard = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

   // Redirect if not logged in or not a pharmacy
   useEffect(() => {
    if (!store.isLoggedIn || !store.isPharmacy) {
      navigate('/login');
    }
  }, [store.isLoggedIn, store.isPharmacy, navigate]);


  return (
 
    <div>
      <h1>Pharmacy Dashboard</h1>
    {/* These links let you navigate between the nested routes. (React-router-bootstrap) */}
      <Nav variant="tabs" defaultActiveKey="/pharmacy/availability">
        <LinkContainer to="/pharmacy/availability"> 
          <Nav.Link>Availability</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/pharmacy/reservations">
          <Nav.Link>Reservations</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/pharmacy/pharmacy-profile">
          <Nav.Link>PharmacyProfile</Nav.Link>
        </LinkContainer>
      </Nav>
      <Outlet /> {/* Here, the nested route components are rendered */}
    </div>
  );
};


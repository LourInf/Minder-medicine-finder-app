import React from "react";
import { Link, Outlet } from "react-router-dom"; //(React Outlet) 4.import Outlet in parent route component to render its child nested routes
                                                // 5. Import and use Link to create navigation links for the child components. 
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export const PharmacyDashboard = () => {
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
        <LinkContainer to="/pharmacy/profile">
          <Nav.Link>PharmacyProfile</Nav.Link>
        </LinkContainer>
      </Nav>
      <Outlet /> {/* This is where the nested route components will be rendered */}
    </div>
  );
};


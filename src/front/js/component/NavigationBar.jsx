import React from "react";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'


export const NavigationBar = () => {
	return (
		<Navbar expand="lg" className="bg-body-tertiary mt-3 mb-5">
		  <Container class="d-flex flex-row">
		  <Link to="/"><Navbar.Brand>
            <img
              alt=""
              src="/img/logo.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            LOGO
          </Navbar.Brand> </Link>
		  	<div className="d-flex justify-content-center">
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
			  <Nav className="me-auto">
				<Nav.Link as={Link} to="/">Home</Nav.Link>
				<Nav.Link as={Link} to="/pharmacy">Farmacias</Nav.Link>
				<Nav.Link as={Link} to="/patients">Pacientes</Nav.Link>
				{/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
				  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
				  <NavDropdown.Item href="#action/3.2">
					Another action
				  </NavDropdown.Item>
				  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
				  <NavDropdown.Divider />
				  <NavDropdown.Item href="#action/3.4">
					Separated link
				  </NavDropdown.Item>
				</NavDropdown> */}
			  </Nav>
			</Navbar.Collapse>
			</div>
			<div className="d-flex justify-content-end">
			<Link to="/register">
				<Button variant="outline-secondary" className="me-2">Nuevo usuario</Button>
			</Link>
			<Link to="/login">
				<Button variant="secondary"><FontAwesomeIcon icon = { faUser } className=""/></Button>
			</Link>
			</div>
		  </Container>
		</Navbar>
	  );
	}
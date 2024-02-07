import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import logoImage from "../../img/minderlogoimage.png";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";



export const NavigationBar = () => {

    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
	const [ registerOrHome, setRegisterOrHome ] = useState("/register");



	useEffect(() => {
        const userLogged = JSON.parse(localStorage.getItem("userLogged"));
        if(userLogged != null){
            if(userLogged.expire < new Date().getTime()){
                actions.logout();
                localStorage.removeItem("userLogged");
                // navigate("/login");

            }else{
				const register = document.getElementById("register");
				register.innerHTML = "Usuario logado";
				register.className += " bg-success bg-gradient text-white";
				setRegisterOrHome("/");
			}

        }else{
			const register = document.getElementById("register");
			register.innerHTML = "Nuevo usuario";
			register.className = "btn btn-outline-secondary me-2";
			setRegisterOrHome("/register");
		}
		// else{
        //     navigate("/register");
        // }

    // }, []);
	}, [navigate]);



	return (
		<Navbar expand="lg" className="bg-body-tertiary mt-3 mb-5">
		  <Container className="d-flex flex-row">
		  <Link to="/"><Navbar.Brand>
            <img
              alt=""
              src={logoImage}
              width="40"
              height="40"
              className="d-inline-block align-top"
			/>{' '}Minder
          </Navbar.Brand> </Link>
		  	<div className="d-flex justify-content-center">
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
			  <Nav className="me-auto">
				<Nav.Link as={Link} to="/">Home</Nav.Link>
				<Nav.Link as={Link} to="/pharmacy">Farmacias</Nav.Link>
				<Nav.Link as={Link} to="/patient">Pacientes</Nav.Link>
				<Nav.Link as={Link} to="/maps">Maps</Nav.Link>
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
			<Link to={registerOrHome}>
				<Button variant="outline-secondary" id="register" className="me-2">Nuevo usuario</Button>
			</Link>
			<Link to="/login">
				<Button variant="secondary"><FontAwesomeIcon icon = { faUser } className=""/></Button>
			</Link>
			</div>
		  </Container>
		</Navbar>
	  );
	}
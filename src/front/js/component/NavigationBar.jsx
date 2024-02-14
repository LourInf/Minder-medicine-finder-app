import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import logoImage from "../../img/minderlogoimage.png";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/navigationBar.css"


export const NavigationBar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
	const [ registerOrHome, setRegisterOrHome ] = useState("/register");


	useEffect(() => {
        const userLogged = JSON.parse(localStorage.getItem("userLogged"));
		// const btnLogout = document.getElementById("logoutBtn");
        if(userLogged != null){
            if(userLogged.expire < new Date().getTime()){
                actions.logout();
                localStorage.removeItem("userLogged");
                // navigate("/login");

            }else{
				const register = document.getElementById("register");
				register.innerHTML = "Usuario logado";
				register.className += " bg-success bg-gradient text-white";
				// btnLogout.style.display = "block"
				setRegisterOrHome("/");
			}

        }else{
			const register = document.getElementById("register");
			register.innerHTML = "Nuevo usuario";
			// btnLogout.style.display = "none"
			// register.className = "btn btn-outline-light me-2";
			setRegisterOrHome("/register");
		}

	}, [navigate]);


	const handleLogout = () => {
		actions.logout(); 
		navigate("/login", {replace: true}); 
	  }
	  


	return (
		<Navbar expand="lg" className="bg-body-tertiary mt-3 mb-3">
		  <Container className="d-flex flex-row">
		  <Link to="/"><Navbar.Brand>
            <img
              alt=""
			  src={logoImage}
              width="130"
              height="130"
              className="d-inline-block align-top"
			/>{' '}
          </Navbar.Brand> </Link>
		  	<div className="d-flex justify-content-center">
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
			  <Nav className="me-auto h4">
				<Nav.Link as={Link} to="/">Inicio</Nav.Link>
				<Nav.Link as={Link} to="/pharmacy" style={{ paddingLeft:"30px", paddingRight: "30px" }}>Farmacias</Nav.Link>
				<Nav.Link as={Link} to="/patient">Pacientes</Nav.Link>
				<Nav.Link as={Link} to="/mapaciudad">Mapa</Nav.Link>
			  </Nav>
			</Navbar.Collapse>
			</div>
			<div className="d-flex justify-content-end">
				{store.isLoggedIn && 
			<button id="logoutBtn" className="btn btn-outline-danger me-3" onClick={handleLogout}> <FontAwesomeIcon icon={faSignOutAlt} /></button>
				}
			<Link to={store.isLoggedIn ? "/" : "/register"}>
				<Button variant="outline-light" id="register" className="btn-register me-2">
				{store.isLoggedIn ? "Usuario logado" : "Nuevo Usuario"} </Button>
			</Link>
			<Link to="/login">
				<Button variant="outline-light" className="btn-login"><FontAwesomeIcon icon = { faUser } /></Button>
			</Link>
			</div>
		  </Container>
		</Navbar>
	  );
	}
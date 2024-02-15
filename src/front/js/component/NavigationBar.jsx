import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logoImage from "../../img/minderlogoimage.png";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/navigationBar.css";

export const NavigationBar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	const handleLogout = () => {
		actions.logout();
		navigate("/login", { replace: true });
	};

	const [hover, setHover] = useState(false);

	const buttonStyle = {
		background: hover ? 'linear-gradient(to right, #FF7E67, #FFB183)' : 'linear-gradient(to right, #FF5F6D, #FFC371)',
		borderColor: 'transparent',
		borderRadius: '8px',
		color: 'white',
		fontWeight: 'bold',
		padding: '10px 18px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'pointer',
		transition: 'background 0.3s ease'
	};

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
							<Nav.Link as={Link} to="/pharmacy" style={{ paddingLeft: "30px", paddingRight: "30px" }}>Farmacias</Nav.Link>
							<Nav.Link as={Link} to="/patient">Pacientes</Nav.Link>
							<Nav.Link as={Link} to="/mapaciudad" style={{ paddingLeft: "30px", paddingRight: "30px" }}>Mapa</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</div>
				<div className="d-flex justify-content-end">
					{store.isLoggedIn ? (
						<>
							<Button
								variant="outline-danger"
								className="me-3"
								style={buttonStyle}
								onMouseEnter={() => setHover(true)}
								onMouseLeave={() => setHover(false)}
								onClick={handleLogout}
							>
								<FontAwesomeIcon icon={faSignOutAlt} />
							</Button>
						</>
					) : (
						<>
							<Link to="/register">
								<Button variant="outline-light" className="btn-register me-2">
									¡Regístrate aquí!
								</Button>
							</Link>
							<Link to="/login">
								<Button variant="outline-light" className="btn-login">
									<FontAwesomeIcon icon={faUser} />
								</Button>
							</Link>
						</>
					)}
				</div>
			</Container>
		</Navbar>
	);
};

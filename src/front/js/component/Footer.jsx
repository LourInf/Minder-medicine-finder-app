import "../../styles/footer.css"
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logoImage from "../../img/minderlogoimage.png";
import fourgeek from "../../img/4geek.png";

export const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
			<div className="footer mt-auto text-center border-top ">
				<div>
					{/* <Link to="/" className="d-flex align-items-center text-dark text-decoration-none ms-5 mt-5 ps-5">
						<img src={logoImage} alt="logo" width="70px" />
						<span className=" h5 font-weight-bold">Minder</span>
					</Link> */}
					
					<div className="container text-center">
						Nuestra misión es asistir a los usuarios en la búsqueda rápida y sencilla de los medicamentos que necesitan,
						especialmente aquellos con problemas de abastecimiento, conectándolos con las farmacias que tienen disponibles esos medicamentos.
					</div>
					
				
					<h5 className="strong">Conócenos</h5>
						Lourdes
						<Button variant="outline-light" className="m-1" href="https://github.com/LourInf" role="button">
							<i className="fab fa-github"></i>
						</Button>
						<Button variant="outline-light" className="m-1" href="https://www.linkedin.com/in/lourdes-infber/" role="button">
							<i className="fab fa-linkedin-in"></i>
						</Button>

						Evelyn
						<Button variant="outline-light" className="m-1" href="https://github.com/EveyZeram" role="button">
							<i className="fab fa-github"></i>
						</Button>
						<Button variant="outline-light" className="m-1" href="https://www.linkedin.com/in/evelyn-g%C3%B3mez-900a06114/" role="button">
							<i className="fab fa-linkedin-in"></i>
						</Button>

						Andrés
						<Button variant="outline-light" className="m-1" href="https://github.com/andleus" role="button">
							<i className="fab fa-github"></i>
						</Button>
						<Button variant="outline-light" className="m-1" href="https://www.linkedin.com/in/andr%C3%A9s-abadia-heredia-686039b9/" role="button">
							<i className="fab fa-linkedin-in"></i>
						</Button>
				</div>
				<div className="text-center">
					© {currentYear} Copyright:
					<img src={fourgeek} alt="4geeklogo" width={75} />
				</div>

			</div>
	);
}
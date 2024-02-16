import React from 'react';
import { Button } from 'react-bootstrap';
import fourgeek from "../../img/4geek.png";
import "../../styles/footer.css";

export const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<div className="footer mt-auto" style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
			<div className="p-1 m-1">
				<div className="container-fluid text-center m-1">
					<p>
						Nuestra misión es agilizar la búsqueda de medicamentos, especialmente los de difícil suministro, conectando usuarios con farmacias que los ofrecen.
					</p>
				</div>
				<div className="d-flex justify-content-center align-items-center">
					<div className=" strong text-center">
						© {currentYear} Copyright:
					</div>
					<Button variant="outline-light" className="btn-footer m-1" href="https://github.com/LourInf" role="button">
						<i className="fab fa-github text-dark"></i> Lourdes
					</Button>
					<Button variant="outline-light" className="btn-footer m-1" href="https://www.linkedin.com/in/lourdes-infber/" role="button">
						<i className="fab fa-linkedin-in text-linkedin"></i>
					</Button>
					<Button variant="outline-light" className="btn-footer m-1" href="https://github.com/EveyZeram" role="button">
						<i className="fab fa-github text-dark"></i> Evelyn
					</Button>
					<Button variant="outline-light" className="btn-footer m-1" href="https://www.linkedin.com/in/evelyn-g%C3%B3mez-900a06114/" role="button">
						<i className="fab fa-linkedin-in text-linkedin"></i>
					</Button>
					<Button variant="outline-light" className="btn-footer m-1" href="https://github.com/andleus" role="button">
						<i className="fab fa-github text-dark"></i> Andrés
					</Button>
					<Button variant="outline-light" className="btn-footer m-1" href="https://www.linkedin.com/in/andr%C3%A9s-abadia-heredia-686039b9/" role="button">
						<i className="fab fa-linkedin-in text-linkedin"></i>
					</Button>
					<div>
						<img className="p-1" src={fourgeek} alt="4geeklogo" width={75} />
					</div>
				</div>
			</div>
		</div>
	);
}

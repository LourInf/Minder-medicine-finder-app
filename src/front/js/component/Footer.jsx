import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logoImage from "../../img/minderlogoimage.png";
import "../../styles/footer.css"
import fourgeek from "../../img/4geek.png";

export const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="text-center">
			<Container className="p-4">
				<section className="mb-4">
					<Button variant="outline-light" className="m-1" as={Link} to="https://www.facebook.com/4GeeksAcademyES/" role="button">
						<i className="fab fa-facebook-f"></i>
					</Button>
					<Button variant="outline-light" className="m-1" as={Link} to="https://github.com/4GeeksAcademy" role="button">
						<i className="fab fa-google"></i>
					</Button>
					<Button variant="outline-light" className="m-1" as={Link} to="https://www.instagram.com/4geeksacademyes/?hl=es" role="button">
						<i className="fab fa-instagram"></i>
					</Button>
				</section>

				<section className="mb-4">
					<p>
						Nuestra misión es asistir a los usuarios en la búsqueda rápida y sencilla de los medicamentos que necesitan,
						especialmente aquellos con problemas de abastecimiento, conectándolos con las farmacias que tienen disponibles esos medicamentos.
					</p>
				</section>

				<section className="text-center">
					<Row>
						<Col xs={12} md={6}>
							<Link to="/" className="d-flex align-items-center text-dark text-decoration-none">
								<img src={logoImage} alt="logo" width="70px" />
								<span className="ms-3 h5 font-weight-bold">Minder</span>
							</Link>
							<p className="my-3" style={{ maxWidth: '250px' }}>

							</p>
							<div className="mt-4"></div>
						</Col>
						<Col lg="" md="6" className="mb-4 mb-md-0 justify-content-center">
							<h5 className="strong">Conócenos</h5>
							<ul className="list-unstyled d-flex mb-0 p-1">
								<li>
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
								</li>

							</ul>
						</Col>

						<Col lg="3" md="6" className="mb-4 mb-md-0">
							{/* <h5 className="text-uppercase">Links</h5> */}
						</Col>
					</Row>
				</section>
			</Container>

			<div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
				© {currentYear} Copyright:
				<p className="text-white" to="/">
					Lourdes, Evelyn, Andrés
				</p>
				<img src={fourgeek} alt="4geeklogo" width={75} />
			</div>
		</footer>
	);
}
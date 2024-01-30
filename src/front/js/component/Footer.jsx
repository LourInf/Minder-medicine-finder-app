import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const Footer =() => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="text-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
		  <Container className="p-4">
			<section className="mb-4">
			  <Button variant="outline-light" className="m-1" as={Link} to="#" role="button">
				<i className="fab fa-facebook-f"></i>
			  </Button>
			  <Button variant="outline-light" className="m-1" as={Link} to="#" role="button">
				<i className="fab fa-google"></i>
			  </Button>
			  <Button variant="outline-light" className="m-1" as={Link} to="#" role="button">
				<i className="fab fa-instagram"></i>
			  </Button>
			  <Button variant="outline-light" className="m-1" as={Link} to="#" role="button">
				<i className="fab fa-linkedin-in"></i>
			  </Button>
			  <Button variant="outline-light" className="m-1" as={Link} to="#" role="button">
				<i className="fab fa-github"></i>
			  </Button>
			</section>

			<section className="mb-4">
			  <p>
			  Nuestra misión es asistir a los usuarios en la búsqueda rápida y sencilla de los medicamentos que necesitan,
  			  especialmente aquellos con problemas de abastecimiento, conectándolos con las farmacias que tienen disponibles esos medicamentos.
			  </p>
			</section>
	
			<section className="">
			  <Row>
			  <Col xs={12} md={4}>
              <Link to="/" className="d-flex align-items-center text-dark text-decoration-none">
                <img src="logo" alt="logo" width="30px" />
                <span className="ms-3 h5 font-weight-bold">OUR LOGO</span>
              </Link>
              <p className="my-3" style={{ maxWidth: '250px' }}>
				Lorem ipsum dolor sit amet consectetur adipisicing elit.
			  </p>
              <div className="mt-4"></div>
            </Col>

				<Col lg="3" md="6" className="mb-4 mb-md-0">
				  <h5 className="text-uppercase">Links</h5>
	
				  <ul className="list-unstyled mb-0">
					<li>
					  <Link to="#" className="text-white">
						Link 1
					  </Link>
					</li>
					<li>
					  <Link to="#" className="text-white">
						Link 2
					  </Link>
					</li>
					<li>
					  <Link to="#" className="text-white">
						Link 3
					  </Link>
					</li>
					<li>
					  <Link to="#" className="text-white">
						Link 4
					  </Link>
					</li>
				  </ul>
				</Col>
	
				<Col lg="3" md="6" className="mb-4 mb-md-0">
				  <h5 className="text-uppercase">Links</h5>
	
				  <ul className="list-unstyled mb-0">
					<li>
					  <Link to="#" className="text-white">
						Link 1
					  </Link>
					</li>
					<li>
					  <Link to="#" className="text-white">
						Link 2
					  </Link>
					</li>
					<li>
					  <Link to="#" className="text-white">
						Link 3
					  </Link>
					</li>
					<li>
					  <Link to="#" className="text-white">
						Link 4
					  </Link>
					</li>
				  </ul>
				</Col>
			  </Row>
			</section>
		  </Container>
		
		  <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
			© {currentYear} Copyright:
			<Link className="text-white" to="/">
			  Lourdes, Evelyn, Andrés
			</Link>
		  </div>
		</footer>
	  );
	}
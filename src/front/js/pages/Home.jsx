import React from "react";
import "../../styles/home.css";
import { SearchBar } from ".././component/SearchBar.jsx";
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import minder from "../../img/minder.png"



export const Home = () => {

	return (
		<Container className="text-center mt-3 main-content-container">
			<img src={minder} alt="minderletra" />
			<h1 className="text-light-50">Encuentra y reserva tu medicamento cerca de tí.</h1>
			<SearchBar />
    	</Container>
	);
};

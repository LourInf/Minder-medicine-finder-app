import React, { useContext, useState, useEffect } from "react"
import { SearchBar } from ".././component/SearchBar.jsx";
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import minder from "../../img/minder.png"
import { Context } from "../store/appContext";
import "../../styles/home.css";


export const Home = () => {
    const { store, actions } = useContext(Context);

	// actions.removeUnnecessaryItems();
	
	return (
		<Container className="text-center mt-3 main-content-container">
			<img src={minder} alt="minderletra" />
			<h1 className="text-light-50">Encuentra y reserva tu medicamento cerca de tí.</h1>
			<SearchBar />
    	</Container>
	);
};

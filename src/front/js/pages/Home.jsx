import React,  { useContext, useState }  from "react"; //1. Import hook useContext
import { Context } from "../store/appContext.js" //2.Import Context
import "../../styles/home.css";
import { SearchBar } from ".././component/SearchBar.jsx";
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import minder from "../../img/minder.png"



export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<Container className="text-center mt-3 main-content-container">
			<img src={minder} alt="minderletra" />
			<h1 className="text-light-50">Busca medicamentos cerca de ti</h1>
			<SearchBar />
    	</Container>
	);
};

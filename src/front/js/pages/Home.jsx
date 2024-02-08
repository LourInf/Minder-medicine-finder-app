import React from "react";
import "../../styles/home.css";
import { SearchBar } from ".././component/SearchBar.jsx";
import { Container } from 'react-bootstrap';



export const Home = () => {

	return (
		<Container className="text-center mt-5 main-content-container">
			<h1>Busca medicamentos cerca de ti</h1>
			<SearchBar />
    	</Container>
	);
};

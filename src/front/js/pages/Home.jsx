import React from "react";
import "../../styles/home.css";
import { SearchBar } from ".././component/SearchBar.jsx";
import { Container } from 'react-bootstrap';
import minder from "../../img/minder.png"
import { ReactTyped } from "react-typed";


export const Home = () => {
	return (
		<Container className="text-center mt-3 main-content-container">
		  <img src={minder} alt="minder logo" className="w-50" />
		  <h1 className="text-light">
			<ReactTyped
			  strings={["Encuentra y reserva medicamentos cerca de ti."]}
			  typeSpeed={50}
			  backSpeed={50}
			  startDelay={800}
			  backDelay={1500}
			//   loop
			  showCursor
			  cursorChar="|"
			/>
		  </h1>
		  <SearchBar />
		</Container>
	  );
	};
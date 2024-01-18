import React,  { useContext, useState }  from "react"; //1. Import hook useContext
import { Context } from "../store/appContext.js" //2.Import Context
import "../../styles/landingPage.css";
import { SearchBar } from ".././component/SearchBar.jsx";



export const LandingPage = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<h1>Busca medicamentos cerca de ti</h1>
            <SearchBar />
		</div>
	);
};

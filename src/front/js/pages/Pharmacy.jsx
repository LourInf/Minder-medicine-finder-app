import React,  { useContext, useState }  from "react"; 
import { Context } from "../store/appContext.js" 
import "../../styles/pharmacy.css";


export const Pharmacy = () => {
	const { store, actions } = useContext(Context);

	return (
		<div>
			<h1>This is the pharmacy area</h1>
			
		</div>
	);
};

import React, { useContext } from "react";
import { Context } from "../store/appContext.js"; 
import { CardResults } from "../component/CardResults.jsx";

export const Results = () => {
    const  {store, actions } = useContext (Context);

    return (
        <div>
            <h1>20 farmacias tienen disponibilidad de {store.selectedMedicine}</h1>
            <CardResults/>
        </div>
    );
};
import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext.js"; 
import { CardResults } from "../component/CardResults.jsx";
import { useParams } from 'react-router-dom';

export const Results = () => {
    const  {store, actions } = useContext (Context);
    let { medicineId, cityName } = useParams();

    useEffect(() => {
        if (cityName) {
            actions.getPharmacies(cityName); 
        }
    }, [cityName, actions.getPharmacies]);

    return (
        <div>
            <h1>20 farmacias tienen disponibilidad de {store.selectedMedicine} en {store.selectedCity}</h1>
            <CardResults/>
            <h1>Pharmacies in {store.selectedCity}</h1>
            {store.pharmacies.map((pharmacy, index) => (
                <div key={index}>
                    <h2>{pharmacy.name}</h2>
                    {pharmacy.opening_hours && (
                        <p>{pharmacy.opening_hours.open_now ? 'Abierto Ahora' : 'Cerrado'}</p>
                    )}
                    <p>{pharmacy.vicinity}</p>
                </div>
            ))}
        </div>
    );
};
import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext.js"; 
import { CardResults } from "../component/CardResults.jsx";
import { useParams } from 'react-router-dom';

export const Results = () => {
    const  {store, actions } = useContext (Context);
    const { medicineId, cityName } = useParams();

     // fetches the pharmacies from our DB that have the selected medicine available (ADD FUNCTIONALITY: We need to somehow get from which city the pharmacy is --> How? In DB len lat?)
    useEffect(() => {                                                         
        if (medicineId) {
            actions.getAvailablePharmacies(medicineId);                       
        }
    }, [medicineId, actions.getAvailablePharmacies]);


    // fetches all the pharmacies from Google API in the city selected (For these we can just show the phone and show that we don't know the availability)
    useEffect(() => {                                                     
        if (cityName) {
            actions.getPharmacies(cityName); 
            }
        }, [cityName, actions.getPharmacies]);


    return (
        <div>
            {/* Section 1: Pharmacies with selected medicine availability in our DB */}
            <h2>Section 1: (farmacias afiliadas y con stock de ese medicamento) 20 farmacias tienen disponibilidad de {store.selectedMedicine} en {store.selectedCity}</h2>    {/*MODIFICATION IN PROGRESS - START*/}
            {store.availablePharmacies && store.availablePharmacies.length > 0 ? (
                store.availablePharmacies.map((pharmacy, index) => (
                    <CardResults key={index} pharmacy={pharmacy} medicineId={medicineId} setSelectedPharmacy={actions.setSelectedPharmacy}/>
                ))
            ) : (
                <p>No pharmacies found with this medicine available.</p>
            )}
             {/* Section 2: Pharmacies with selected medicine NOT available or unknown in our DB */}
             <h2>Section 2: (farmacias afiliadas y stock desconocido)</h2>


            {/* Section 3: Pharmacies from google API based on searched city */}
            <h2>Section 3: ( farmacias no afiliadas - other pharmacies from google API in the area) Pharmacies in {store.selectedCity}</h2>
            {store.pharmacies && store.pharmacies.length > 0 ? (
                store.pharmacies.map((pharmacy, index) => (
                    <div key={index}>
                        <p><b>{pharmacy.name}</b></p>
                        {pharmacy.opening_hours && (
                            <p>{pharmacy.opening_hours.open_now ? 'Abierto Ahora' : 'Cerrado'}</p>
                        )}
                        <p>{pharmacy.vicinity}</p>
                    </div>
                ))
            ) : (
                <p>No pharmacies found in {store.selectedCity}.</p>
            )}
             
        </div>
    );
};
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Context } from "../store/appContext.js"; 
import { CardResults } from "../component/CardResults.jsx";
import { useParams } from 'react-router-dom';

export const Results = () => {
    const  {store, actions } = useContext (Context);
    const { medicineId, cityName } = useParams();
    // const [name, setName] = useState('');
    // const [noResults, setNoResults] = useState(false);
    const [pharmacy_fields, setpharmacy_fields] = useState('');
    const [resultsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

  const selectedMedicine = localStorage.getItem('selectedMedicine');
  const selectedCityName = localStorage.getItem('selectedCityName');

    // const handlePharmacies = async () => {
    //     await actions.getPharmacies(city);
    //     if (store.pharmacies.length === 0) {
    //       setNoResults(true);
    //     } else {
    //       setNoResults(false);
    //       setpharmacy_fields('name,formatted_address,current_opening_hours,formatted_phone_number');
    //       // console.log('pharmacyFields:', pharmacy_fields);
    //       actions.getPharmaciesDetails(pharmacy_fields, currentPage);
    //     }
    //   };


// Para Paginar
// Index last y first calculan los indices del primer y último resultado. 
  const indexLastResult = currentPage * resultsPerPage;
  const indexFirstResult = indexLastResult - resultsPerPage; // Current es la actual. resultsPerPage es la cantidad: useState(5);
  const currentResults = store.pharmacies.slice(indexFirstResult, indexLastResult);
  // Función para cambiar de página
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber); // Actualiza el estado de currentPage
    actions.getPharmaciesDetails(pharmacy_fields, pageNumber); // hace llamada con el nuevo nº de página
  };




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
            {/* <h3>Section 1: (farmacias afiliadas y con stock de ese medicamento) 20 farmacias tienen disponibilidad de {store.selectedMedicine} en {store.selectedCityName}</h3> */}
            <h4>¡Buenas noticias! Es posible que el medicamento que buscas ({store.selectedMedicine}) esté disponible en las siguientes farmacias de {store.selectedCityName}</h4>
            {store.availablePharmacies && store.availablePharmacies.length > 0 ? (
                store.availablePharmacies.map((pharmacy, index) => (
                    <CardResults key={index}  buttonType="reserve" pharmacy={pharmacy} medicineId={medicineId} setSelectedPharmacy={actions.setSelectedPharmacy}/>
                ))
            ) : (
                <p>Lo sentimos, ninguna de las farmacias con las que trabajamos tienen este medicamento. Aqui te dejamos otras farmacias a las que puedes llamar y consultar</p>
            )}
             {/* Section 2: Pharmacies with selected medicine NOT available or unknown in our DB */}
             {/* <h2>Section 2: (farmacias afiliadas y stock desconocido)</h2> */}


            {/* Section 3: Pharmacies from google API based on searched city */}
            {/* <h2>Section 3: ( farmacias no afiliadas - other pharmacies from google API in the area) Pharmacies in {cityName}</h2> */}
            <p className="text-center mt-5"><i>Estan son otras farmacias de {cityName} a las que puedes llamar para preguntar por su disponibilidad</i></p>
            <div className="p-3">
            {store.pharmacies && store.pharmacies.length > 0 ? (
                store.pharmacies.map((pharmacy, index) => (
                <CardResults 
                key={index}
                buttonType="details"
                pharmacy={pharmacy}
                medicineId={medicineId} 
            />
        ))
    ) : (
        <p>No encuentra Farmacias Cercanas, por favor, ingrese otra dirección</p>
    )}

        {/* Paginar */}
        {store.pharmacies.length > resultsPerPage && (
          <ul className="pagination justify-content-center p-2 m-2">
            {Array.from({length: Math.ceil(store.pharmacies.length / resultsPerPage) }, (_, index) => (
              <li key={index} className={`page-item & {index + 1 === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => paginate(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ) )}
          </ul>
        )}
      </div>
        </div>
    );
};
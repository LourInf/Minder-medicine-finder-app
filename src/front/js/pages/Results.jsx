import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Context } from "../store/appContext.js";
import { CardResults } from "../component/CardResults.jsx";
import { useParams } from 'react-router-dom';
import "../../styles/results.css";

export const Results = () => {
  const { store, actions } = useContext(Context);
  const { medicineId, address, cityName } = useParams();
  // const [name, setName] = useState('');
  // const [noResults, setNoResults] = useState(false);
  const [pharmacy_fields, setpharmacy_fields] = useState('');
  const [resultsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

	// actions.removeUnnecessaryItems();

  const selectedMedicine = localStorage.getItem('selectedMedicine');
  const selectedCityName = localStorage.getItem('selectedCityName');


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




  // fetches the pharmacies from our DB
  useEffect(() => {
    if (medicineId && cityName) {
      actions.getAvailablePharmacies(medicineId, cityName);
    }
  }, [medicineId, cityName, actions.getAvailablePharmacies]);


  // fetches all the pharmacies from Google API in the city selected
  useEffect(() => {
    if (cityName) {
      actions.getPharmacies(cityName);
    }
  }, [cityName, actions.getPharmacies]);


  return (
    <div>
      <div className=" container-main-text text-center">
      {/* Section 1: Pharmacies with selected medicine availability in our DB */}
      <h4 className="selection-text-show text-center mb-5">
      {localStorage.getItem('selectedMedicine') && localStorage.getItem('selectedCityName') && store.availablePharmacies && store.availablePharmacies.length > 0 ? (
      <>
        ¡Buenas noticias! Es posible que {JSON.parse(localStorage.getItem('selectedMedicine')).medicine_name.slice(0, 20)} esté disponible en las siguientes farmacias
        {localStorage.getItem('selectedCityName')}
      </>
      ) : (
      `Lo sentimos, ninguna de las farmacias con las que trabajamos tienen este medicamento. Aquí te dejamos otras farmacias a las que puedes llamar y consultar`
      )}
      </h4>
      </div>
      {store.availablePharmacies && store.availablePharmacies.length > 0 ? (
        store.availablePharmacies.map((pharmacy, index) => (
          <CardResults key={index} buttonType="reserve" pharmacy={pharmacy} medicineId={medicineId} address={cityName} setSelectedPharmacy={actions.setSelectedPharmacy} />
        ))
      ) : (
        <button className="return-btn mx-auto" onClick={() => navigate('/')}>Hacer una nueva Busqueda</button>
      )}
      {/* Section 2: Pharmacies with selected medicine NOT available or unknown in our DB --> IF TIME*/}
      {/* Section 3: Pharmacies from google API based on searched city */}
      <p className="selection-text-show text-center mt-5"><i>Estan son otras farmacias de {cityName} a las que puedes llamar para preguntar por su disponibilidad</i></p>
      <div className="p-3">
        {store.pharmacies && store.pharmacies.length > 0 ? (
          store.pharmacies.map((pharmacy, index) => (
            <CardResults key={index} buttonType="details" pharmacy={pharmacy} medicineId={medicineId} />
          ))
        ) : (
          <p className="selection-text-show text-center mt-5">No encuentra Farmacias Cercanas, por favor, ingrese otra dirección</p>
        )}
        {/* Paginar */}
        {store.pharmacies.length > resultsPerPage && (
          <ul className="pagination justify-content-center p-2 m-2">
            {Array.from({ length: Math.ceil(store.pharmacies.length / resultsPerPage) }, (_, index) => (
              <li key={index} className={`page-item & {index + 1 === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => paginate(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
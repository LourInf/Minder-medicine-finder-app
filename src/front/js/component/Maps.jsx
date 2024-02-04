import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext.js';
import { Link, useNavigate } from 'react-router-dom';
// import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


export const Maps = () => {
  const { store, actions } = useContext(Context);
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [pharmacy_fields, setpharmacy_fields] = useState('');
  const [resultsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  // const params = useParams();
  const navigate = useNavigate();

  const handlePharmacies = async () => {
    await actions.getPharmacies(city);
    if (store.pharmacies.length === 0) {
      setNoResults(true);
    } else {
      setNoResults(false);
      setpharmacy_fields('name,formatted_address,current_opening_hours,formatted_phone_number');
      // console.log('pharmacyFields:', pharmacy_fields);
      actions.getPharmaciesDetails(pharmacy_fields, currentPage);
    }
  };
  // Activar botón "enter"
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (name) {
      } else {
        handlePharmacies();
      }
    }
  };
  // Para poder hacer POST a los detalles de la API
  const handleOnClick = (place_id) => {
    actions.getPharmaciesDetails(place_id);
    navigate(`/pharmacies-details/${place_id}`)
  }
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
  return (
    <div className="text-center">
      <h1>Encuentra tu Farmacia más cercana</h1>
      <img src="https://cdn.icon-icons.com/icons2/54/PNG/256/map_search_find_maps_10803.png" alt="Map Icon" />
      <div className="container justify-content-center d-flex">
        <div>
          <input
            type="text"
            id="location"
            value={city}
            placeholder="Introduce tu Localidad"
            onChange={(e) => {
              setCity(e.target.value);
            }}
            onKeyPress={handleKeyPress}
          />
          <button className="m-1 py-1 btn btn-success text-break" onClick={handlePharmacies}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </div>
      <div className="p-3">
        {/* Mostrar mensaje si no se encuentran las farmacias */}
        {noResults ? (
          <h2>No encuentra Farmacias Cercanas, por favor, ingrese otra dirección</h2>
        ) : (
          // Mostrar Farmacias - Cambiamos el map a currentResults para que muestre los 5 resultados y no todos como hacía anteriormente.
          currentResults.map((item, index) => (
            <div className="container w-50 alert-success" key={index}>
              <h2 className="text-success">{item.name}</h2>
              {item.opening_hours && (
                <p>{item.opening_hours.open_now ? 'Abierto Ahora' : 'Cerrado'}</p>
              )}
              <p>Dirección: {item.vicinity}</p>
              <p>Reseñas: {item.rating}</p>
              <button className="btn btn-light p-2 m-2" onClick={() => handleOnClick(item.place_id)}>Datos de Contacto</button>
            </div>
          ))
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

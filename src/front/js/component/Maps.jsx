import "../../styles/maps.css"
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext.js';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import minderlogo from "../../img/minderlogoimage.png";

///-------DONE---------
export const Maps = () => {
  const { store, actions } = useContext(Context);
  const [city, setCity] = useState(''); //same
  const [name, setName] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [pharmacy_fields, setpharmacy_fields] = useState('');
  const [resultsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [checked, setChecked] = useState(false)
  const navigate = useNavigate();

	actions.removeUnnecessaryItems();

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setCity(newCity); // Update local state to reflect input
    actions.setSelectedCityName(newCity); // Store the city name in the Flux store
  };
  ///-------DONE---------



  ///-------CHECKING---------
  const handlePharmacies = async () => {
    await actions.getPharmacies(city);
    if (store.pharmacies.length === 0) {
      setNoResults(true);
    } else {
      setNoResults(false);
      // Establece los campos de farmacia que se necesitan obtener, para mostrar detalles.
      setpharmacy_fields('name,formatted_address,current_opening_hours,formatted_phone_number');
      // console.log('pharmacyFields:', pharmacy_fields);
      actions.getPharmaciesDetails(pharmacy_fields, currentPage);
    }
    ///-------CHECKING---------




    ///-------where to put it???---------
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
  ///-------where to put it???---------




  ///-------CHECKING---------
  // Call getPharmaciesDetails function sennding the place_id (parameter)
  const handleOnClick = (place_id) => {
    actions.getPharmaciesDetails(place_id);
    // Go to new component to see de pharmacy details (fields)
    navigate(`/pharmacies-details/${place_id}`)
  }


  // To Pagination
  // Index last y first calculan los indices del primer y último resultado. 
  const indexLastResult = currentPage * resultsPerPage;
  const indexFirstResult = indexLastResult - resultsPerPage; // Current es la actual. resultsPerPage es la cantidad: useState(5);
  const currentResults = store.pharmacies.slice(indexFirstResult, indexLastResult);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber); // Actualiza el estado de currentPage
    actions.getPharmaciesDetails(pharmacy_fields, pageNumber); // hace llamada con el nuevo nº de página
  };
  ///-------CHECKING---------

  return (
    <div className="text-center">
      <h1 className="form-range">Encuentra tu Farmacia más cercana</h1>
      <img src={minderlogo} alt="Map Icon" width={300} />
      {/* <p>¿Buscas tu Farmacia de confianza?</p>
      <div>
      <span>Haz click </span><Link to="/findyourpharmacy">aquí</Link>
      </div> */}
      <div className="container justify-content-center d-flex">
        <div>
          <input
            type="text"
            id="location"
            value={city}
            placeholder=" Ciudad o Código Postal "
            onChange={handleCityChange}
            onKeyPress={handleKeyPress}
          />
          <button className="m-1 py-1 btn transparent-button p-5 border-info" onClick={handlePharmacies}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </div>
      <div className="form-check form-switch d-flex justify-content-center align-items-center">
        {/* Filtro para mostrar solo las Farmacias abiertas */}
        <input
          className="form-check-input custom-checkbox"
          type="checkbox"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)} />
        <label className="form-check-label m-2">Mostrar solo abiertas</label>
      </div>
      <div className="custom-transparent">
        {/* Mostrar mensaje si no se encuentran las farmacias */}
        {noResults ? (
          <p>No encuentra Farmacias Cercanas, por favor, ingrese otra dirección</p>
        ) : (
          // Mostrar Farmacias - Cambiamos el map a currentResults para que muestre los 5 resultados y no todos como hacía anteriormente.
          currentResults.map((item, index) =>
            <div>
              {/* Establecemos la lógica del filtro, si checked es true y opening_hours.open_now es true me muestras las que están abiertas*/}
              {
                checked ?
                  item.opening_hours.open_now ?
                    <div className="container w-50 custom-transparentcard card-container" key={index} style={{ background: "#007085", }}>
                      <h2 className="" style={{ color: "##00bab9", }}>{item.name}</h2>
                      {item.opening_hours && (
                        <p className='text-light'>Abierto Ahora</p>
                      )}
                      <p className='text-light'>Dirección: {item.vicinity}</p>
                      <p className='text-light'>Reseñas: {item.rating}</p>
                      <button className="p-2 m-2 btn btn-light" onClick={() => handleOnClick(item.place_id)}>Datos de Contacto</button>
                    </div>
                    : null
                  :
                  // Si el filtro checked es false, entonces me muestras todas las farmacias.
                  <div className="container w-50 custom-transparentcard card-container" key={index} style={{ background: "#007085" }}>
                    <h2 className="" style={{ color: "##00bab9", }}>{item.name}</h2>
                    {/* Si open_now es true, entonces estableces "Abierto" si no "Cerrado" */}
                    {item.opening_hours && (
                      <p className='text-light'>{item.opening_hours.open_now ? 'Abierto Ahora' : 'Cerrado'}</p>
                    )}
                    <p className='text-light'>Dirección: {item.vicinity}</p>
                    <p className='text-light'>Reseñas: {item.rating}</p>
                    <button className="btn btn-light p-2 m-2" onClick={() => handleOnClick(item.place_id)}>Datos de Contacto</button>
                  </div>
              }
            </div>
          )
        )}
        {/* Cambiar de página */}
        {/* Si el store es mayor que resultsperpage(establecido en 5) */}
        {store.pharmacies.length > resultsPerPage && (
          <ul className="pagination justify-content-center p-2 m-2">
            {/* me rehaces el array y divides el store actual por los resultados y empieza el index */}
            {Array.from({ length: Math.ceil(store.pharmacies.length / resultsPerPage) }, (_, index) => (
              <li key={index} className={`page-item & {index + 1 === currentPage ? 'active' : ''}`}>
                {/* añades +1 a la currentPage */}
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

import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext.js';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { Button } from 'bootstrap';

export const Maps = () => {
  const { store, actions } = useContext(Context);
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autocomplete, setAutocomplete] = useState([]);
  const [pharmacy_fields, setpharmacy_fields] = useState('');
  const params = useParams();
  const navigate = useNavigate()

  const handlePharmacies = async () => {
    await actions.getPharmacies(city);
    if (store.pharmacies.length === 0) {
      setNoResults(true);
    } else {
      setNoResults(false);
      actions.getAutocomplete(city);
      localStorage.setItem('lastSearchbycity', city);
      await setpharmacy_fields('name,formatted_address,current_opening_hours,formatted_phone_number');
      console.log('pharmacyFields:', pharmacy_fields);
      actions.getPharmaciesDetails(pharmacy_fields);
    }
  };

  const handleAutocompleteClick = (suggestion) => {
    setCity(suggestion);
    setAutocomplete([]); // Oculta las sugerencias después de seleccionar una
    handlePharmacies();
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (name) {
        // Lógica para detalles de farmacias
      } else {
        handlePharmacies();
      }
    }
  };

  const handleOnClick = (place_id) => {
    actions.getPharmaciesDetails(place_id);
    navigate(`/pharmacies-details/${place_id}`)
  }

  useEffect(() => {
    actions.getPharmaciesDetails(params.place_id);
  }, [params.place_id]);


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
            placeholder="¿Dónde vives?"
            onChange={(e) => {
              setCity(e.target.value);
              actions.getAutocomplete(e.target.value);
            }}
            onKeyPress={handleKeyPress}
          />
          {/* Mostrar las sugerencias de autocompletar */}
          {autocomplete.length > 0 && (
            <ul>
              {autocomplete.map((suggestion, index) => (
                <li key={index} onClick={() => handleAutocompleteClick(suggestion)}></li>
              ))}
            </ul>
          )}
          <button className="m-1 py-1 btn btn-success" onClick={handlePharmacies}>
            Buscar Farmacias por dirección
          </button>
        </div>
      </div>
      <div className="p-3">
        {/* Mostrar mensaje si no se encuentran las farmacias */}
        {noResults ? (
          <h2>No encuentra Farmacias Cercanas, por favor, ingrese otra dirección</h2>
        ) : (
          // Mostrar Farmacias
          store.pharmacies.map((item, index) => (
            <div className="container w-50 alert-success" key={index}>
              <h2 className="text-success">{item.name}</h2>
              {item.opening_hours && (
                <p>{item.opening_hours.open_now ? 'Abierto Ahora' : 'Cerrado'}</p>
              )}
              <p>Dirección: {item.vicinity}</p>
              <p>Reseñas: {item.rating}</p>
              {/* <p>place_pharmacy_id: {item.place_id}</p> */}
              {/* <Link to={`/pharmacies-details/${item.place_id}`} className="btn btn-light">
                Datos de Contacto
              </Link> */}
              <button className="btn btn-light" onClick={() => handleOnClick(item.place_id)}>Datos de Contacto</button>
            </div>
          ))
        )}
      </div>
      {/* Mostrar sugerencias de autocompletar */}
      {autocomplete.length > 0 && (
        <ul>
          {autocomplete.map((suggestion, index) => (
            <li key={index} onClick={() => handleAutocompleteClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

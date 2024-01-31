import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext.js';
import { Link } from 'react-router-dom';

export const Maps = () => {
  const { store, actions } = useContext(Context);
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autocomplete, setAutocomplete] = useState([]);

  const handlePharmacies = async () => {
    await actions.getPharmacies(city);
    if (store.pharmacies.length === 0) {
      setNoResults(true);
    } else {
      setNoResults(false);
      actions.getAutocomplete(city);
      localStorage.setItem('lastSearchbycity', city);
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
              <p>place_pharmacy_id: {item.place_id}</p>
              <Link to={`/pharmacies_details/${item.place_id}`} className="btn btn-light">
                Datos de Contacto
              </Link>
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

import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext.js';
import { Link } from 'react-router-dom';


export const Maps = () => {
  const { store, actions } = useContext(Context);
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [noResults, setNoResults] = useState(false); // Tratar el error si no encuentra farmacias
  const [loading, setLoading] = useState(false); // Estado para que aparezca mensaje mientras cargan las farmacias




  const handlePharmacies = async () => {
    await actions.getPharmacies(city);
    if (store.pharmacies.length === 0) {
      setNoResults(true);
    } else {
      setNoResults(false);
    }
  };


  const pharmaciesDetails = async () => {
    await actions.getPharmaciesDetails(name);
    if (store.pharmacyDetails) {
      console.log("Datos sobre tu farmacia:", store.pharmacyDetails);
    } else {
      setNoResults(true);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (name) {
        pharmaciesDetails();
      } else {
        handlePharmacies();
      }
    }
  };


  return (
    <div className="text-center">
      <h1>Encuentra tu farmacia más cercana</h1>
      <img src="https://cdn.icon-icons.com/icons2/54/PNG/256/map_search_find_maps_10803.png" alt="Map Icon" />
      <div className="container justify-content-center d-flex">
        {/* Ingresa el nombre de la Farmacia */}
        {/* <div>
        <input
          type="text"
          id="place_id"
          value={name}
          placeholder="Nombre de la Farmacia"
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="m-1 py-1 btn btn-success" onClick={pharmaciesDetails}>
          Buscar Farmacias por nombre
        </button>
        </div> */}
        {/* <h2>Ingresa la ciudad</h2> */}
        <div>
        <input
          type="text"
          id="location"
          value={city}
          placeholder="¿Dónde vives?"
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
        />
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
              <p>{item.vicinity}</p>
              <p>{item.rating}</p>
              <Link to={`/maps`} className="btn btn-light">Datos de Contacto</Link>
              {/* <Link to={`/pharmacies_details/${item.place_pharmacy_id}`} className="btn btn-light">Datos de Contacto</Link> */}
            </div>
          ))
          )}
      </div>
    </div>
  );
};

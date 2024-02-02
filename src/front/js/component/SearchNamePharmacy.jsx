import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext.js';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";


export const SearchNamePharmacy = () => {
  const { store, actions } = useContext(Context);
  const [name, setName] = useState('');
  // const [noResults, setNoResults] = useState(false);
  // const [pharmacy_fields, setpharmacy_fields] = useState('');
  const params = useParams();
  const navigate = useNavigate();
  const [noResults, setNoResults] = useState(false);
  const [filteredPharmacies, setFilteredPharmacies] = useState([]);

  // Activar botón "enter"
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (name) {
      } else {
        handleSearchYourPharmacies();
      }
    }
  };

  const handleSearchYourPharmacies = () => {
    const storedPharmacies = JSON.parse(localStorage.getItem('pharmacies')) || [];
    const filtered = storedPharmacies.filter(pharmacy => pharmacy.name.toLowerCase().includes(name.toLowerCase()));
    setFilteredPharmacies(filtered);
    if (filtered.length === 0) {
      setNoResults(true);
    } else {
      setNoResults(false);
    }
  };

  return (
    <div className="text-center">
      <h1>Selecciona Tu Farmacia</h1>
      <img src="https://png.pngtree.com/png-vector/20220716/ourmid/pngtree-medical-cross-vector-icon-cross-pharmacy-care-vector-png-image_37968170.png" alt="yourpharmacy" />
      <div className="container justify-content-center">
        <div>
          <input
            type="text"
            id="location"
            value={name}
            placeholder="Nombre de Tu Farmacia"
            onChange={(e) => {
              setName(e.target.value);
            }}
            onKeyPress={handleKeyPress}
          />
          <button className="m-1 py-1 btn btn-success" onClick={handleSearchYourPharmacies}>
            Por favor, busca tu farmacia
          </button>
        </div>
        <ul>
          {noResults ? (
            <h2>No encuentra su Farmacia</h2>
          ) : (
            // Mostramos Las Farmacias
            filteredPharmacies.map((item, index) => (
              <div key={index}>
                <h2>
                  {item.name}
                </h2>
              </div>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

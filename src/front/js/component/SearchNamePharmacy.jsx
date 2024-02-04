import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext.js';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export const SearchNamePharmacy = () => {
  const { store, actions } = useContext(Context);
  const [name, setName] = useState('');

  
  const handleSearchYourPharmacies = async () => {
    console.log("handleSearchYourPharmacies")
    await actions.getPharmacyName(name);
  }
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (name) {
        handleSearchYourPharmacies();
      }
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
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
        <ul>
          {store.pharmaciesNames.length > 0 ? (
            // Mostramos Las Farmacias
            store.pharmaciesNames.map((item, index) => (
              <div key={index} className="card p-2 m-2">
                <div className="bg-image hover-overlay">
               
                  {/* <Link to="/">
                    <div className="mask" style={{ backgroundColor: 'rgba(251, 251, 251, 0.15)' }}>Continua</div>
                  </Link> */}
                </div>
                <div className="card-body">
                  <h5 className="card-title">{item.description}</h5>
                  <h7 className="card-title">{item.terms[2].value}</h7>
                  {/* <p>{item.place_id}</p> */}
                  <p className="card-text"></p>
                  {/* <button className="btn btn-primary" data-mdb-ripple-init> Continua para Registrarte</button> */}
                   <Link to={`/register/${item.place_id}`}> {/*Formulario de login in, enviar id para poder rellenar campos(?)*/}
                    <div className="mask">Continua para registrarte</div>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No encuentra tu farmacia, Por favor, comprueba que el nombre de tu farmacia es correcto</p>
          )}
        </ul>
      </div>
    </div>
  );
};
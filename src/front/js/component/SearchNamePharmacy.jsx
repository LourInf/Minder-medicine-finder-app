import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext.js';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import "../../styles/maps.css"
import pharmacy from "../../img/minderpharmacy22.png"

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
      <h1 className="form-range text-black-50">Escoge tu Farmacia</h1>
      <img src={pharmacy} alt="yourpharmacy" className='w-25' />
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
          <button className="m-1 py-1 btn transparent-button" onClick={handleSearchYourPharmacies}>
            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#27abab", }} />
          </button>
        </div>
        <ul className="w-50 d-inline-block">
          {store.pharmaciesNames.length > 0 ? (
            // Mostramos Las Farmacias
            store.pharmaciesNames.map((item, index) => (
              <div key={index} className="card p-1 m-1 card-container">
                <div className="bg-image hover-overlay">

                  {/* <Link to="/">
                    <div className="mask" style={{ backgroundColor: 'rgba(251, 251, 251, 0.15)' }}>Continua</div>
                  </Link> */}
                </div>
                <div className="card-body p-2" style={{ background: "#84f4c5", }}>
                  <h5 className="card-title">{item.description}</h5>
                  <h7 className="card-title">{item.terms[2].value}</h7>
                  {/* <p>{item.place_id}</p> */}
                  <p className="card-text"></p>
                  {/* <button className="btn btn-primary" data-mdb-ripple-init> Continua para Registrarte</button> */}
                  <Link to={`/register/${item.place_id}`} style={{ color: "white", }}> {/*Formulario de login in, enviar id para poder rellenar campos(?)*/}
                    <div className="mask">Continua para registrarte</div>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p></p>
          )}
        </ul>
      </div>
    </div>
  );
};
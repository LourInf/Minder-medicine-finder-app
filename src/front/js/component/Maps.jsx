
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext.js';

export const Maps = () => {
  const { store, actions } = useContext(Context);
  const [city, setCity] = useState('');

  const handlePharmacies = () => {
    actions.getPharmacies(city);
  };

  const handleKeyPress = (e) => {
    if (e.key== 'Enter') {
      handlePharmacies();
    }
  };

  return (
    <div className="text-center">
      <h1>Encuentra tu farmacia más cercana</h1>
      <label>Ingrese la ciudad más cercana: </label>
      <input type="text" id="location" value={city} placeholder="Ejemplo: Madrid" onChange={(e) => setCity(e.target.value)} onKeyPress={handleKeyPress}/>
      <button onClick={handlePharmacies}>Buscar Farmacias</button>
      <ul>
        {/* Mostrar Listas de Farmacias luego pasar otra página */}
        {console.log(store.pharmacies)}
        {store.pharmacies.map((item, index) => (
          <li key={index}>
            <h2>{item.name}</h2>
            {item.opening_hours && (
              <p>{item.opening_hours.open_now ? 'Abierto Ahora' : 'Cerrado'}</p>
            )}
            <p>{item.vicinity}</p>
            <p>{item.rating}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
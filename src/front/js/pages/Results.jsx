import React, { useContext, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Context } from "../store/appContext.js";
import { CardResults } from "../component/CardResults.jsx";
import { useParams } from 'react-router-dom';
import "../../styles/results.css";

export const Results = () => {
  const { store, actions } = useContext(Context);
  const { medicineId, cityName } = useParams();



  const selectedMedicine = localStorage.getItem('selectedMedicine');
  const selectedCityName = localStorage.getItem('selectedCityName');
  

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
    <div className ="results-wrapper">
      <section className="container-main-text text-center mb-5">
        <h1 className="heading-db-pharmacies pb-5">
          {selectedMedicine && selectedCityName && store.availablePharmacies && store.availablePharmacies.length > 0 ? (
            <>
              Farmacias con disponibilidad de <span className="medicine-text">{JSON.parse(selectedMedicine).medicine_name.slice(0, 30)}</span> en {JSON.parse(selectedCityName)}
              {store.availablePharmacies?.map((pharmacy, index) => (
                <CardResults key={index} buttonType="reserve" pharmacy={pharmacy} medicineId={medicineId} cityName={cityName} />
              ))}
              <section className="text-center mt-5 p-3">
                <h2 className="heading-google-pharmacies p-3 mb-3">¿No has encontrado lo que buscas?</h2>
                <Link to="/maps" className="explore-more-btn">Explorar más farmacias</Link>
              </section>
            </>
          ) : (
            <div>
              {"Lo sentimos, no encontramos disponibilidad de "}
              <span className="medicine-text">
                {JSON.parse(localStorage.getItem('selectedMedicine')).medicine_name.slice(0, 20)}
              </span>
              {" en las farmacias asociadas."}
              <section className="text-center mt-5 p-3">
                <Link to="/" className="return-btn">Intentar nueva búsqueda</Link>
                <Link to="/maps" className="explore-more-btn">Explorar más farmacias</Link>
                {/* <button className="explore-more-btn" onClick={() => handleOnClick(item.cityName)}>Explorar más farmacias</button> */}
              </section>
            </div>
          )}
        </h1>
      </section>
    </div>
  );
};
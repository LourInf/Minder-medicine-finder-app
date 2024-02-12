import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Context } from "../store/appContext.js";
import { CardResults } from "../component/CardResults.jsx";
import { useParams } from 'react-router-dom';
import "../../styles/results.css";

export const Results = () => {
  const { store, actions } = useContext(Context);
  const { medicineId, address, cityName } = useParams();
  // const [name, setName] = useState('');
  // const [noResults, setNoResults] = useState(false);
  const [pharmacy_fields, setpharmacy_fields] = useState('');
  const [resultsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

	// actions.removeUnnecessaryItems();

  const selectedMedicine = localStorage.getItem('selectedMedicine');
  const selectedCityName = localStorage.getItem('selectedCityName');


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
    <div>
     <section className="container-main-text text-center mb-5">
      {/* Section 1: Pharmacies with selected medicine availability in our DB */}
      <h1 className="heading-db-pharmacies pb-4">
      {localStorage.getItem('selectedMedicine') && localStorage.getItem('selectedCityName') && store.availablePharmacies && store.availablePharmacies.length > 0 ? (
      // <>
      //   ¡Buenas noticias! Es posible que {JSON.parse(localStorage.getItem('selectedMedicine')).medicine_name.slice(0, 20)} esté disponible en las siguientes farmacias
      //   {localStorage.getItem('selectedCityName')}
      // </>
       <>
        Farmacias con disponibilidad de <span className="medicine-text"> {JSON.parse(localStorage.getItem('selectedMedicine')).medicine_name.slice(0, 20)}</span> en tu zona:
      </>
      ) : (
        <div>
        {"Lo sentimos, no encontramos disponibilidad de "}
        <span className="medicine-text">
          {JSON.parse(localStorage.getItem('selectedMedicine')).medicine_name.slice(0, 20)}
        </span>
        {" en las farmacias asociadas."}
      </div>
      )}
      </h1>
      {store.availablePharmacies?.map((pharmacy, index) => (
          <CardResults key={index} buttonType="reserve" pharmacy={pharmacy} medicineId={medicineId} cityName={cityName} />
        ))}

        {!store.availablePharmacies?.length && (
          <Link to="/" className="return-btn mx-auto">Intentar una nueva búsqueda</Link>
        )}
      </section>
      
      <section className="text-center mt-5 p-3">
        <h2 className="heading-google-pharmacies p-3">¿No has encuentrado lo que buscas?</h2>
        <p className="p-3">Explora otras farmacias en tu área para más opciones.</p>
        <Link to="/maps" className="explore-more-btn p-3">Buscar más farmacias</Link>
      </section>
    </div>
  );
};
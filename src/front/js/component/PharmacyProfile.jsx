import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js"
import { useNavigate } from "react-router-dom";
import { ModalModification } from "./ModifyPatient.jsx";

export const PharmacyProfile = () => {
  const { store, actions } = useContext(Context);
  // const [ patient, setPatient ] = useState(null);
  // const [ fetchPatient, setFetchPatient ] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [ detailsPharma, setDetailsPharma ] = useState({});

  actions.removeUnnecessaryItems();

  useEffect(() => {
    const userLogged = JSON.parse(localStorage.getItem("userLogged"));

    const getPharmaDetails = async () => {
      setDetailsPharma(await actions.getOurPharmacyDetails(store.user_id));
      console.log("details dentro -> ", detailsPharma);
      // return details;
    }

    if (userLogged != null) {
      if (userLogged.expire < new Date().getTime()) {
        actions.logout();
        localStorage.removeItem("userLogged");
        navigate("/login");
      }
      getPharmaDetails();
      console.log("detailsPharma fuera -> ", detailsPharma);
    } else {
      navigate("/login");
    }


  }, [navigate]);


  const closeModal = () => {
    setShowModal(false);
  }

  const displayModal = () => {
    setShowModal(true)
    console.log("Hola buenas");
  }




  return (
    <div className="container p-2 m-2">

      <h2>Patient information</h2>
      <button className="btn btn-info mb-3" onClick={displayModal}>Edit info</button>
      {store.user_id !== null && detailsPharma.pharmacy_name ? (
        <div>

          <p><b>ID de usuario</b>: {store.user_id}</p>
          <p><b>ID de Farmacia</b> (Nuestra BD): {store.pharmacy_id}</p>
          <p><b>Nombre de farmacia</b>: {detailsPharma.pharmacy_name}</p>
          <p><b>Número de Farmacia SOE</b>: {detailsPharma.pharmacy_SOE}</p>
          <p><b>Ciudad</b>: {detailsPharma.pharmacy_address}</p>
          <p><b>24H</b>: {detailsPharma.pharmacy_24H ? "Sí" : "No"}</p>
          <p><b>Teléfono</b>: {detailsPharma.pharmacy_phone}</p>
          <p><b>Horarios</b>: {detailsPharma.pharmacy_working_hours}</p>

        </div>
      ) : (
        <p>Loading your info</p>
      )}

      {showModal && <ModalModification show={showModal} handleCloseModal={closeModal} pharmacy_id={store.pharmacy_id} />}


    </div>
  );
};



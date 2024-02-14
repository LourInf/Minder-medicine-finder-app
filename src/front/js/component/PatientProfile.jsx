import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js"
import { useNavigate } from "react-router-dom";
import { ModalModification } from "./ModifyPatient.jsx";

export const PatientProfile = () => {
  const { store, actions } = useContext(Context);
  // const [ patient, setPatient ] = useState(null);
  // const [ fetchPatient, setFetchPatient ] = useState(false);
  const [ showModal, setShowModal ] = useState(false);
  const navigate = useNavigate();

	actions.removeUnnecessaryItems();

  useEffect( () => {
    const userLogged = JSON.parse(localStorage.getItem("userLogged"));
    if(userLogged != null){
        if(userLogged.expire < new Date().getTime()){
            actions.logout();
            localStorage.removeItem("userLogged");
            navigate("/login");
        }
        actions.getPatientId(store.user_id);
    }else{
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
      {store.user_id !== null ? (
        <div>
          <p><b>UserID</b>: {store.user_id}</p>
          <p><b>PatientID</b>: {store.patient_id}</p>
          <p><b>Name</b>: {store.patient_name}</p>
          <p><b>Email</b>: {store.email}</p>
        </div>
      ) : (
        <p>Loading your info</p>
      )}

      {showModal && <ModalModification show={showModal} handleCloseModal={closeModal} patient_id={store.patient_id} />}


    </div>
  );
};



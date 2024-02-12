import React, { useContext, useState, useEffect } from "react"
import { Context } from "../store/appContext";
import { Navigate, useNavigate } from "react-router-dom";



export const PatientInfo = () => {
    const { store, actions } = useContext(Context);
    const [patient, setPatient] = useState(null);
    const [fetchPatient, setFetchPatient] = useState(false);
    const navigate = useNavigate();

	actions.removeUnnecessaryItems();


    const getPatientInfo = async () => {

        const patientLogged = JSON.parse(localStorage.getItem("userLogged"))   //  Lo malo es que el id de este usuario será vulnerable...

        if (patientLogged != null) {
            const url = process.env.BACKEND_URL + `/api/getPatientById/${patientLogged.user_id}`;

            try {
                console.log("La url -> ", url);
                const response = await fetch(url);
                console.log("Pasado el response");

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setPatient(data);
                    setFetchPatient(true);
                } else {
                    console.error("Error fetching the patient");
                }
            } catch (error) {
                console.error("Error fetching the patient info -> ", error);
            }
        } else {
            navigate("/login");
        }

    }




    useEffect(() => {
        const userLogged = JSON.parse(localStorage.getItem("userLogged"));
        if (userLogged != null) {
            if (userLogged.expire < new Date().getTime()) {
                actions.logout();
                localStorage.removeItem("userLogged");
                navigate("/login");
            }
        } else {
            navigate("/login");
        }

        if (!fetchPatient) {
            getPatientInfo();
        }

    }, [navigate]);



    return (

        // !store.isLoggedIn ? <Navigate to="/login" /> :

        <div>

            <h2>Patient information</h2>
            <button className="btn btn-warning mb-3">Edit info</button>
            {patient !== null ? (
                <div>
                    <p><b>PatientID</b>: {patient.patient_id}</p>
                    <p><b>Name</b>: {patient.name}</p>
                    <p><b>Email</b>: {patient.email}</p>
                </div>
            ) : (
                <p>Loading your info</p>
            )}


        </div>

    )


}
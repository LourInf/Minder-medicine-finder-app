import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';

export const DetailsPharmacyMaps = () => {
    const { store, actions } = useContext(Context);
    const { pharmacyDetails } = store;

    return (
        <div>
            <Link className="navbar-brand m-3 p-3" to="/maps">Volver</Link>
            <h1 className="text-center p-2 m-3">Consulta los datos de la Farmacia</h1>
            {/* Si existe "pharmacydetails" entonces me extraes la info */}
            {pharmacyDetails ? (
                <div className="container">
                    <div className="card mb-3">
                        <div className="row g-0">
                            <div className="col-md-7 col-lg-6 col-xl-5">
                                <img
                                    src="https://www.carmona.org/ciudad/farmacias/logoFarmacias.png"
                                    className="card-img-center"
                                    alt="farmacia"
                                />
                            </div>
                            <div className="col-md-5 col-lg-6 col-xl-7">
                                <div className="card-body w-75 text-center">
                                    {/* <h1>{pharmacyDetails.place_id}</h1> */}
                                    <h3>{pharmacyDetails.name}</h3>
                                    <p> Dirección: {pharmacyDetails.formatted_address}</p>
                                    <p>
                                        Teléfono:{" "}
                                        <a href={`tel:${pharmacyDetails.formatted_phone_number}`}>
                                            {pharmacyDetails.formatted_phone_number}
                                        </a>
                                    </p>
                                    <ul>
                                        {pharmacyDetails.current_opening_hours.weekday_text.map((day, index) => (
                                            <li className="list-inline" key={index}>{day}</li>
                                        ))}
                                    </ul>
                                    <p>Estado: {pharmacyDetails.current_opening_hours.open_now ? 'Abierto Ahora' : 'Cerrado'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    {/* Si tarda en hacer la llamada entonces muestra el spinner */}
                    {store.loading ? (
                        <>
                            <Spinner animation="border" variant="success" />
                            <p>Cargando...</p>
                        </>
                    ) : (
                        // Si no hay detalles... 
                        <p>No Existen Datos Para Esta Farmacia</p>
                    )}
                </div>
            )}
        </div>
    );
};
import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const DetailsPharmacyMaps = () => {
    const { store, actions } = useContext(Context);


    return (
        <div>
            <Link className="navbar-brand m-3" to="/maps">Volver</Link>
            <h1 className="text-center p-2 m-3">Detalle de la Farmacia</h1>
            {store.pharmacyDetails ? (
                <div className="container bg-success">
                    <div className="card mb-3  bg-success text-light">
                        <div className="row g-0">
                            <div className="col-md-7 col-lg-6 col-xl-5">
                                <img
                                    src={store.pharmacyDetails.icon}
                                    className="card-img-top w-100 h-100"
                                    alt="farmacia"
                                />
                            </div>
                            <div className="col-md-5 col-lg-6 col-xl-7">
                                <div className="card-body">
                                    <h1>{store.pharmacyDetails.place_id}</h1>
                                    <h1>{store.pharmacyDetails.name}</h1>
                                    <p> Dirección: {store.pharmacyDetails.formatted_address}</p>
                                    <p>Teléfono: {store.pharmacyDetails.formatted_phone_number}</p>
                                    <p>Horario Laboral: {store.pharmacyDetails.working_hours}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>No encuentra detalles de la farmacia...</p>
            )}
        </div>
    );
};

import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import  Spinner  from 'react-bootstrap/Spinner';

export const DetailsPharmacyMaps = () => {
    const { store, actions } = useContext(Context);
    const { pharmacyDetails } = store;

    return (
        <div>
            <Link className="navbar-brand m-3" to="/maps">Volver</Link>
            <h1 className="text-center p-2 m-3">Detalle de la Farmacia</h1>
            {/* Si existe "pharmacydetails" entonces me extraes la info */}
            {pharmacyDetails ? (
                <div className="container bg-success">
                    <div className="card mb-3  bg-success text-light">
                        <div className="row g-0">
                            <div className="col-md-7 col-lg-6 col-xl-5">
                                <img
                                    src="https://images.vexels.com/media/users/3/136559/isolated/preview/624dd0a951a1e8a118215b1b24a0da59-logotipo-de-farmacia.png"
                                    className="card-img-top"
                                    style={{ width: '80px', height: '80px' }}
                                    alt="farmacia"
                                />
                            </div>
                            <div className="col-md-5 col-lg-6 col-xl-7">
                                <div className="card-body">
                                    <h1>{pharmacyDetails.place_id}</h1>
                                    <h1>{pharmacyDetails.name}</h1>
                                    <p> Dirección: {pharmacyDetails.formatted_address}</p>
                                    <p>Teléfono: {pharmacyDetails.formatted_phone_number}</p>
                                    <p>Horario Laboral: {pharmacyDetails.current_opening_hours.weekday_text}</p>
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
                        // si no hay detalles... 
                        <p>No Existen Datos Para Esta Farmacia</p>
                    )}
                </div>
            )}
        </div>
    );
};
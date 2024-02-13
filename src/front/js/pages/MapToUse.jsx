import React, { useState, useContext, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Context } from '../store/appContext.js';
import { Link, useNavigate } from 'react-router-dom';

export const MapToUse = () => {
    const [map, setMap] = useState(null);
    const [center, setCenter] = useState({ lat: 40.463667, lng: -3.74922 }); // Coordenadas de España
    const { store, actions } = useContext(Context);
    const [markers, setMarkers] = useState([]);
    const [city, setCity] = useState('');
    const [selectedPharmacyLocation, setSelectedPharmacyLocation] = useState(null);
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);
    const navigate = useNavigate();


    // useEffect(() => {
    //     // Cargar las farmacias al montar el componente
    //     handlePharmacies();
    // }, []); // Se ejecuta solo al montar el componente

    const updateMarkers = () => {
        // Obtener las farmacias del store
        const pharmacies = store.pharmacies;
        // Crear nuevos marcadores para cada farmacia
        const newMarkers = pharmacies.map(pharmacy => ({
            position: {
                lat: pharmacy.geometry.location.lat,
                lng: pharmacy.geometry.location.lng
            },
            pharmacy: pharmacy,
            place_id: pharmacy.place_id ,
            opening_hours: pharmacy.opening_hours// Agregar el place_id al objeto de marcador
        }));
        // Actualizar el estado de los marcadores
        setMarkers(newMarkers);
    };

    const handlePharmacies = async () => {
        // Obtener las farmacias según la ciudad
        await actions.getPharmacies(city);
        // Actualiza los marcadores en el mapa
        updateMarkers();
        // Establece la ubicación de la farmacia seleccionada como la ubicación central del mapa
        if (store.pharmacies.length > 0) {
            const selectedPharmacy = store.pharmacies[0];
            const lat = selectedPharmacy.geometry.location.lat();
            const lng = selectedPharmacy.geometry.location.lng();
            setSelectedPharmacyLocation({ lat, lng });
        }
    };


    const handleMarkerClick = (marker) => {
        setSelectedPharmacy(marker.pharmacy);
    };

    const handleMarkerClose = () => {
        setSelectedPharmacy(null);
    };

    // Activar botón "enter"
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (name) {
            } else {
                handlePharmacies();
            }
        }
    };
    // Call getPharmaciesDetails function sennding the place_id (parameter)
    const handleOnClick = (place_id) => {
        actions.getPharmaciesDetails(place_id);
        // Go to new component to see de pharmacy details (fields)
        navigate(`/pharmacies-details/${place_id}`)
    }

    return (
        <div className="container" style={{ height: '400px', width: '80%' }}>
            <input
                className="my-1"
                type="text"
                id="location"
                value={city}
                placeholder="Ciudad: Madrid"
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <LoadScript googleMapsApiKey={process.env.GOOGLE_API_KEY}>
                <GoogleMap
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    center={center}
                    zoom={8}
                >
                    {markers.map((marker, index) => (
                        <Marker key={index} position={marker.position} 
                        icon={{
                            url: 'data:image/png;base64,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', // Ruta relativa al icono de la farmacia
                            scaledSize: new window.google.maps.Size(30, 30), // Tamaño del icono
                            origin: new window.google.maps.Point(0, 0), // Origen del icono
                            anchor: new window.google.maps.Point(15, 15) // Ancla del icono
                        }}
                        onClick={() => handleMarkerClick(marker)}>
                            {selectedPharmacy === marker.pharmacy && (
                                <InfoWindow onCloseClick={handleMarkerClose}>
                                    <div>
                                        <h5>{marker.pharmacy.name}</h5>
                                        <p>{marker.pharmacy.vicinity}</p>
                                        {marker.opening_hours && (
                                            <p>{marker.opening_hours.open_now ? 'Abierto Ahora' : 'Cerrado'}</p>
                                        )}
                                        <button className="btn btn-light p-1 m-1" onClick={() => handleOnClick(marker.place_id)}>Datos de Contacto</button>
                                    </div>
                                </InfoWindow>
                            )}
                        </Marker>
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

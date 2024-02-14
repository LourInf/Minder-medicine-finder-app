import React, { useState, useContext, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Context } from '../store/appContext.js';
import { Link, useNavigate } from 'react-router-dom';
import "../../styles/maptouse.css";

export const MapToUse = () => {
    const [map, setMap] = useState(null);
    const [center, setCenter] = useState({ lat: 40.463667, lng: -3.74922 }); // Coordenadas de España
    const { store, actions } = useContext(Context);
    const [zoom, setZoom] = useState(8);
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
            console.log("Selected Pharmacy Location:", selectedPharmacy.geometry.location.lat, selectedPharmacy.geometry.location.lng);
            const lat = selectedPharmacy.geometry.location.lat;
            const lng = selectedPharmacy.geometry.location.lng;
            // Establece el centro del mapa en la ubicación de la primera farmacia encontrada
            setCenter({ lat, lng });
            console.log("Center Updated:", center);
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
                    zoom={zoom}
                >
                    {markers.map((marker, index) => (
                        <Marker key={index} position={marker.position} 
                        icon={{
                            url: 'https://cdn2.iconfinder.com/data/icons/map-locations-flat-pixel-perfect/64/pin-map-location-14-512.png', 
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

"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints.
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, Users, Pharmacies, Medicines, Patients, Orders, Availability
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import requests
import os


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body ['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200


# The patient will enter the city or location and must receive a list of the closest pharmacies
@api.route('/maps', methods=['GET'])
def handle_maps():
    api_key = os.environ.get('GOOGLE_API_KEY')
    api_url_places = os.environ.get('URL_GOOGLE_PLACES')
    response_body: {}
    # Request.args (request arguments) obtiene el valor de city que viene del Front-End inyectado por el Paciente.
    city = request.args.get('city')
    # Lógica si no obtenemos "city" y??
    if not city:
        response_body = {"error": "Parámetro city no proporcionado"}
        return jsonify(response_body), 400
        #Seguir con la lógica
    # El paciente inserta la "city" y la API de Geocode de Google la transforma en formato Latitud y Longitud.
    api_url_geocoding = os.environ.get('URL_GOOGLE_GEOCODING')  
    # Extraer la API desde ENV + el argumento address obligatorio por la API. Sustituimos address por la "city" que introduce el paciente. 
    geocoding_params = {'address': f'{city}, Spain','key': api_key}
    # Necesitamos hacer un get de la api y extraer el parámetro que ha transformado la ciudad en lat y lng. 
    geocoding_response = requests.get(api_url_geocoding, params=geocoding_params)
    # Imprimir para ver el resultado si es ok.
    print (geocoding_response)
    if geocoding_response.status_code == 200:
        # Cambiamos el dato de la API Rest a formato json para poder manipularlo desde el Front:
        geocoding_data = geocoding_response.json()
        if geocoding_data['status'] == 'OK':
            # Aquí se usa la lógica de la API Geocode para cambiar el formato de ciudad por lat/lng
            location_data = geocoding_data['results'][0]['geometry']['location']
            location = f"{location_data['lat']},{location_data['lng']}"
            types = 'pharmacy' # Dato fijo "farmacia" porque es el único tipo de comercio que queremos extraer. 
            #     # location = "40.392163,-3.6978677"  # La Location debe venir dada por el usuario
            # Establecemos la lógica si no tenemos "location". Sin esto, no se puede continuar.
            if not location: 
                return{'error': "Es necesaria la ubicación para poder continuar"}, 400
            large_radius = 10000 # Dato fijo el radio está en metros = 10km
            api_key = os.environ.get('GOOGLE_API_KEY')
            api_url_places = os.environ.get('URL_GOOGLE_PLACES')
            # Sí tenemos la ciudad, la cual hemos cambiado a formato lat/lng entonces montamos la url para acceder la API Places. 
            url = f'{api_url_places}?location={location}&radius={large_radius}&types={types}&geocode&language=es&key={api_key}'
            response = requests.get(url)
            if response.status_code == 200:
                return jsonify(response.json()), 200
            else:
                return {'error': 'Error en la solicitud a la API de Google Places'}, 500
            # return jsonify(location) # Comprobar que devuelve lat/lng de la "city". 
        else:
            response_body = {"error": f"No se pudo obtener la ubicación para la ciudad: {city}"}
            return jsonify(response_body), 400
    else:
        response_body = {"error": "Error en la solicitud a la API de geocoding"}
        return jsonify(response_body), 500

@api.route('/pharmacies_details', methods=['POST']) # Debe ser método POST
def handle_pharmacies_details():
    response_body = {}
    api_url_places_details = os.environ.get('URL_GOOGLE_PLACES_DETAILS')
    api_key = os.environ.get('GOOGLE_API_KEY')
    data = request.json
    # Este dato debe venir del Front
    pharmacy_id = data['place_id']
    # Estos campos son los seleccioandos para extraer, se pueden modificar. Consultar Documentación API. 
    pharmacy_fields = 'name,adr_address,formatted_address,current_opening_hours,formatted_phone_number'
    if not pharmacy_id or not pharmacy_fields:
        response_body = {"error": "Id or Fields' no proporcionado"}
        return jsonify(response_body), 400
    url_pharmacies_details = f'{api_url_places_details}?key={api_key}&place_id={pharmacy_id}&fields={pharmacy_fields}'
    headers = {
         'Content-Type': 'application/json'}
    response = requests.get(url_pharmacies_details, headers=headers)
    if response.status_code == 200:
        return jsonify(response.json()), 200
    else:
        return {'error': "Error en la API Google Places para obtener detalles"}, 500

@api.route('/pharmacies_names', methods=['GET'])
def handle_pharmacies_names():
        api_key = os.environ.get('GOOGLE_API_KEY')
        api_url = os.environ.get('URL_GOOGLE_PLACES_AUTOCOMPLETE')
        # https://maps.googleapis.com/maps/api/place/autocomplete/json?input=guareña&types=pharmacy&key
        # https://maps.googleapis.com/maps/api/place/autocomplete/json
        names = request.args.get('pharmacy')
        if not names:
            return jsonify('error:' 'No se ha proporcionado parámetro names'), 500
        url = f'{api_url}?input={names}&types=pharmacy&key={api_key}'
        print(f"Constructed URL: {url}")
        response = requests.get(url)
        if response.ok:
            data=response.json()
            return jsonify(data)
        else:
            return jsonify({"error": "Error en la búsqueda las farmacias"})


# Activar geolocalización - En proceso
# @api.route('/geolocation', methods=['POST'])
# def handle_geolocation():
#     response_body = {}
#     results = {}
#     data = request.json
#     latitud = data.get('latitude')
#     longitude = data.get('longitude')
#     # near_pharmacies = 
#     api_url_geolocation = os.environ.get('URL_GOOGLE_GEOLOCATION')
#     api_key = os.environ.get('GOOGLE_API_KEY')
#     url_maps_geolocation = f'{api_url_geolocation}?&key={api_key}'

"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, Users, Medicines
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import requests
import os
import math


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body ['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200

# Endpoint to refresh our DB in case of new medicines added in external API
@api.route('/refresh-medicines', methods=['POST'])
def refresh_medicines():
    response_body = {}
    base_url = os.getenv('API_URL')

    # Send a GET request to the external API (from Postman code snippet) to get total items and page size:

    total_filas = 0
    tamanio_pagina = 0
    total_paginas = 0

    #url = f"{base_url}/medicamentos?*"
    #headers = {
    #    'Cookie': 'JSESSIONID=l8cZUI4nhIEb7wVov5NVQHPStjA3fVAKm0JEqF4Jk4psOLSnQZtk!-905703110'
    #}

    response = requests.get(f"{base_url}/medicamentos?*")
    if response.status_code == 200:
        data = response.json()  # This converts JSON response to a Python dictionary
        total_filas = data['totalFilas']
        tamanio_pagina = data['tamanioPagina']
        total_paginas = math.ceil(total_filas / tamanio_pagina)
        i = 1

        while i <= total_paginas:
            response = requests.get(f"{base_url}/medicamentos?pagina={i}")
            data = response.json()  # This converts JSON response to a Python dictionary
        
            for item in data.get('resultados', []):
                medicine_name = item.get('nombre')
                api_id = item.get('nregistro')

                # Check if the medicine already exists in the database
                existing_medicine = Medicines.query.filter(
                (Medicines.medicine_name == medicine_name) | (Medicines.API_id == api_id)
                ).first()
                if not existing_medicine:
                # Add new medicine to the database
                    new_medicine = Medicines(medicine_name=medicine_name, API_id=api_id)
                    db.session.add(new_medicine)
            
            db.session.commit()
            i = i+1
    else:
        print("Failed to retrieve data")
    
    response_body['message'] = 'Medicines added successfully'
    return jsonify(response_body), 200




@api.route('/refresh-medicines', methods=['DELETE'])
def delete_medicines():
    response_body = {}

    # Delete all entries in the Medicines table
    db.session.query(Medicines).delete()
    db.session.commit()

    response_body['message'] = "All medicines have been removed."
    
    return jsonify(response_body), 200


# Enpoint to search medicines by name from our db
@api.route('/medicines/search', methods=['GET'])
def search_medicines():
    # Get search parameters
    # Query the database for medicines
    # Return search results
    search_name = request.args.get('name', '')  # Get search query from URL parameters
    if search_name:
        # Use a case-insensitive search for matching medicine names
        medicines = Medicines.query.filter(Medicines.medicine_name.ilike(f'%{search_name}%')).all()
    else:
        medicines = []

    # Serialize the data
    medicines_list = [medicine.serialize() for medicine in medicines]
    response_body = {
        'results': medicines_list,
        'message': 'Search results' if medicines else 'No medicines found'
    }
    return jsonify(response_body), 200


# Enpoint to search pharmacies with stock (params=len,lat, id med)
#@api.route('/pharmacies', methods=['GET'])
#def search_pharmacies():
    # Get search parameters
    # Query the database for medicines
    # Return search results
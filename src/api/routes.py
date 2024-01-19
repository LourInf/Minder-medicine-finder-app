"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, Users, Medicines
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import requests


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body ['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200


@api.route('/medicines', methods=['GET'])
def handle_get_medicines():
        response_body = {}
        medicines = Medicines.query.all()
        # Serialize the data
        medicines_list = [medicine.serialize() for medicine in medicines]
        response_body['results'] = medicines_list
        response_body['message'] = 'Medicines List'
        return response_body, 200
        

@api.route('/refresh-medicines', methods=['POST'])
def handle_refresh_medicines():
    response_body = {}

     # Send a GET request to the external API (from Postman code snippet)
    url = "https://cima.aemps.es/cima/rest/medicamentos?*"
    headers = {
        'Cookie': 'JSESSIONID=l8cZUI4nhIEb7wVov5NVQHPStjA3fVAKm0JEqF4Jk4psOLSnQZtk!-905703110'
    }
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        return jsonify({'message': 'Error al recuperar los medicamentos de la API externa'}), response.status_code
    data = response.json()
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
    response_body['message'] = 'Medicines added successfully'
    return jsonify(response_body), 200
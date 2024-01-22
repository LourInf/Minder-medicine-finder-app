"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, Users, Medicines, Orders
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import requests
import os
import math
from sqlalchemy import select, or_
from datetime import datetime, timedelta



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

    # Send a GET request to the external API to get total items and page size:
    total_filas = 0
    tamanio_pagina = 0
    total_paginas = 0

    response = requests.get(f"{base_url}/medicamentos?*")
    if response.status_code == 200:
        data = response.json() 
        total_filas = data['totalFilas']
        tamanio_pagina = data['tamanioPagina']
        total_paginas = math.ceil(total_filas / tamanio_pagina)
        pagina = 1

        while pagina <= total_paginas:
            response = requests.get(f"{base_url}/medicamentos?pagina={pagina}")
            data = response.json()  
        
            for item in data.get('resultados', []):
                medicine_name = item.get('nombre')
                api_id = item.get('nregistro')

                # Check if the medicine already exists in the database based on either the medicine_name or the API_id:
                existing_medicine = db.session.execute(select(Medicines).where(or_(Medicines.medicine_name == medicine_name, Medicines.API_id == api_id))).scalars().first()
                # same as: existing_medicine = Medicines.query.filter((Medicines.medicine_name == medicine_name) | (Medicines.API_id == api_id)).first()
                
                if not existing_medicine:
                # Add new medicine to the database
                    new_medicine = Medicines(medicine_name=medicine_name, API_id=api_id)
                    db.session.add(new_medicine)
            
            db.session.commit()
            pagina = pagina+1
    else:
        print("Error al recuperar los datos")
    
    response_body['message'] = 'Los medicamentos se han añadido correctamente a la base de datos'
    return jsonify(response_body), 200

# Endpoint to delete all entries in the Medicines table (in case of errors refreshing/adding medicines happen)
@api.route('/refresh-medicines', methods=['DELETE'])
def delete_medicines():
    response_body = {}
    db.session.query(Medicines).delete()
    db.session.commit()
    response_body['message'] = "Todos los medicamentos han sido borrados de la base de datos."
    return jsonify(response_body), 200


# Enpoint to search medicines by name from our db
@api.route('/medicines/search', methods=['GET'])
def search_medicines():
    response_body = {}
    results = {}
    search_name = request.args.get('name', '')  # Get search query from URL parameters (get the value associated with query param "name"; if param "name" is not found or it is empty, assign an empty string)
    if search_name:
        medicines = db.session.execute(select(Medicines).where(Medicines.medicine_name.ilike(f'%{search_name}%'))).scalars().all()
    else: 
        medicines = []
    # Serialize the data and set it in the results dictionary
    medicines_list = [medicine.serialize() for medicine in medicines]
    results['medicines'] = medicines_list

    if medicines:
        response_body['message'] = 'Resultados de busqueda'
    else:
        response_body['message'] = 'No se ha encontrado ese medicamento'

    response_body['results'] = results
    return jsonify(response_body), 200


# Endpoint to create a new order
@api.route('/order', methods=['POST'])
def create_order():
    response_body = {}
    data = request.json
    # here we write the logic to save the new order registry in our DB:
    patient_id = 2  # HARDCODED FOR NOW-->CHANGE! the user needs to be authenticated and the session has a patient_id
    pharmacy_id = 1 # HARDCODED FOR NOW-->CHANGE! Retrieve the last selected pharmacy from user session or database
    medicine_id = 748 # HARDCODED FOR NOW-->CHANGE! Retrieve the last selected medicine from user session or database
    requested_date = datetime.strptime(data.get('requested_date'), '%Y-%m-%d') if data.get('requested_date') else datetime.utcnow()
    validity_date = requested_date + timedelta(hours=24)   # Set validity_date to 24 hours after requested_date
    order_status = 'pending' # Default status to 'pendiente' until pharmacy accepts and then it's changed to Aceptada/Rechazada
    new_order= Orders(
            patient_id=patient_id, # Create new instance of the Orders class and sets different attributes of the new order object to the values obtained from the JSON data 
            pharmacy_id=pharmacy_id,  
            medicine_id=medicine_id,  
            order_quantity=data.get('order_quantity', 1), # Default quantity to 1 if not provided
            requested_date=requested_date,
            validity_date=validity_date, 
            order_status=order_status)
    # Add the new instance to the session and commit to the database
    db.session.add(new_order)
    db.session.commit()
    # Serialize and return the created order
    response_body['message'] = 'Reserva creada'
    response_body ['order'] = new_order.serialize()
    return response_body, 201


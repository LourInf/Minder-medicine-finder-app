"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint, session
from api.models import db, Users, Medicines, Orders, Availability, Pharmacies, Pharmacies
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import requests
import os
import math
from sqlalchemy import select, or_, and_
from datetime import datetime, timedelta

import random 
from flask_jwt_extended import create_access_token , jwt_required , get_jwt_identity , get_jwt



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
                has_psum = item.get('psum')

                # Check if the medicine already exists in the database based on either the medicine_name or the API_id:
                existing_medicine = db.session.execute(select(Medicines).where(or_(Medicines.medicine_name == medicine_name, Medicines.API_id == api_id))).scalars().first()

                if not existing_medicine:
                # Add new medicine to the database
                    new_medicine = Medicines(medicine_name=medicine_name, API_id=api_id, has_psum=has_psum)
                    db.session.add(new_medicine)

            db.session.commit()
            pagina = pagina+1
    else:
        print("Error al recuperar los datos")

    response_body['message'] = 'Los medicamentos se han añadido correctamente a la base de datos'
    return jsonify(response_body), 200

# # Endpoint to delete all entries in the Medicines table (in case of errors refreshing/adding medicines happen)
# @api.route('/refresh-medicines', methods=['DELETE'])
# def delete_medicines():
#     response_body = {}
#     db.session.query(Medicines).delete()
#     db.session.commit()
#     response_body['message'] = "Todos los medicamentos han sido borrados de la base de datos."
#     return jsonify(response_body), 200


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

# Enpoint to get a list of medicines with active distrib problems:
@api.route('/medicines-psum', methods=['GET'])
def get_medicines_psum():
    response_body = {}
    results = {}
    medicines_psum = db.session.execute(select(Medicines).where(Medicines.has_psum == True)).scalars().all()
     # Serialize the data
    medicines_list = [{'id': medicine.id, 'medicine_name': medicine.medicine_name} for medicine in medicines_psum]
    results['medicines'] = medicines_list

    # Count the total number of medicines with psum true
    total_medicines_psum = len(medicines_psum)
    results['total_medicines_psum'] = total_medicines_psum
    if medicines_psum:
        response_body['message'] = f'Medicamentos con problemas de suministro encontrados: {total_medicines_psum}.'
    else:
        response_body['message'] = 'No se encontraron medicamentos con problemas de suministro.'
    response_body['results'] = results
    return jsonify(response_body), 200


# Endpoint to create a new order
@api.route('/orders', methods=['POST'])
def create_order():
    response_body = {}
    data = request.json
    # here we write the logic to save the new order registry in our DB:
    patient_id = 2  # HARDCODED FOR NOW-->CHANGE! the user needs to be authenticated and the session has a patient_id
    pharmacy_id = 1 # HARDCODED FOR NOW-->CHANGE! Retrieve the last selected pharmacy from user session or database
    medicine_id = 748 # HARDCODED FOR NOW-->CHANGE! Retrieve the last selected medicine from user session or database
    requested_date = datetime.strptime(data.get('requested_date'), '%Y-%m-%d') if data.get('requested_date') else datetime.utcnow()
    validity_date = requested_date + timedelta(hours=24)   # CHECK!! Set validity_date to 24 hours after requested_date
    order_status = 'pending' # Default status to 'pendiente' until pharmacy accepts and then it's changed to Aceptada/Rechazada
    new_order= Orders(
            patient_id=patient_id, # Create new instance of the Orders class and sets different attributes of the new order object to the values obtained from the JSON data
            pharmacy_id=pharmacy_id,  # CHANGE?? MAKE IT A LIST OF PHARMACIES IN CASE WE WANT TO ASK DIFFERENT PHARMACIES
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

# Endpoint to get details of a specific order
@api.route('/orders/<int:order_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_specific_order(order_id):
    if request.method == 'GET':
        response_body = {}
        results = {}
		# Fetch the first result of the query as primary key:
        order = db.session.execute(select(Orders).where(Orders.id == order_id)).scalars().first()
        if not order:
            response_body['message'] = 'Esta reserva no existe'
            return response_body, 404
		# Serialize and return the retrieved order
        results['order'] = order.serialize()
        response_body['message'] = "Reserva encontrada"
        response_body['results'] = results
        return response_body, 200

    if request.method == 'PUT':
        response_body = {}
        results = {}
        # Update order attributes with data from the request. 2 options:
        data = request.json
        order= db.session.execute(db.select(Orders).where(Orders.id == order_id)).scalar()
        if not order:
            response_body['message'] = 'Esta reserva no existe'
            return response_body, 404
        # User can only modify these 2 attributes:
        order.order_quantity = data.get('order_quantity', order.order_quantity)
        order.order_status = data.get('order_status', order.order_status)
        db.session.commit()
        results['order'] = order.serialize()
        response_body['message'] = "La reserva se ha actualizado exitosamente"
        response_body['results'] = results
        return response_body, 200

    if request.method == 'DELETE':
        response_body = {}
        # Delete the order and commit the change
        order= db.session.execute(db.select(Orders).where(Orders.id == order_id)).scalar()
        if not order:
            response_body['message'] = 'Esta reserva no existe'
            return response_body, 404
        db.session.delete(order)
        db.session.commit()
        response_body['message'] = "La reserva se ha cancelado"
        return response_body, 200

# Endpoint to get info on availability
@api.route('/availability', methods=['GET','POST'])
def handle_availability():
    if request.method == 'GET':
        response_body = {}
        results = {}
    #     availability_records = Availability.query.all()
    # if availability_records:
    #     # Serialize the records if available
    #     serialized_records = [record.serialize() for record in availability_records]
    #     results['availability'] = serialized_records
    #     response_body['message'] = 'Availability List'
    #     response_body['results'] = results
    # else:
    #     # No records found
    #     response_body['message'] = 'No availability records found.'
    # return jsonify(response_body), 200

        availability = db.session.execute(select(Availability)).scalars().all() # DOESN'T WORK (the old way, commented one, works. CHECK WHY)
        if availability:
            results ['availability'] = [row.serialize() for row in availability]
            response_body['message'] = 'Availability List'
            return response_body, 200
        else:
        # No records found
            response_body['message'] = 'No hay informacion de disponibilidad.'
            return jsonify(response_body), 200

    if request.method == 'POST':
        response_body = {}
        data = request.json
        # here we write the logic to save a new availability registry in our DB:
        # Retrieve the pharmacy_id and medicine_id from the session
        pharmacy_id = 1 # HARDCODED FOR NOW-->CHANGE!: session.get('pharmacy_id')
        medicine_id = 748 # HARDCODED FOR NOW-->CHANGE!: session.get('medicine_id')
        # Check if both pharmacy_id and medicine_id are present
        if not pharmacy_id or not medicine_id:
            return jsonify({'message': 'Se requieren el ID de la farmacia y el ID del medicamento de la sesión.'}), 400
        # Create a new Availability entry
        availability = Availability(pharmacy_id=pharmacy_id,
                medicine_id=medicine_id,
                availability_status=data.get('availability_status'),
                updated_date=datetime.utcnow())
        db.session.add(availability)
        db.session.commit()
        # Serialize and return the created resource
        response_body['message'] = 'Disponibilidad creada'
        response_body ['availability'] = availability.serialize()
        return response_body, 201

# Endpoint to get affiliated pharmacies
@api.route('/pharmacies', methods=['GET'])
def get_pharmacies():
    response_body = {}
    results = {}
    pharmacies = db.session.execute(db.select(Pharmacies)).scalars().all()
    results['pharmacies'] = [row.serialize() for row in pharmacies]
    response_body['message'] = 'Lista de farmacias afiliadas'
    response_body['results'] = results
    return response_body, 200

# Endpoint to handle details on the availability status of a specific medicine in a specific pharmacy
@api.route('/pharmacies/<int:pharmacy_id>/medicines/<int:medicine_id>/availability', methods=['GET', 'PUT'])
def handle_specific_medicine_availability_per_pharmacy(pharmacy_id, medicine_id):
    if request.method == 'GET':
        response_body = {}
        results = {}
		# Fetch the availability record for the specified pharmacy and medicine
        medicine_available = db.session.execute(db.select(Availability).where(and_(Availability.pharmacy_id == pharmacy_id,Availability.medicine_id == medicine_id))).scalars().first()
        if not medicine_available:
            response_body['message'] = 'Esta disponibilidad no existe'
            return response_body, 404
		# Serialize and return the retrieved medicine_available
        results['medicine_available'] = medicine_available.serialize()
        response_body['message'] = "Disponibilidad de esta medicina seleccionada"
        response_body['results'] = results
        return jsonify(response_body), 200

    if request.method == 'PUT':
        response_body = {}
        results = {}
        # Update availability record for the specified pharmacy and medicine attributes with data from the request
        data = request.json
        availability= db.session.execute(db.select(Availability).where(and_(Availability.pharmacy_id == pharmacy_id,Availability.medicine_id == medicine_id))).scalars().first()
        if not availability:
            response_body['message'] = 'Disponibilidad inexistente'
            return response_body, 404
        # User can only modify this 1 attribute:
        availability.availability_status = data.get('availability_status', availability.availability_status)
        db.session.commit()
        results['availability_status'] = availability.serialize()
        response_body['message'] = "La disponibilidad de este medicamento se ha actualizado exitosamente"
        response_body['results'] = results
        return response_body, 200

    # if request.method == 'DELETE': NO
    # Instead of deleting, the pharmacy should change status to obsolete for example.




# @api.route('/user')



@api.route('/login', methods=['POST'])
def login_user():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    user = Users.query.filter_by(email=email, password=password).first()
    # if user is None:
    if user is None:
        return jsonify({"message":"User not found"}), 404
    

    if user.is_pharmacy is True:
        token = create_access_token(identity = user.id , additional_claims = {"role":"pharmacy"})
    elif user.is_pharmacy is False:
        token = create_access_token(identity = user.id , additional_claims = {"role":"user"})
    else:
        return jsonify({"message":"This user is not correctly created"}), 503
    # token = create_access_token(identity = user.id , additional_claims = {"role":"admin"})
    
    # token = create_access_token(identity = user.id , additional_claims = {"role":"user"})
    return jsonify({"message":"Login Successful","token":token}) , 200




@api.route('signup', methods=['POST'])
def signup():
    data = request.get_json()
    if 'email' not in data or 'password' not in data:
        return jsonify({"error": "Where are my requirements?"})
    
    if data["is_pharmacy"] is True or data["is_pharmacy"] is False:
        new_user = Users(email=data['email'], password=data['password'], is_pharmacy=data["is_pharmacy"], is_active=True) 
    else:
        return jsonify({"message":"You need to be a pharmacy or user. Get out."}), 403
    
    # new_user = Users(email=data['email'], password=data['password'], is_pharmacy=data["is_pharmacy"], is_active=True)

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User added successfully"}), 201







# @api.route('register_pharma', methods=['POST'])
# @jwt_required
# def registerPharma():
#     data = request.get_json()
#     if 'pharmacy_name' not in data or 'SOE_pharmacy_number' not in data:
#         return jsonify({"error": "Where are my requirements?"}), 500
    
#     newPharma = Pharmacies(
#         pharmacy_name=data['pharmacy_name'],
#         SOE_pharmacy_number=data['pharmacy_name'],
#         address=data['pharmacy_name'],
#         phone=data.get('pharmacy_name', None),
#         users_id=data['pharmacy_name'],

#     )  
#     # new_user = Users(email=data['email'], password=data['password'], is_pharmacy=data["is_pharmacy"], is_active=True)

#     db.session.add(newPharma)
#     db.session.commit()

#     return jsonify({"message": "Pharmacy added successfully"}), 201


    # id = db.Column(db.Integer, primary_key=True)
    # email = db.Column(db.String(120), unique=True, nullable=False)
    # password = db.Column(db.String(80), unique=False, nullable=False)
    # is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    # is_pharmacy = db.Column(db.Boolean(), unique=False, nullable=False)
"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint, session
from api.models import db, Users, Medicines, Orders, Availability, Pharmacies, Patients, OrderStatus, AvailabilityStatus
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import requests
import os
import math
from sqlalchemy import select, or_, and_
from datetime import datetime, timedelta

from flask_jwt_extended import create_access_token


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API

# The patient will enter the city or location and must receive a list of the closest pharmacies (=> actions: getPharmacies)
@api.route('/maps', methods=['GET'])
def handle_maps():
    api_key = os.environ.get('GOOGLE_API_KEY')
    api_url_places = os.environ.get('URL_GOOGLE_PLACES')
    response_body: {}
    # types = 'pharmacy' # Este argumento es prescindible porque debajo lo volvemos a usar. 
    # location = request.args.get('location') # No lo va a dar el usuario, va a dar la ciudad. 
    # Request.args (request arguments) obtiene el valor de city que viene del Front-End injertado por el Paciente.
    city = request.args.get('city')
    # Lógica si no obtenemos "city" y??
    if not city:
        response_body = {"error": "Parámetro city' no proporcionado"}
        return jsonify(response_body), 400
    # El paciente inserta la "city" y la API de Geocode de Google la transforma en formato Latitud y Longitud.
    api_url_geocoding = os.environ.get('URL_GOOGLE_GEOCODING')  
    # Extraer la API desde ENV + el argumento address obligatorio por la API. Sustituimos address por la "city" que introduce el paciente. 
    geocoding_params = {"address": city, "key": os.environ.get('GOOGLE_API_KEY')}
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
            large_radius = 100000 # Dato fijo el radio está en metros = 100km
            api_key = os.environ.get('GOOGLE_API_KEY')
            api_url_places = os.environ.get('URL_GOOGLE_PLACES')
            # Sí tenemos la ciudad, la cual hemos cambiado a formato lat/lng entonces montamos la url para acceder la API Places. 
            url = f'{api_url_places}?location={location}&radius={large_radius}&types={types}&key={api_key}'
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

# # Activar geolocalización
# @api.route('/geolocation', methods=['POST'])
# def handle_geolocation():

# Necessary, DO NOT REMOVE!!!!!
@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    results = {}
    data = request.json
    latitud = data.get('latitude')
    longitude = data.get('longitude')
    # near_pharmacies = 
    api_url_geolocation = os.environ.get('URL_GOOGLE_GEOLOCATION')
    api_key = os.environ.get('GOOGLE_API_KEY')
    url_maps_geolocation = f'{api_url_geolocation}?&key={api_key}'


# Post Para Extraer Details de la Pharmacy desde el ID que viene del Front
@api.route('/pharmacies', methods=['POST'])
def handle_pharmacies_details():
    response_body = {}
    api_url_places_details = os.environ.get('URL_GOOGLE_PLACES_DETAILS')
    api_key = os.environ.get('GOOGLE_API_KEY')
    data = request.json
    # Este dato debe venir del Front
    pharmacy_id = data['pharmacy_id']
    # Estos campos son los seleccioandos para extraer, se pueden modificar. Consultar Documentación API. 
    pharmacy_fields = 'name,formatted_address,current_opening_hours,formatted_phone_number'
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
        return {'error': "Error en la API Google Places para obtener detalles"}

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

# # Endpoint to delete all entries in the Medicines table (in case of errors refreshing/adding medicines happen)   --> FOR DEBUGGING ONLY <--
# @api.route('/refresh-medicines', methods=['DELETE'])
# def delete_medicines():
#     response_body = {}
#     db.session.query(Medicines).delete()
#     db.session.commit()
#     response_body['message'] = "Todos los medicamentos han sido borrados de la base de datos."
#     return jsonify(response_body), 200

# # Enpoint to get all medicines from our db  --> FOR DEBUGGING ONLY <--
# @api.route('/medicines', methods=['GET'])
# def get_all_medicines():
#     response_body = {}
#     results = {}
#     medicines = db.session.execute(select(Medicines)).scalars().all()
#     # Serialize the data and set it in the results dictionary
#     medicines_list = [medicine.serialize() for medicine in medicines]
#     results['medicines'] = medicines_list
#     response_body['results'] = results
#     return jsonify(response_body), 200


# Enpoint to search medicines by name from our db (=> actions: getMedicines)
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

# Enpoint to get a list of medicines with active distrib problems: (=> actions: getMedicinesPsum)
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


# Endpoint to create a new order (=> actions: createOrderReservation)
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
    order_status = OrderStatus.PENDING # Default status to 'pendiente' until pharmacy accepts and then it's changed to Aceptada/Rechazada
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

# # Endpoint to get all affiliated pharmacies (all pharmacies we have in our DB)
# @api.route('/pharmacies', methods=['GET'])
# def get_pharmacies():
#     response_body = {}
#     results = {}
#     pharmacies = db.session.execute(db.select(Pharmacies)).scalars().all()
#     results['pharmacies'] = [row.serialize() for row in pharmacies]
#     response_body['message'] = 'Lista de farmacias afiliadas'
#     response_body['results'] = results
#     return response_body, 200


# Endpoint to get affiliated pharmacies which have avaiable stock of the selected medicine (=> actions: getAvailablePharmacies)
@api.route('/pharmacies/available', methods=['GET'])
def get_pharmacies_available_medicine():
    medicine_id = request.args.get('medicine_id', type=int)
    if not medicine_id:
        return jsonify({"error": "Falta el parametro medicine_id"}), 400
    # Query pharmacies that have the medicine available
    available_pharmacies_query = db.session.query(Pharmacies).join(Availability, Pharmacies.id == Availability.pharmacy_id).filter(Availability.medicine_id == medicine_id,Availability.availability_status == AvailabilityStatus.AVAILABLE)
    available_pharmacies = available_pharmacies_query.all()
    if available_pharmacies:
        pharmacies_data = [pharmacy.serialize() for pharmacy in available_pharmacies]
        return jsonify({"pharmacies": pharmacies_data}), 200
    else:
        return jsonify({"message": "No se han encontrado farmacias con disponibilidad de ese medicamento"}), 404


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



@api.route('/getPatientById/<int:id>', methods=['GET'])
def getPatientById(id):
    try:
        patient = Patients.query.get(id) 
        
        
        if patient:
            
            patient_info = {

                "id": patient.id,
                "name": patient.name,
                "email": patient.users.email
                
            }
            
            return jsonify(patient_info), 200
        
        else:
            return jsonify({"message": "Id patient not found"}), 404

        
    except Exception as e:
        print(str(e))
        return jsonify({"message": "Error during the search of the patient"}),500    


@api.route('/getPatient/<string:email>', methods=['GET'])
def getPatient(email):
    try:
        patient = Patients.query.join(Users).filter(Users.email == email).first() 
        
        if patient:
            return jsonify(patient.serialize()), 200
        
        else:
            return jsonify({"message": "Patient not found"}), 404

        
    except Exception as e:
        print(str(e))
        return jsonify({"message": "Error during the search of the patient"}),500    



@api.route('/login', methods=['POST'])
def login_user():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    user = Users.query.filter_by(email=email, password=password).first()
    pharmacy_id = 2
    
    # if user is None:
    if user is None:
        return jsonify({"message":"User not found"}), 404
    

    if user.is_pharmacy is True:
        token = create_access_token(identity = user.id , additional_claims = {"role": True})
    elif user.is_pharmacy is False:
        token = create_access_token(identity = user.id , additional_claims = {"role": False})
    else:
        return jsonify({"message":"This user is not correctly created"}), 503
    
    return jsonify({"message":"Login Successful", "token":token, "role":user.is_pharmacy, "user_id": user.id}) , 200




@api.route('signup', methods=['POST'])
def signup():
    data = request.get_json()
    if 'email' not in data or 'password' not in data or 'is_pharmacy' not in data:
        return jsonify({"error": "Where are my requirements?"}), 400
    
    if data["is_pharmacy"] not in [True, False]:
        return jsonify({"message":"You need to be a pharmacy or user. Get out."}), 403
    
    if data["is_pharmacy"] is False:
        new_user = Users(email=data['email'], password=data['password'], is_pharmacy=data["is_pharmacy"], is_active=True) 
        
        db.session.add(new_user)
        db.session.commit()
        
        if 'name' not in data:
            return jsonify({"message": "Where is your name?"})
        
        new_patient = Patients(name=data['name'], users=new_user)
        
        db.session.add(new_patient)
        db.session.commit()
    
    else:
    
        return jsonify({"message": "Still working on..."}, 503)
    
    
    return jsonify({"message": "User added successfully"}), 201

    


# React Router Outlet



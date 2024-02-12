"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints.
"""

from datetime import datetime
from datetime import timedelta
from datetime import timezone


from flask import Flask, request, jsonify, Blueprint, session
from api.models import db, Users, Medicines, Orders, Availability, Pharmacies, Patients, OrderStatus, AvailabilityStatus
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import requests
import os
import math
from sqlalchemy import select, or_, and_, func
from datetime import datetime, timedelta
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, get_jwt, jwt_required, JWTManager, set_access_cookies, unset_access_cookies
from sqlalchemy.orm import joinedload, aliased

app = Flask(__name__)

api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API
# print("")
# print("")
# print("")
# print("Esto es app -> ",app)
# print("")
# print("")
# print("")


app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_SECRET_KEY"] = os.environ["JWT_SECRET"]
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)


# print("")
# print("")
# print("")
# print("Esto es app access_token_expires -> ",app.config["JWT_ACCESS_TOKEN_EXPIRES"])
# print("")
# print("")
# print("")

@app.after_request
def refresh_token(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        return response

if __name__ == "__main__":
    app.run()



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

# The patient will enter the city or location and must receive a list of the closest pharmacies (=> Actions: getPharmaciesDetails)
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



@api.route('/pharmacies_names', methods=['GET'])
def handle_pharmacies_names():
        api_key = os.environ.get('GOOGLE_API_KEY')
        api_url = os.environ.get('URL_GOOGLE_PLACES_AUTOCOMPLETE')
        # https://maps.googleapis.com/maps/api/place/autocomplete/json?input=guareña&types=pharmacy&key
        # https://maps.googleapis.com/maps/api/place/autocomplete/json
        names = request.args.get('pharmacy')
        if not names:
            return jsonify('error:' 'No se ha proporcionado parámetro names'), 500
        url = f'{api_url}?input={names}&components=country:es&types=pharmacy&key={api_key}'
        print(f"Constructed URL: {url}")
        response = requests.get(url)
        if response.ok:
            data=response.json()
            return jsonify(data)
        else:
            return jsonify({"error": "Error en la búsqueda las farmacias"})
        

@api.route('/pharmacies_details', methods=['POST']) # Debe ser método POST    (=> Actions: getPharmaciesDetails)
def handle_pharmacies_details():
    response_body = {}
    api_url_places_details = os.environ.get('URL_GOOGLE_PLACES_DETAILS')
    api_key = os.environ.get('GOOGLE_API_KEY')
    data = request.json
    print("")
    print("")
    print("")
    print("Esto es data -> ",data)
    print("")
    print("")
    print("")
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
                medicine_name = item.get('nombre').capitalize()
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

# # Endpoint to delete all entries in the Medicines table (in case of errors refreshing/adding medicines happen)   --> FOR DEBUGGING <--
# @api.route('/refresh-medicines', methods=['DELETE'])
# def delete_medicines():
#     response_body = {}
#     db.session.query(Medicines).delete()
#     db.session.commit()
#     response_body['message'] = "Todos los medicamentos han sido borrados de la base de datos."
#     return jsonify(response_body), 200

# Enpoint to get all medicines from our db  (=> Actions: getMedicinesAllDb)
@api.route('/medicines', methods=['GET'])
def get_all_medicines():
    response_body = {}
    results = {}
    medicines = db.session.execute(select(Medicines)).scalars().all()
    # Serialize the data and set it in the results dictionary
    medicines_list = [medicine.serialize() for medicine in medicines]
    results['medicines'] = medicines_list
    response_body['results'] = results
    return jsonify(response_body), 200


# Enpoint to search medicines by name from our db (=> Actions: getMedicines)
@api.route('/medicines/search', methods=['GET'])
def search_medicines():
    response_body = {}
    results = {}
    search_name = request.args.get('name', '')  # Get search query from URL parameters (get the value associated with query param "name"; if param "name" is not found or it is empty, assign an empty string)
    if search_name:
        medicines = db.session.execute(select(Medicines).where(Medicines.medicine_name.ilike(f'%{search_name}%'))).scalars().all()
    else:
        medicines = []
    # Serialize the data (but capitalized before) and set it in the results dictionary
    medicines_list = [{
        'id': medicine.id,
        'medicine_name': medicine.medicine_name.capitalize(), 
        'has_psum': medicine.has_psum,
        'API_id': medicine.API_id
    } for medicine in medicines]
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



# Endpoint to get all orders for the logged-in user (=> Actions: getUserOrders)
@api.route('/orders', methods=['GET'])
@jwt_required()  
def get_user_orders():
    current_user_id = get_jwt_identity() 
    if not current_user_id:
        return jsonify({"message": "Acceso denegado. Tiene que estar logeado"}), 401
    # Find the patient associated with the current user
    patient = Patients.query.filter_by(users_id=current_user_id).first()
    if not patient:
        return jsonify({"error": "Patient not found"}), 404
    response_body = {}
    results = {}
    orders = db.session.execute(select(Orders).where(Orders.patient_id == current_user_id)).scalars().all()
    orders_query = db.session.query(Orders).options(joinedload(Orders.medicine), joinedload(Orders.pharmacy)).filter(Orders.patient_id == patient.id)
    orders = orders_query.all()
    if not orders:
        response_body['message'] = 'No tiene ninguna reserva'
        return response_body, 200
    all_user_orders = []
    for order in orders:
        order_data = order.serialize()
        # Directly access medicine and pharmacy from the order due to joinedload
        order_data['medicine_name'] = order.medicine.medicine_name if order.medicine else 'No disponible'
        order_data['pharmacy_name'] = order.pharmacy.pharmacy_name if order.pharmacy else 'No disponible'
        all_user_orders.append(order_data)
    results['orders'] = all_user_orders
    response_body['message'] = "Reservas encontradas"
    response_body['results'] = results
    return response_body, 200

# Endpoint to create a new order (=> actions: createOrderReservation)
@api.route('/orders', methods=['POST'])
@jwt_required()
def create_patient_order():
    current_user_id = get_jwt_identity()
    
     # Find the patient associated with the current user
    patient = Patients.query.filter_by(users_id=current_user_id).first()
    if not patient:
        return jsonify({"error": "Patient not found"}), 404
    
    response_body = {}
    data = request.json
    
    print("")
    print("")
    print("")
    print("Esto es data -> ",data)
    print("")
    print("")
    print("")
    
    
    # here we write the logic to save the new order registry in our DB:
    pharmacy_id = data.get('pharmacy_id')
    medicine_id = data.get('medicine_id')  
    requested_date = datetime.strptime(data.get('requested_date'), '%Y-%m-%d') if data.get('requested_date') else datetime.utcnow()
    validity_date = requested_date + timedelta(hours=24)   # CHECK!! Set validity_date to 24 hours after requested_date
    order_status = OrderStatus.PENDING # Default status to 'pendiente' until pharmacy accepts and then it's changed to Aceptada/Rechazada
    new_order= Orders(
            patient_id=patient.id, # Create new instance of the Orders class and sets different attributes of the new order object to the values obtained from the JSON data
            pharmacy_id=pharmacy_id, 
            medicine_id=medicine_id,
            order_quantity=data.get('order_quantity', 1),   #default to 1
            requested_date=requested_date,
            validity_date=validity_date,
            order_status=order_status)
    # Add the new instance to the session and commit to the database
    db.session.add(new_order)
    db.session.commit()
    # Manually query for medicine and pharmacy details
    medicine = Medicines.query.get(medicine_id)
    pharmacy = Pharmacies.query.get(pharmacy_id)
    response_body = {
        'message': 'Reserva creada',
        'order': {
            'id': new_order.id,
            'medicine_name': medicine.medicine_name if medicine else 'Not Found',  
            'pharmacy_name': pharmacy.pharmacy_name if pharmacy else 'Not Found', 
            'order_status': new_order.order_status.value, 
            'requested_date': new_order.requested_date.isoformat(),
            'validity_date': new_order.validity_date.isoformat(),
        }
    }
    return response_body, 201

# Endpoint to get details of a specific order
@api.route('/orders/<int:order_id>', methods=['GET']) # For future button "Ver detalles de la reserva" (en la tabla Orders)
def handle_specific_order(order_id):       
    if request.method == 'GET':
        response_body = {}
        results = {}
		# Fetch the first result of the query as primary key:
        # order = db.session.execute(select(Orders).where(Orders.id == order_id)).scalars().all() # NOT WORING
        order = db.session.query(Orders).filter(Orders.id == order_id).first()
        if not order:
            response_body['message'] = 'Esta reserva no existe'
            return response_body, 404
		# Serialize and return the retrieved order
        results['order'] = order.serialize()
        response_body['message'] = "Reserva encontrada"
        response_body['results'] = results
        return response_body, 200

    # if request.method == 'PUT':
    #     response_body = {}
    #     results = {}
    #     # Update order attributes with data from the request. 2 options:
    #     data = request.json
    #     order= db.session.execute(db.select(Orders).where(Orders.id == order_id)).scalar()
    #     if not order:
    #         response_body['message'] = 'Esta reserva no existe'
    #         return response_body, 404
    #     # order.order_quantity = data.get('order_quantity', order.order_quantity)   # FOR FUTURE:in case user will modify qty
    #     order.order_status = data.get('order_status', order.order_status)
    #     # Validate and update the order_status attribute
    #     if 'order_status' in data:
    #         new_status = data['order_status']
    #         order.order_status = new_status
    #         db.session.commit()
    #         results['order'] = order.serialize()
    #         response_body['message'] = "La reserva se ha actualizado exitosamente"
    #         response_body['results'] = results
    #         return response_body, 200
    #     else:
    #         return ({'message': 'No se proporcionaron datos válidos para actualizar'}), 400


@api.route('/orders/<int:order_id>/accept', methods=['PUT'])
def accept_order(order_id):
    response_body = {}
    order = db.session.query(Orders).filter(Orders.id == order_id).first()
    if not order:
        return jsonify({'message': 'Esta reserva no existe'}), 404  
    order.order_status = OrderStatus.ACCEPTED
    db.session.commit()
    response_body['message'] = "La reserva se ha aceptado"
    return response_body, 200

@api.route('/orders/<int:order_id>/cancel', methods=['PUT'])
def cancel_status_order(order_id):
    response_body = {}
    # order= db.session.execute(db.select(Orders).where(Orders.id == order_id)).scalar()   # NOT WORKING
    order = db.session.query(Orders).filter(Orders.id == order_id).first()
    if not order:
        response_body['message'] = 'Esta reserva no existe'
        return response_body, 404
    order.order_status = OrderStatus.REJECTED
    db.session.commit()
    response_body['message'] = "La reserva se ha cancelado"
    return response_body, 200


@api.route('/orders/<int:order_id>/pickup', methods=['PUT'])
def pickup_order(order_id):
    response_body = {}
    order = db.session.query(Orders).filter(Orders.id == order_id).first()
    if not order:
        return jsonify({'message': 'Esta reserva no existe'}), 404
    order.order_status = OrderStatus.COMPLETED
    db.session.commit()
    response_body['message'] = "La reserva ha sido recogida"
    return response_body, 200


@api.route("/private", methods=["GET"])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    return jsonify(logged_in_as=current_user_id), 200



# @jwt_required()
# def create_patient_order():
#     current_user_id = get_jwt_identity()
    
#      # Find the patient associated with the current user
#     patient = Patients.query.filter_by(users_id=current_user_id).first()
#     if not patient:
#         return jsonify({"error": "Patient not found"}), 404
    

# Endpoint to get all orders placed to a specific pharmacy, identified by the logged-in user (=> Actions: getPharmacyOrders)
@api.route('/orders/pharmacy', methods=['GET'])
@jwt_required()
def get_pharmacy_orders():
    response_body = {}
    current_user_id = get_jwt_identity()
    if not current_user_id:
        return jsonify({"message": "Acceso denegado. Tiene que estar logeado"}), 401
    # Get all orders that are placed to this pharmacy
    current_user_pharmacy_id =  db.session.execute(select(Pharmacies).where(Pharmacies.users_id == current_user_id)).scalars().first().id
    orders = db.session.query(Orders).join(Pharmacies, Orders.pharmacy_id == Pharmacies.id).filter(Pharmacies.id == current_user_pharmacy_id).all()
    if not orders:
        response_body['message'] = 'No tiene pedidos'
        return response_body
    # serialize
    orders_data = [order.serialize() for order in orders]
    for order_data in orders_data:
        order = Orders.query.get(order_data['id'])
        order_data['patient'] = order.patient.serialize() if order.patient else None
        order_data['pharmacy'] = order.pharmacy.serialize() if order.pharmacy else None
        order_data['medicine'] = order.medicine.serialize() if order.medicine else None
    return jsonify(orders_data), 200
    

# Endpoint to get info on availability (all medicines, all pharmacies)
@api.route('/availability', methods=['GET','POST'])
def handle_availability():
    if request.method == 'GET':
        response_body = {}
        results = {}
        availability_records = Availability.query.all()
    if availability_records:
        # Serialize the records if available
        serialized_records = [record.serialize() for record in availability_records]
        results['availability'] = serialized_records
        response_body['message'] = 'Availability List'
        response_body['results'] = results
    else:
        # No records found
        response_body['message'] = 'No availability records found.'
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

# Endpoint to get all affiliated pharmacies (all pharmacies we have in our DB)
@api.route('/pharmacies', methods=['GET'])
def get_pharmacies():
    response_body = {}
    results = {}
    pharmacies = db.session.execute(db.select(Pharmacies)).scalars().all()
    results['pharmacies'] = [row.serialize() for row in pharmacies]
    response_body['message'] = 'Lista de farmacias afiliadas'
    response_body['results'] = results
    return response_body, 200


# Endpoint to get affiliated pharmacies which have available stock of the selected medicine in selected city (=> actions: getAvailablePharmacies)
@api.route('/pharmacies/available', methods=['GET'])
def get_pharmacies_available_medicine_city():
    medicine_id = request.args.get('medicine_id', type=int)
    if not medicine_id:
        return jsonify({"error": "Falta el parametro medicine_id"}), 400
    address = request.args.get('address', type=str).lower().strip()
    # Query pharmacies that have the medicine available at selected city
    available_pharmacies_query = db.session.query(Pharmacies).join(Availability, Pharmacies.id == Availability.pharmacy_id).filter(Availability.medicine_id == medicine_id,Availability.availability_status == AvailabilityStatus.AVAILABLE, func.lower(func.trim(Pharmacies.address))==address)
    available_pharmacies = available_pharmacies_query.all()
    if available_pharmacies:
        pharmacies_data = [pharmacy.serialize() for pharmacy in available_pharmacies]
        return jsonify({"pharmacies": pharmacies_data}), 200
    else:
        return jsonify({"message": "No se han encontrado farmacias con disponibilidad de ese medicamento en esta ciudad"}), 404


# # Endpoint to handle details on the availability status of a specific medicine in a specific pharmacy    (=> Actions: updateMedicineAvailability)
# @api.route('/pharmacies/<int:pharmacy_id>/medicines/<int:medicine_id>', methods=['GET', 'PUT'])
# def handle_specific_medicine_availability_per_pharmacy(pharmacy_id, medicine_id):
#     if request.method == 'GET':
#         response_body = {}
#         results = {}
# 		# Fetch the availability record for the specified pharmacy and medicine
#         medicine_available = db.session.execute(db.select(Availability).where(and_(Availability.pharmacy_id == pharmacy_id,Availability.medicine_id == medicine_id))).scalars().first()
#         if not medicine_available:
#             response_body['message'] = 'Esta disponibilidad no existe'
#             return response_body, 404
# 		# Serialize and return the retrieved medicine_available
#         results['medicine_available'] = medicine_available.serialize()
#         response_body['message'] = "Disponibilidad de esta medicina seleccionada"
#         response_body['results'] = results
#         return jsonify(response_body), 200

# Endpoint get availability records for a specific pharmacy    (=> Actions: getMedicineAvailabilityForPharmacy)
@api.route('/pharmacy/availability', methods=['GET'])
@jwt_required()
def get_pharmacy_specific_availability():
    current_user_id = get_jwt_identity()
    if not current_user_id:
        return jsonify({"message": "Acceso denegado. Tiene que estar logeado como farmacia"}), 401
    # Get the pharmacy id:
    current_user_pharmacy_id =  db.session.execute(select(Pharmacies).where(Pharmacies.users_id == current_user_id)).scalars().first().id  
    if not current_user_pharmacy_id:
        return jsonify({"message": "Farmacia no encontrada."}), 404
    # Get availability records specifically for this pharmacy
    availability_records = db.session.query(Availability).filter(Availability.pharmacy_id == current_user_pharmacy_id).all()
    if availability_records:
        # Serialize
        serialized_records = [record.serialize() for record in availability_records]
        return jsonify({
            "message": "Lista de medicamentos y su disponibilidad para esa farmacia",
            "availability": serialized_records
        }), 200
    else:
        # No records found for this pharmacy
        return jsonify({"message": "No hay informacion sobre la disponibilidad para esta farmacia."
        }), 200
    
# Enpoint to get all medicines from our db for a Pharmacy  (=> Actions: getMedicinesAllDbForPharmacy) 
@api.route('/medicines/<int:pharmacy_id>', methods=['GET'])
@jwt_required()
def get_all_medicines_for_pharmacy(pharmacy_id):
    user_id = get_jwt_identity()

    # Perform an outer join, including medicines regardless of availability record,
    # but filter the availability by pharmacy_id when available.
    results = db.session.query(Medicines, Availability)\
        .outerjoin(Availability, and_(Medicines.id == Availability.medicine_id, Availability.pharmacy_id == pharmacy_id))\
        .all()

    if not results:
        return jsonify({"message": "No medicines found for the specified pharmacy."}), 404

    medicines_list = []
    for medicine, availability in results:
        medicine_data = medicine.serialize() if hasattr(medicine, 'serialize') else {}
        
        # Serialize the Availability data if it exists, otherwise use an empty dictionary
        availability_data = availability.serialize() if availability and hasattr(availability, 'serialize') else {}
        # Combine medicine data with availability data, if available
        combined_data = {**medicine_data, **availability_data}
        medicines_list.append(combined_data)

    return jsonify({"results": {"medicines": medicines_list}}), 200
 

@api.route('/pharmacy/availability', methods=['PUT'])           # IN PROGRESS - TO BE DEFINED
@jwt_required()
def update_pharmacy_specific_availability():
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
    
@api.route('/getUserById/<int:id>', methods=['GET'])
def getUserById(id):
    try:
        user = Users.query.get(id) 
        
        
        if user:
            
            user_info = {

                "id": user.id,
                "email": user.email,
                "is_pharmacy": user.is_pharmacy
                
            }
            
            return jsonify(user_info), 200
        
        else:
            return jsonify({"message": "Id user not found"}), 404

        
    except Exception as e:
        print(str(e))
        return jsonify({"message": "Error during the search of the user"}),500    

    
       
@api.route('/getPharmacyById/<int:user_id>', methods=['GET'])
def getPharmacyById(user_id):
    try:
        # patient = Patients.query.get(id) 
        pharmacy = Pharmacies.query.filter_by(users_id=user_id).first()
        
        
        if pharmacy:
            
            pharmacy_info = {

                "pharmacy_id": pharmacy.id,
                "pharmacy_user_id": pharmacy.users.id,
                "pharmacy_name": pharmacy.pharmacy_name,
                "pharmacy_SOE": pharmacy.SOE_pharmacy_number,
                "pharmacy_address": pharmacy.address,
                "pharmacy_phone": pharmacy.phone,
                "pharmacy_24H": pharmacy.is_24h,
                "pharmacy_working_hours": pharmacy.is_24h,
                "pharmacy_orders": pharmacy.orders
                
            }

            return jsonify(pharmacy_info), 200
        
        else:
            return jsonify({"message": "Id pharmacy not found"}), 404

        
    except Exception as e:
        print(str(e))
        return jsonify({"message": "Error during the search of the pharmacy"}),500    



    
    
    
@api.route('/getPatientById/<int:user_id>', methods=['GET'])
def getPatientById(user_id):
    try:
        # patient = Patients.query.get(id) 
        patient = Patients.query.filter_by(users_id=user_id).first()
        
        
        if patient:
            
            patient_info = {

                "patient_id": patient.id,
                "user_id": patient.users.id,
                "name": patient.name,
                "email": patient.users.email
                
            }
            
            return jsonify(patient_info), 200
        
        else:
            return jsonify({"message": "Id patient not found"}), 404

        
    except Exception as e:
        print(str(e))
        return jsonify({"message": "Error during the search of the patient"}),500    


@api.route('/getUser/<string:email>', methods=['GET'])
def getUser(email):
    try:
        # patient = Patients.query.join(Users).filter(Users.email == email).first() 
        user = Users.query.filter_by(email=email).first()
        
        if user:
            return jsonify(user.serialize()), 200
        
        else:
            return jsonify({"message": "User not found"}), 404

        
    except Exception as e:
        print(str(e))
        return jsonify({"message": "Error during the search of the User"}),500    



@api.route('/login', methods=['POST'])
def login_user():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    user = Users.query.filter_by(email=email, password=password).first()
    
    # if user is None:
    if user is None:
        return jsonify({"message":"User not found"}), 404
    

    if user.is_pharmacy == True:
        token = create_access_token(identity = user.id , additional_claims = {"role": True})
    elif user.is_pharmacy == False:
        token = create_access_token(identity = user.id , additional_claims = {"role": False})
    else:
        return jsonify({"message":"This user is not correctly created"}), 503
    
    response = jsonify({"message":"Login Successful", "token":token, "is_pharmacy":user.is_pharmacy, "user_id": user.id, "email":email})
    
    set_access_cookies(response, token)
    return response, 200


@api.route('signup', methods=['POST'])
def signup():
    data = request.get_json()
    if 'email' not in data or 'password' not in data or 'is_pharmacy' not in data:
        return jsonify({"error": "Where are my requirements?"}), 400
    
    if data["is_pharmacy"] not in [True, False]:
        return jsonify({"message":"You need to be a pharmacy or user. Get out."}), 403
    
    try:
        if data["is_pharmacy"] is False:
            new_user = Users(email=data['email'], password=data['password'], is_pharmacy=data["is_pharmacy"], is_active=True) 
            
            db.session.add(new_user)
            db.session.commit()
            
            if 'name' not in data:
                return jsonify({"message": "Where is your name?"})
            
            new_patient = Patients(name=data['name'], users=new_user)
            
            db.session.add(new_patient)
            db.session.commit()
            
            return jsonify({"message": "User added successfully"}), 201

        
        else:
            new_user = Users(email=data['email'], password=data['password'], is_pharmacy=data["is_pharmacy"], is_active=True) 

            db.session.add(new_user)
            db.session.commit()
            
            # if 'id' not in data or 'pharmacy_name' not in data or 'soe_number' not in data or 'address' not in data or 'is24' not in data or 'phone' not in data or 'working_hours' not in data:
            if 'pharmacy_name' not in data or 'soe_number' not in data or 'address' not in data or 'is24' not in data or 'phone' not in data or 'working_hours' not in data:
                return jsonify({"message": "missing requeriments, get away from this place"}), 500
            
            
            new_pharmacy = Pharmacies(
                users=new_user,
                # id=data['id'],
                pharmacy_name=data['pharmacy_name'],
                SOE_pharmacy_number=data['soe_number'],
                address=data['address'],
                is_24h=data['is24'],
                phone=data['phone'],
                working_hours=data['working_hours']
            )        
            
            db.session.add(new_pharmacy)
            db.session.commit()
            
            return jsonify({"message": "Pharmacy added successfully"}, 201)
    except Exception as e:
        return jsonify({'error ':str(e)}),500
    


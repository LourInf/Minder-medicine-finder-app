"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, Users, Pharmacies
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import random 
from flask_jwt_extended import create_access_token , jwt_required , get_jwt_identity , get_jwt



api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body ['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200



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
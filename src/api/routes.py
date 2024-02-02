"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, Users, Patients
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API

# Necessary, DO NOT REMOVE!!!!!
@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body ['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200



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



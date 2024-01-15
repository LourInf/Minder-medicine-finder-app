from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    # return '<User %r>' % self.email ????

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {'id': self.id,
                'email': self.email,
                'is_active': self.is_active}

class Patients(db.Model):
    __tablename__ = "patients"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    users_id = db.Column(db.Integer, db.ForeingKey('users.id'), unique=True)
    users = relationship(Users)

    def __repr__(self):
        return f'<Patient {self.username}>'

    def serialize(self):
        return {'id': self.id,
                'username': self.username}

class Pharmacies(db.Model):
    __tablename__ = "pharmacies"
    id = db.Column(db.Integer, primary_key=True)
    pharmacy_name = db.Column(db.String(50), nullable=False)
    SOE_pharmacy_number = db.Column(db.Integer, unique=False)
    address = db.Column(db.String(), nullable=False)
    phone = db.Column(db.Integer, nullable=False)
    opening_hours = db.Column(db.DateTime)
    closing_hours = db.Column(db.DateTime)
    users_id = db.Column(db.Integer, db.ForeingKey('users.id'), unique=True)
    users = relationship(Users)

    def __repr__(self):
        return f'<Pharmacy {self.pharmacy_name}>'

    def serialize(self):
        return {'id': self.id,
                'pharmacy_name': self.pharmacy_name,
                'address': self.address,
                'phone': self.phone,
                'opening_hours': self.opening_hours,
                'closing_hours': self.closing_hours
                }

class Medicines(db.Model):
    __tablename__ = "medicines"
    id = db.Column(db.Integer, primary_key=True)
    medicine_name = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<Medicine {self.medicine_name}>'

    def serialize(self):
        return {'id': self.id,
                'medicine_name': self.medicine_name}


class Orders(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.Integer, primary_key=True)
    order_quantity = db.Column(db.Integer)
    requested_date = db.Column(db.DateTime, default=datetime.utcnow)
    validity_date = db.Column(db.DateTime) # Máximo 24/48h
    order_status = db.Column(db.String(50))
    patient_id = db.Column(db.Integer, db.ForeingKey('patients.id')) # Preguntar many to one*
    patients = relationship(Patients)
    pharmacy_id = db.Column(db.Integer, db.ForeingKey('pharmacies.id')) 
    pharmacy = relationship(Patients)
    medicine_id = db.Column(db.Integer, db.ForeingKey('medicine.id')) 
    medicine = relationship(Patients)

    def __repr__(self):
        return f'<Orders {self.order_status}>'

    def serialize(self):
        return {'id': self.id,
                'order_status': self.order_status,
                'order_quantity': self.order_quantity,
                'requested_date': self.requested_date,
                'validity_date': self.validity_date
                }

class Availability(db.Model):
    __tablename__ = "availability"
    id = db.Column(db.Integer, primary_key=True)
    avilability_status = db.Column(db.String(50))
    updated_date = db.Column(db.DateTime, default=datetime.utcnow)
    pharmacy_id = db.Column(db.Integer, db.ForeingKey('pharmacies.id'))  # Preguntar 
    pharmacy = relationship(Patients)
    medicine_id = db.Column(db.Integer, db.ForeingKey('medicine.id')) 
    medicine = relationship(Patients)

    def __repr__(self):
        return f'<Availability {self.availability_status}>'

    def serialize(self):
        return {'id': self.id,
                'avilability_status': self.avilability_status,
                'updated_date': self.updated_date}











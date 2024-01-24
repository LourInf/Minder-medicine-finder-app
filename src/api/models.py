from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum


db = SQLAlchemy()


class Users(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    is_pharmacy = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {'id': self.id,
                'email': self.email,
                'is_active': self.is_active}
            
# Many to Many
Association_table = db.Table("Association_table", db.metadata,
    #Columna ("nombre", ForeignKey(a donde se conecta), primary_key=True) --> SIEMPRE A LA PRIMARY KEY, ASI QUE AL ID
    db.Column("user_id", db.ForeignKey("users.id"), primary_key=True),
    db.Column("patient_id", db.ForeignKey("patients.id"), primary_key=True),
    db.Column("pharmacy_id", db.ForeignKey("pharmacies.id"), primary_key=True),
    db.Column("medicine_id", db.ForeignKey("medicines.id"), primary_key=True),
    db.Column("order_id", db.ForeignKey("orders.id"), primary_key=True)
)

class Patients(db.Model):
    __tablename__ = "patients"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    # One to One
    users_id = db.Column(db.Integer, db.ForeignKey('users.id')) 
    users = db.relationship(Users)
    orders = db.relationship('Orders', secondary=Association_table, back_populates='patient',
                             primaryjoin="Patients.id == Association_table.c.patient_id",
                             secondaryjoin="Orders.id == Association_table.c.order_id")


    def __repr__(self):
        return f'<Patient {self.name}>'

    def serialize(self):
        return {'id': self.id,
                'name': self.name}

class Pharmacies(db.Model):
    __tablename__ = "pharmacies"
    id = db.Column(db.Integer, primary_key=True)
    pharmacy_name = db.Column(db.String(200), nullable=False)
    SOE_pharmacy_number = db.Column(db.String(20), unique=True, nullable=False)
    address = db.Column(db.String(150), nullable=False)          # REMOVE
    # street_address = db.Column(db.String(200), nullable=False) # NEW - Are these enough/needed for geoloc?? 
    # city = db.Column(db.String(100), nullable=False)           # NEW
    # postal_code = db.Column(db.String(20), nullable=False)     # NEW
    # latitude = db.Column(db.Float)                             # NEW
    # longitude = db.Column(db.Float)                            # NEW
    # is_24h = db.Column(db.Boolean(), unique=False)             # NEW - Pharmacy can mark if it's a 24h pharmacy
    phone = db.Column(db.String, nullable=False)
    working_hours = db.Column(db.String())
    users_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    users = db.relationship(Users)
    orders = db.relationship('Orders', secondary=Association_table, back_populates='pharmacy')


    def __repr__(self):
        return f'<Pharmacy {self.pharmacy_name}>'

    def serialize(self):
        return {'id': self.id,
                'pharmacy_name': self.pharmacy_name,
                'address': self.address,
                'phone': self.phone,
                'working_hours': self.working_hours
                }

class Medicines(db.Model):
    __tablename__ = "medicines"
    id = db.Column(db.Integer, primary_key=True)
    medicine_name = db.Column(db.String(250), nullable=False)
    API_id = db.Column(db.String)
    # has_psum = db.Column(db.Boolean(), nullable=False)        # NEW (problemas de desabastecimiento) - nullable=False??
    orders = db.relationship('Orders', secondary=Association_table, back_populates='medicine')

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
    order_status = db.Column(db.String(50))                                     # REMOVE
    # order_status = db.Column(SQLAlchemyEnum(OrderStatus))                     # NEW - CHANGE TO ENUM?
    # One To Many
    # patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))
    # patient = db.relationship(Patients, backref='orders') 
    # pharmacy_id = db.Column(db.Integer, db.ForeignKey('pharmacies.id')) 
    # pharmacy = db.relationship(Pharmacies, backref='orders')
    # Many to Many 
    # medicine_id = db.Column(db.Integer, db.ForeignKey('medicines.id')) 
    # medicine = db.relationship(Medicines, backref='orders')
    # patient_rel = db.relationship('Patients', secondary=Association_table, backref='Orders')
    # medicine_rel = db.relationship('Medicines', secondary=Association_table, backref='Orders')
    # parhamacy_rel = db.relationship('Pharmacies', secondary=Association_table, backref='Orders')

    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))
    patient = db.relationship(Patients, back_populates='orders', primaryjoin="Patients.id == Orders.patient_id")
    pharmacy_id = db.Column(db.Integer, db.ForeignKey('pharmacies.id')) 
    pharmacy = db.relationship(Pharmacies, back_populates='orders')
    medicine_id = db.Column(db.Integer, db.ForeignKey('medicines.id')) 
    medicine = db.relationship(Medicines, back_populates='orders')
    patient_rel = db.relationship('Patients', secondary=Association_table, back_populates='orders',
                                  primaryjoin="Orders.id == Association_table.c.order_id",
                                  secondaryjoin="Patients.id == Association_table.c.patient_id")
    medicine_rel = db.relationship('Medicines', secondary=Association_table, back_populates='orders',
                                   primaryjoin="Orders.id == Association_table.c.order_id",
                                   secondaryjoin="Medicines.id == Association_table.c.medicine_id")
    pharmacy_rel = db.relationship('Pharmacies', secondary=Association_table, back_populates='orders',
                                   primaryjoin="Orders.id == Association_table.c.order_id",
                                   secondaryjoin="Pharmacies.id == Association_table.c.pharmacy_id")


    def __repr__(self):
        return f'<Orders {self.order_status}>'

    def serialize(self):
        return {'id': self.id,
                'order_status': self.order_status,
                'order_quantity': self.order_quantity,
                'requested_date': self.requested_date,
                'validity_date': self.validity_date}

# class OrderStatus(Enum):                                                       # NEW
#     PENDING = "Pendiente"                                                      # NEW
#     ACCEPTED = "Aceptada"                                                      # NEW
#     REJECTED = "Rechazada"                                                     # NEW
#     COMPLETED = "Completada"                                                   # NEW


class Availability(db.Model):
    __tablename__ = "availability"
    id = db.Column(db.Integer, primary_key=True)
    availability_status = db.Column(db.String(50), nullable=False)                        # REMOVE              
    # availability_status = db.Column(SQLAlchemyEnum(AvailabilityStatus), nullable=False) # NEW- CHANGE TO ENUM
    updated_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    pharmacy_id = db.Column(db.Integer, db.ForeignKey('pharmacies.id')) 
    pharmacy = db.relationship(Pharmacies, backref='availability')
    
    medicine_id = db.Column(db.Integer, db.ForeignKey('medicines.id')) 
    medicine = db.relationship(Medicines, backref='availability')

    def __repr__(self):
        return f'<Availability {self.availability_status}>'

    def serialize(self):
        return {'id': self.id,
                'availability_status': self.availability_status,
                'updated_date': self.updated_date}

# class AvailabilityStatus(Enum):                                          # NEW
#     AVAILABLE = "Disponible"                                             # NEW
#     NNOT_AVAILABLE = "No disponible"                                     # NEW
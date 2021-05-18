from flask import Flask
from flask_jwt_extended import JWTManager
from flask_pymongo import PyMongo
from flask_mongoengine import MongoEngine
# from flask_restful import Api, Resource
# import json

app = Flask(__name__)

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this "super secret" with something else!
#app.config["MONGO_URI"] = "mongodb://user:password@localhost:27017/spending_manager"
app.config['MONGODB_SETTINGS'] = {
    'db': 'spending_manager',
    'host': 'mongo',
    #'host': 'mongodb://user:password@mongo:27017/spending_manager'
    'port': 27017,
    'username': 'user',
    'password': 'password',
    'connect': True,
    'authentication_source': 'admin'
}

#mongodb_client = PyMongo(app)
#db = mongodb_client.db
jwt = JWTManager(app)

import spending_manager.views
import spending_manager.models

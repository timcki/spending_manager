from flask import Flask
from flask_jwt_extended import JWTManager
from flask_pymongo import PyMongo
# from flask_restful import Api, Resource
# import json

app = Flask(__name__)

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this "super secret" with something else!
app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"
mongo = PyMongo(app)
jwt = JWTManager(app)

import spending_manager.views

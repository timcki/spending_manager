from flask import Flask
from flask_jwt_extended import JWTManager
from flask_mongoengine import MongoEngine
from flask_cors import CORS
# from flask_restful import Api, Resource
# import json
import datetime
import os
app = Flask(__name__)

# Setup the Flask-JWT-Extended extension
mongo_host = 'mongo'
mongo_db = 'spending_manager'
if os.environ.get('UNITTEST') == 'TRUE':
    mongo_host = 'localhost'
    mongo_db = 'spending_manager_test'
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this "super secret" with something else!
app.config['MONGODB_SETTINGS'] = {
    'db': mongo_db,
    'host': mongo_host,
    'port': 27017,
    'username': 'user',
    'password': 'password',
    'connect': True,
    'authentication_source': 'admin'
}

app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_SECRET_KEY"] = "super-secret"
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=1)
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['PROPAGATE_EXCEPTIONS'] = True

jwt = JWTManager(app)
db = MongoEngine(app)
cors = CORS(app, supports_credentials=True)

blocklisted = {}
# jwt._set_error_handler_callbacks(app)

import spending_manager.views
import spending_manager.models

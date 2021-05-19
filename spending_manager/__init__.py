from flask import Flask
from flask_jwt_extended import JWTManager
from flask_mongoengine import MongoEngine
# from flask_restful import Api, Resource
# import json
import datetime
app = Flask(__name__)

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this "super secret" with something else!
app.config['MONGODB_SETTINGS'] = {
    'db': 'spending_manager',
    'host': 'mongo',
    'port': 27017,
    'username': 'user',
    'password': 'password',
    'connect': True,
    'authentication_source': 'admin'
}

app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_SECRET_KEY"] = "super-secret"
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=1)
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['PROPAGATE_EXCEPTIONS'] = True

jwt = JWTManager(app)
db = MongoEngine(app)
blocklisted = {}
# jwt._set_error_handler_callbacks(app)

import spending_manager.views
import spending_manager.models

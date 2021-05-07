from spending_manager import app
from flask import render_template, jsonify, request
from flask_jwt_extended import create_access_token
import json
import spending_manager.database as smDB

db = smDB.SpendingManagerDB()



@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Headers', 'Cache-Control')
    response.headers.add('Access-Control-Allow-Headers', 'X-Requested-With')
    response.headers.add('Access-Control-Allow-Headers', 'Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    return response

@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/login')
def account_login():
    return render_template('account_login.html')


@app.route('/register')
def account_register():
    return render_template('account_register.html')


@app.route('/api/v1/login', methods=['POST', 'OPTIONS'])
def api_login():
    if request.is_json:
        u = request.json.get("username", None)
        p = request.json.get("password", None)

        if db.get_user_login_data(u, p):
            access_token = create_access_token(identity=u)
            return jsonify({"token": access_token, "success": True})
        else:
            return jsonify({"success": False, "mssg": "Błędne dane logowania!"})

    return jsonify({"success": False})


@app.route('/api/v1/registration', methods=['POST', 'OPTIONS'])
def api_registration():
    if request.is_json:
        u = request.json.get("username", None)
        p = request.json.get("password", None)
        if db.get_user(u) is not None:
            return jsonify({"success": False, "mssg": "Użytkownik o podanym loginie już istnieje!"})
        else:
            db.insert_user(u, p)
            return jsonify({"success": True, "mssg": "Pomyślnie dodano nowego użytkownika!"})


@app.route('/api/v1/transactions/create', methods=['POST'])
def api_transactions_create():
    # TODO
    return jsonify({"success": True})


@app.route('/api/v1/transactions/get', methods=['GET'])
def api_transactions_get():
    # TODO
    return jsonify({"success": True})


@app.route('/api/v1/transactions/update', methods=['POST'])  # moze lepsze bedzie tutaj PUT?
def api_transactions_update():
    # TODO
    return jsonify({"success": True})


@app.route('/api/v1/categories/get', methods=['GET'])
def api_categories_get():
    # TODO
    return jsonify({"success": True})


@app.route('/api/v1/categories/create', methods=['POST'])
def api_categories_create():
    # TODO
    return jsonify({"success": True})

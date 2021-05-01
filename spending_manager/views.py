from spending_manager import app
from flask import render_template, jsonify, request
from flask_jwt_extended import create_access_token
import json


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/login')
def account_login():
    return render_template('account_login.html')


@app.route('/register')
def account_register():
    return render_template('account_register.html')


@app.route('/api/v1/login', methods=['POST'])
def api_login():
    result = json.loads(str(request.get_data()).split("\'")[1])
    # print(result)
    # username = request.json.get("username", None)
    # password = request.json.get("password", None)
    username = result['username']
    password = result['password']
    # print(username)
    # print(password)

    access_token = create_access_token(identity="deadbeef")
    return jsonify({"token": access_token})


@app.route('/api/v1/registration', methods=['POST'])
def api_registration():
    result = json.loads(str(request.get_data()).split("\'")[1])
    print(result)

    username = result['username']
    password = result['password']

    # TODO wrzucic zapytanie do bazy, czy taki uzytkownik juz istnieje
    # TODO jezeli jest ok, to wrzucic do bazy

    ok = True

    return jsonify({"success": ok})


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
def api_categories_get():
    # TODO
    return jsonify({"success": True})

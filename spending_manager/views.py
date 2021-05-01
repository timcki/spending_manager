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
    print(request.data)
    result = json.loads(str(request.get_data()).split("\'")[1])
    print(result)
    # username = request.json.get("username", None)
    # password = request.json.get("password", None)
    username = result['username']
    password = result['password']
    print(username)
    print(password)

    access_token = create_access_token(identity="deadbeef")
    return jsonify({"token": access_token})
from spending_manager import app
from flask import render_template, jsonify, request
from flask_jwt_extended import create_access_token

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
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    access_token = create_access_token(identity="deadbeef")
    return jsonify({"token": access_token})
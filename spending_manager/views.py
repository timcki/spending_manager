from spending_manager import app
from flask import render_template, jsonify, request
from flask_jwt_extended import create_access_token
import json
#import spending_manager.database as smDB
from spending_manager.models import User, Transaction
from datetime import date

#db = smDB.SpendingManagerDB()


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


@app.route('/db_test')
def database_route_test():
    return render_template('database_Test.html')


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
        user = User.objects(username=u).first()
        if user is not None:
            return jsonify({"success": False, "msg": "Użytkownik o podanym loginie już istnieje!"})
        else:
            # TODO: Add hashing
            User(username=u, password=p).save()
            return jsonify({"success": True, "msg": "Pomyślnie dodano nowego użytkownika!"})

    return jsonify({"success": False, "msg": "Użytkownik o podanym loginie już istnieje!"})



@app.route('/api/v1/transactions/create', methods=['POST'])
def api_transactions_create():
    if request.is_json:
        Transaction(account_id=request.json.get("account_id", None),
                    amount=request.json.get("amount", None),
                    category_id = request.json.get("category_id", None),
                    transaction_type = request.json.get("transaction_type", None),
                    other_account_id = request.json.get("other_account_id", None),
                    transaction_status = request.json.get("transaction_status", None),
                    person = request.json.get("person", None),
                    recipient = request.json.get("recipient", None),
                    transaction_date = str(date.today()),
                    cyclic_period = request.json.get("cyclic_period", None)
                    ).save()
        return jsonify({"success": True, "mssg": "Pomyślnie dodano wpis transakcji!"})
    return jsonify({"success": False, "mssg": "Niepowodzenie przy probie dodania wpisu transakcji!"})


@app.route('/api/v1/transactions/get', methods=['POST','GET'])
def api_transactions_get():
    if request.is_json:
        account_id = request.json.get("account_id", None)
        tx = Transaction.objects(account_id=account_id).first()
        if tx is not None:
            #print(tx.to_json())
            return jsonify(tx.to_json())
        else:
            return jsonify({})

    return jsonify({"success": False})


@app.route('/api/v1/transactions/update', methods=['POST'])  # moze lepsze bedzie tutaj PUT?
def api_transactions_update():
    if request.is_json:
        transaction_id = request.json.get("transaction_id", None)
        attribute = request.json.get("attribute", None)
        value = request.json.get("value", None)

        tx = Transaction.objects(transaction_id=transaction_id).first()
        tx.update(attribute=attribute, value=value)

    return jsonify({"success": True})


@app.route('/api/v1/transactions/delete', methods=['POST'])
def api_transactions_delete():
    if request.is_json:
        transaction_id = request.json.get("transaction_id", None)
        tx = Transaction.objects(transaction_id=transaction_id).first()
        tx.delete()
    return jsonify({"success": True})


@app.route('/api/v1/categories/get', methods=['GET'])
def api_categories_get():
    # TODO
    return jsonify({"success": True})


@app.route('/api/v1/categories/create', methods=['POST'])
def api_categories_create():
    # TODO
    return jsonify({"success": True})

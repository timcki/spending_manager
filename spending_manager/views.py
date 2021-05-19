from spending_manager import app, jwt
from spending_manager.models import User, Transaction, Account

from flask import render_template, jsonify, request, redirect
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, set_access_cookies, get_jwt
from datetime import datetime, timedelta, timezone, date

import json
import hashlib

def hash_password(password):
    s = hashlib.sha3_224()
    s.update(password.encode())
    return s.hexdigest()


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        return response


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


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return db.get_blocklisted(jti)


@jwt.expired_token_loader
@jwt.revoked_token_loader
def my_expired_token_callback(jwt_header, jwt_payload):
    return redirect('/login')


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

@app.route("/logout")
@jwt_required(optional=True)
def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.insert_blocklisted(jti, now)
    return redirect('/login')


@app.route('/new_acc')
#@jwt_required()
def account_new_acc():
    return render_template('account_new_acc.html')

@app.route('/api/v1/login', methods=['POST', 'OPTIONS'])
def api_login():
    if request.is_json:
        u = request.json.get("username", None)
        p = request.json.get("password", None)

        user = User.objects(username=u).first()

        hashed_password = hash_password(p)
        if user.password == hashed_password:
            access_token = create_access_token(identity=u)
            response = jsonify({"token": access_token, "success": True})
            set_access_cookies(response, access_token)
            return response, 200
        else:
            return jsonify({"success": False, "msg": "Błędne dane logowania!"})

    return jsonify({"success": False})


@app.route('/api/v1/registration', methods=['POST', 'OPTIONS'])
@jwt_required()
def api_registration():
    if request.is_json:
        u = request.json.get("username", None)
        p = request.json.get("password", None)
        user = User.objects(username=u).first()
        if user is not None:
            return jsonify({"success": False, "msg": "Użytkownik o podanym loginie już istnieje!"})
        else:
            hashed_password = hash_password(p)
            User(username=u, password=hashed_password).save()
            return jsonify({"success": True, "msg": "Pomyślnie dodano nowego użytkownika!"})

    return jsonify({"success": False, "msg": "Użytkownik o podanym loginie już istnieje!"})



@app.route('/api/v1/transactions/create', methods=['POST'])
@jwt_required()
def api_transactions_create():
    if request.is_json:
        account_id = request.json.get('account_id', None)
        amount = request.json.get("amount", None)
        Transaction(account_id=account_id,
                    amount=amount,
                    category_id = request.json.get("category_id", None),
                    transaction_type = request.json.get("transaction_type", None),
                    other_account_id = request.json.get("other_account_id", None),
                    transaction_status = request.json.get("transaction_status", None),
                    person = request.json.get("person", None),
                    recipient = request.json.get("recipient", None),
                    transaction_date = str(date.today()),
                    cyclic_period = request.json.get("cyclic_period", None)
                    ).save()
        acc = Account.objects(id=account_id).first()
        acc.update(balance=(acc.balance+amount))
        return jsonify({"success": True, "msg": "Pomyślnie dodano wpis transakcji!"}), 200
    return jsonify({"success": False, "msg": "Niepowodzenie przy probie dodania wpisu transakcji!"}), 200


@app.route('/api/v1/transactions/get', methods=['POST','GET'])
@jwt_required()
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
@jwt_required()
def api_transactions_update():
    if request.is_json:
        transaction_id = request.json.get("transaction_id", None)
        attribute = request.json.get("attribute", None)
        value = request.json.get("value", None)

        tx = Transaction.objects(id=transaction_id).first()
        tx.update(attribute=attribute, value=value)

        acc = Account.objects(id=tx.account_id).first()
        acc.update(balance=(acc.balance+value))

    return jsonify({"success": True})


@app.route('/api/v1/transactions/delete', methods=['POST'])
@jwt_required()
def api_transactions_delete():
    if request.is_json:
        transaction_id = request.json.get("transaction_id", None)
        tx = Transaction.objects(id=transaction_id).first()
        tx.delete()
    return jsonify({}), 200


@app.route('/api/v1/categories/get', methods=['GET'])
def api_categories_get():
    # TODO
    return jsonify({}), 200


@app.route('/api/v1/categories/create', methods=['POST'])
def api_categories_create():
    # TODO
    return jsonify({}), 200


@app.route('/api/v1/accounts/get', methods=['GET'])
@jwt_required()
def api_accounts_get():
    username = get_jwt_identity()
    user = User.objects(username=username).first()

    users_accounts = Account.objects(user_id=user.id)
    return jsonify(users_accounts), 200


@app.route('/api/v1/accounts/create', methods=['POST', 'OPTIONS'])
@jwt_required()
def api_accounts_create():
    if request.is_json:

        name = request.json.get("acc_name", None)
        balance = request.json.get("acc_balance", None)
        username = get_jwt_identity()
        user = User.objects(username=username).first()

        if Account.objects(user_id=user.id) is None:
            Account(user_id=user.id, name=name, balance=balance).save()
            return jsonify({"message": "Poprawnie dodano konto"}), 200
        else:
            return jsonify({"success": False, "mssg": "Konto z podaną nazwą już istnieje!"})
    return jsonify({"success": False, "mssg": "Brak danych"})

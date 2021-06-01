from spending_manager import app, jwt
from spending_manager.models import User, Transaction, Account

from flask import render_template, jsonify, request, redirect, make_response
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


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return app.blocklisted[jti] is not None


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
    return render_template('db_test.html')


@app.route('/new_acc')
# @jwt_required()
def account_new_acc():
    return render_template('account_new_acc.html')


@app.route('/api/v1/login', methods=['POST'])
def api_login():
    if request.is_json:
        u = request.json.get("username", None)
        p = request.json.get("password", None)

        user = User.objects(username=u).first()
        # print(user.to_json())

        hashed_password = hash_password(p)
        if user.password == hashed_password:
            access_token = create_access_token(identity=u)
            response = make_response(jsonify({"token": access_token, "username": u}))
            set_access_cookies(response, access_token)
            return response, 200

    return jsonify({}), 403


@app.route('/api/v1/registration', methods=['POST'])
def api_registration():
    if request.is_json:
        u = request.json.get("username", None)
        p = request.json.get("password", None)
        user = User.objects(username=u).first()
        if user is None:
            hashed_password = hash_password(p)
            User(username=u, password=hashed_password).save()
            return jsonify({"success": True}), 200

    return jsonify({"success": False}), 400


@app.route('/api/v1/logout', methods=['DELETE'])
@jwt_required(optional=True)
def logout():
    jti = get_jwt()["jti"]
    app.blocklisted[jti] = datetime.now(timezone.utc)
    return jsonify({"success": True}), 200


# @jwt_required()
@app.route('/api/v1/transactions/create', methods=['POST'])
def api_transactions_create():
    if request.is_json:
        account_id = request.json.get('account_id', None)
        amount = request.json.get("amount", None)
        # TODO: Transaction(**request.json).save()
        Transaction(account_id=account_id,
                    amount=amount,
                    category_id=request.json.get("category_id", None),
                    transaction_type=request.json.get("transaction_type", None),
                    other_account_id=request.json.get("other_account_id", None),
                    transaction_status=request.json.get("transaction_status", None),
                    person=request.json.get("person", None),
                    recipient=request.json.get("recipient", None),
                    transaction_date=request.json.get("transaction_date", None),
                    cyclic_period=request.json.get("cyclic_period", None)
                    ).save()
        # acc = Account.objects(id=account_id).first()
        # acc.update(balance=(acc.balance+amount))
        return jsonify({"success": True}), 200
    return jsonify({"success": False}), 400


@app.route('/api/v1/transactions/get', methods=['POST', 'GET'])
@jwt_required()
def api_transactions_get():
    if request.is_json:
        account_id = request.json.get("account_id", None)
        tx = Transaction.objects(account_id=account_id).first()
        if tx is not None:
            return jsonify(tx.to_json()), 200

    return jsonify({"success": False}), 404


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
        acc.update(balance=(acc.balance + value))
        return jsonify({"success": True}), 200

    return jsonify({"success": True}), 400


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
    return jsonify({}), 200


@app.route('/api/v1/categories/create', methods=['POST'])
def api_categories_create():
    return jsonify({}), 200


@app.route('/api/v1/accounts/get', methods=['GET'])
@jwt_required()
def api_accounts_get():
    username = get_jwt_identity()
    user = User.objects(username=username).first()

    users_accounts = Account.objects(user_id=user.id)
    return jsonify(users_accounts), 200


@app.route('/api/v1/accounts/create', methods=['POST'])
@jwt_required()
def api_accounts_create():
    if request.is_json:

        name = request.json.get("acc_name", None)
        balance = request.json.get("acc_balance", None)
        username = get_jwt_identity()
        user = User.objects(username=username).first()

        if Account.objects(user_id=user.id, name=name) is None:
            Account(user_id=user.id, name=name, balance=balance).save()
            return jsonify({"message": "Poprawnie dodano konto"}), 200
        return jsonify({"message": "Konto o podanej nazwie już istnieje"}), 400
    return jsonify({"success": False, "mssg": "Brak danych"}), 400


@app.route('/api/v1/accounts/update', methods=['PUT'])
@jwt_required()
def api_accounts_update():
    if request.is_json:
        name = request.json.get("acc_name", None)
        new_name = request.json.get("new_acc_name", None)
        new_balance = request.json.get("new_acc_balance", None)
        username = get_jwt_identity()
        user = User.objects(username=username).first()

        account = Account.objects(user_id=user.id, name=name).first()
        if new_balance or new_name:
            if new_balance:
                account.update_one(balance=new_balance)
            if new_name:
                account.update_one(name=new_name)
            return jsonify({"message": "Poprawnie edytowano konto"}), 200
        return jsonify({"message": "Blad podczas edycji danych"}), 400
    return jsonify({"success": False, "mssg": "Brak danych"}), 400

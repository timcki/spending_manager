from spending_manager import app, jwt
from spending_manager.models import User, Transaction, Account, TransactionType

from flask import render_template, jsonify, request, redirect, make_response
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, set_access_cookies, get_jwt
from datetime import datetime, timedelta, timezone, date

import json
import hashlib
from bson.objectid import ObjectId


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


@app.route("/logout")
@jwt_required(optional=True)
def logout():
    jti = get_jwt()["jti"]
    app.blocklisted[jti] = datetime.now(timezone.utc)
    return redirect('/login')


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
            response = make_response(jsonify({"token": access_token}))
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


@app.route('/api/v1/transactions/create', methods=['POST'])
@jwt_required()
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
                    transaction_date=str(date.today()),
                    cyclic_period=request.json.get("cyclic_period", None)
                    ).save()
        # acc = Account.objects(id=account_id).first()
        # acc.update(balance=(acc.balance + amount))
        transaction_type = request.json.get("transaction_type", None)
        other_account_id = request.json.get("other_account_id", None)
        update_balance_on_insert(account_id, transaction_type, amount, other_account_id)
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
        before_update_data = get_transaction_data(tx)
        tx.update(attribute=attribute, value=value)
        after_update_data = get_transaction_data(tx)
        update_balance_on_update(before_update_data, after_update_data)
        return jsonify({"success": True}), 200

    return jsonify({"success": True}), 400


@app.route('/api/v1/transactions/delete', methods=['POST'])
@jwt_required()
def api_transactions_delete():
    if request.is_json:
        transaction_id = request.json.get("transaction_id", None)
        tx = Transaction.objects(id=transaction_id).first()
        before_delete_data = get_transaction_data(tx)
        tx.delete()
        update_balance_on_delete(before_delete_data)
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

        if Account.objects(user_id=user.id) is None:
            Account(user_id=user.id, name=name, balance=balance).save()
            return jsonify({"message": "Poprawnie dodano konto"}), 200
    return jsonify({"success": False, "mssg": "Brak danych"}), 400


def update_balance_on_insert(account_id, transaction_type, amount, other_account_id):
    account = Account.objects(id=account_id).first()
    new_balance = account.balance
    if transaction_type == TransactionType.EXPENSE or transaction_type == TransactionType.LENT:
        new_balance -= amount
    elif transaction_type == TransactionType.TRANSFER and ObjectId.is_valid(other_account_id):
        new_balance -= amount
        other_account = Account.objects(id=other_account_id).first()
        new_other_balance = other_account.balance + amount
        other_account = Account.objects(id=other_account_id).first()
        other_account.update(balance=new_other_balance)
    elif transaction_type == TransactionType.INCOME or transaction_type == TransactionType.BORROWED:
        new_balance += amount

    account.update(balance=new_balance)


def get_transaction_data(transaction):
    amount = transaction.amount
    account_id = transaction.account_id
    transaction_type = transaction.transaction_type
    other_account_id = transaction.other_account_id
    if transaction_type == TransactionType.TRANSFER:
        other_account_id = transaction['other_account_id']
    return {
        "account_id": account_id,
        "transaction_type": transaction_type,
        "amount": amount,
        "other_account_id": other_account_id
    }


def update_balance_on_update(before_update_data, after_update_data):
    update_balance_on_delete(before_update_data)
    update_balance_on_insert(after_update_data["account_id"], after_update_data["transaction_type"],
                             after_update_data["amount"], after_update_data["other_account_id"])


def update_balance_on_delete(before_delete_data):
    update_balance_on_insert(before_delete_data["account_id"], before_delete_data["transaction_type"],
                             -before_delete_data["amount"], before_delete_data["other_account_id"])

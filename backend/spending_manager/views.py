from spending_manager import app, jwt, blocklisted
from spending_manager.models import User, Transaction, Account, TransactionType, Category

from flask import jsonify, request, redirect, make_response
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, set_access_cookies, get_jwt
from datetime import datetime, timedelta, timezone
from bson.objectid import ObjectId
import dateutil.parser
from dateutil.relativedelta import relativedelta

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
    return jti in blocklisted


@jwt.expired_token_loader
@jwt.revoked_token_loader
def my_expired_token_callback(jwt_header, jwt_payload):
    return redirect('/')


@app.route("/logout")
@jwt_required(optional=True)
def logout():
    jti = get_jwt()["jti"]
    blocklisted[jti] = datetime.now(timezone.utc)
    return redirect('/')


@app.route('/api/v1/login', methods=['POST'])
def api_login():
    if request.is_json:
        u = request.json.get("username", None)
        p = request.json.get("password", None)

        user = User.objects(username=u).first()
        if user is None:
            return jsonify({"success": False}), 203
        # print(user.to_json())
        # account_id = user.main_account_id
        # account = Account.objects(id=account_id).first()
        hashed_password = hash_password(p)
        if user.password == hashed_password:
            access_token = create_access_token(identity=u)
            response = make_response(jsonify({"token": access_token, "username": u}))
            set_access_cookies(response, access_token)
            handle_forthcoming_transactions(u)
            return response, 200

    return jsonify({"success": False}), 403


@app.route('/api/v1/registration', methods=['POST'])
def api_registration():
    if request.is_json:
        u = request.json.get("username", None)
        p = request.json.get("password", None)
        m = request.json.get("main_account_id", None)
        user = User.objects(username=u).first()
        if user is None:
            hashed_password = hash_password(p)
            User(username=u, password=hashed_password, main_account_id=m).save()
            return jsonify({"success": True}), 200
        else:
            return jsonify({"success": False}), 203

    return jsonify({"success": False}), 400


@jwt_required()
@app.route('/api/v1/transactions/create', methods=['POST'])
def api_transactions_create():
    if request.is_json:
        account_id = request.json.get('account_id', None)
        # account_id = ObjectId("60b68dc85acd604ff41edfac") #account_id for already added account
        amount = float(request.json.get("amount", None))
        transaction_type = int(request.json.get("transaction_type", None))
        transaction_date = dateutil.parser.parse(request.json.get("transaction_date", None))
        transaction_status = make_transaction_status(transaction_date)
        other_account_id = request.json.get("other_account_id", None)
        other_account_name = request.json.get("other_account_name", None)
        #other_account_id = ObjectId("60b6980f0dac384440439a77")
        # TODO: Transaction(**request.json).save()
        Transaction(account_id=account_id,
                    amount=amount,
                    category_id=request.json.get("category_id", None),
                    transaction_type=transaction_type,
                    other_account_id=other_account_id,
                    other_account_name=other_account_name,
                    transaction_status=transaction_status,
                    person=request.json.get("person", None),
                    recipient=request.json.get("recipient", None),
                    transaction_date=transaction_date,
                    cyclic_period=request.json.get("cyclic_period", None)
                    ).save()
        update_balance_on_insert(account_id, transaction_type, amount, other_account_id, transaction_status)
        account_data = Account.objects(id=account_id).first()
        return jsonify(account_data), 200
    return jsonify({"success": False}), 400


@app.route('/api/v1/transactions/get', methods=['GET'])
@jwt_required()
def api_transactions_get():
    username = get_jwt_identity()
    user = User.objects(username=username).first()

    tx = Transaction.objects(account_id=user.main_account_id)
    return jsonify(tx), 200

# @app.route('/api/v1/transaction/get', methods=['GET'])
# @jwt_required()
# def api_transaction_get():
#     # if request.is_json:
#     transaction_id = request.args.get('transaction_id', None)
#     username = get_jwt_identity()
#     user = User.objects(username=username).first()

#     tx = Transaction.objects(id=transaction_id)
#     return jsonify(tx), 200


@app.route('/api/v1/transactions/update', methods=['POST'])
@jwt_required()
def api_transactions_update():
    if request.is_json:
        transaction_id = request.json.get("transaction_id", None)
        amount = request.json.get("amount", None)
        transaction_date = request.json.get("transaction_date", None)
        category_id = request.json.get("category_id", None)
        transaction_type = request.json.get("transaction_type", None)
        recipient = request.json.get("recipient", None)

        tx = Transaction.objects(id=transaction_id).first()
        before_update_data = get_transaction_data(tx)
        tx.update(id=transaction_id, amount=amount,transaction_date=transaction_date, category_id=category_id, transaction_type=transaction_type, recipient=recipient)
        after_update_data = get_transaction_data(Transaction.objects(id=transaction_id).first())
        update_balance_on_update(before_update_data, after_update_data)
        
        username = get_jwt_identity()
        user = User.objects(username=username).first()
        user_account = Account.objects(user_id=user.id,id=user.main_account_id).first()
        return jsonify(user_account), 200

    return jsonify({"success": False}), 400


@app.route('/api/v1/transactions/delete', methods=['POST'])
@jwt_required()
def api_transactions_delete():
    if request.is_json:
        transaction_id = request.json.get("transaction_id", None)
        tx = Transaction.objects(id=transaction_id).first()
        before_delete_data = get_transaction_data(tx)
        tx.delete()
        update_balance_on_delete(before_delete_data)
        username = get_jwt_identity()
        user = User.objects(username=username).first()
        user_account = Account.objects(user_id=user.id,id=user.main_account_id).first()
        return jsonify(user_account), 200
    return jsonify({"success": False}), 400


@app.route('/api/v1/categories/get', methods=['GET'])
@jwt_required()
def api_categories_get():
    username = get_jwt_identity()
    user = User.objects(username=username).first()
    users_categories = list(Category.objects(user_id=user.id))
    default_categories = list(Category.objects(is_default=True))
    result = users_categories+default_categories
    return jsonify(result), 200


@app.route('/api/v1/categories/create', methods=['POST'])
@jwt_required()
def api_categories_create():
    if request.is_json:
        username = get_jwt_identity()
        user = User.objects(username=username).first()
        name = request.json.get("name", None)
        icon_colour = request.json.get("icon_colour", None)
        Category(user_id=user.id, name=name, icon_colour=icon_colour, is_default=False).save()
        return jsonify({"message": "Poprawnie dodano kategorie"}), 200
    return jsonify({"success": False, "mssg": "Brak danych"}), 400


@app.route('/api/v1/categories/delete', methods=['DELETE'])
@jwt_required()
def api_categories_delete():
    # if request.is_json:
    # category_id = request.json.get("category_id", None)
    category_id = request.args.get("category_id", None)
    category = Category.objects(id=category_id).first()
    if category.is_default:
        return jsonify({"success": False, "mssg": "Nie możesz usunąć kategorii domyślnej"}), 400
    else:
        category.delete()
        return jsonify({"success": True, "mssg": "Poprawnie usunięto kategorię"}), 200
    return jsonify({"success": False, "mssg": "Brak danych"}), 400


@app.route('/api/v1/accounts/get', methods=['GET'])
@jwt_required()
def api_accounts_get():
    username = get_jwt_identity()
    user = User.objects(username=username).first()

    users_accounts = Account.objects(user_id=user.id)
    return jsonify(users_accounts), 200

@app.route('/api/v1/main_account/get', methods=['GET'])
@jwt_required()
def api_main_account_get():
    username = get_jwt_identity()
    user = User.objects(username=username).first()
    if user.main_account_id is None:
        return jsonify({"message": "Użytkownik nie posiada głównego konta"}), 400
    else:
        user_account = Account.objects(user_id=user.id,id=user.main_account_id).first()
        return jsonify(user_account), 200

@app.route('/api/v1/main_account/post', methods=['POST'])
@jwt_required()
def api_main_account_post():
    if request.is_json:
        account_id = request.json.get('account_id', None)
        username = get_jwt_identity()
        user = User.objects(username=username).first()
        if user.main_account_id is account_id:
            return jsonify({"message": "Wybrano to samo konto"}), 200
        else:
            user.update(main_account_id = account_id)
            user_account = Account.objects(user_id=user.id,id=account_id).first()

            # return jsonify({"message": "Pomyślnie zmieniono konto domyślne"}), 200
            return jsonify(user_account), 200


@app.route('/api/v1/accounts/create', methods=['POST'])
@jwt_required()
def api_accounts_create():
    if request.is_json:
        name = request.json.get("acc_name", None)
        balance = request.json.get("acc_balance", None)
        username = get_jwt_identity()
        user = User.objects(username=username).first()

        if Account.objects(user_id=user.id, name=name).first() is None:
            default_account = Account(user_id=user.id, name=name, balance=balance).save()
            if user.main_account_id is None:
                user.update(main_account_id=default_account.id)
            return jsonify({"message": "Poprawnie dodano konto"}), 200
        return jsonify({"message": "Konto o podanej nazwie już istnieje"}), 400
    return jsonify({"success": False, "mssg": "Brak danych"}), 400


@app.route('/api/v1/accounts/update', methods=['PUT'])
@jwt_required()
def api_accounts_update():
    if request.is_json:
        account_id = request.json.get("account_id", None)
        new_name = request.json.get("acc_name", None)
        new_balance = request.json.get("acc_balance", None)

        account = Account.objects(id=account_id).first()
        if new_balance or new_name:
            if new_balance:
                account.update_one(balance=new_balance)
            if new_name:
                account.update_one(name=new_name)
            return jsonify({"message": "Poprawnie edytowano konto"}), 200
        return jsonify({"message": "Blad podczas edycji danych"}), 400
    return jsonify({"success": False, "mssg": "Brak danych"}), 400


@app.route('/api/v1/accounts/delete', methods=['DELETE'])
@jwt_required()
def api_accounts_delete():
    if request.is_json:
        account_id = request.json.get("account_id", None)
        account = Account.objects(id=account_id).first()
        account.delete()
        return jsonify({"success": True, "mssg": "Poprawnie usunieto konto"}), 200
    return jsonify({"success": False, "mssg": "Brak danych"}), 400


def update_balance_on_insert(account_id, transaction_type, amount, other_account_id, transaction_status):
    account = Account.objects(id=account_id).first()
    new_balance = account.balance
    if transaction_status == "executed":
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
    transaction_date = transaction.transaction_date
    if transaction_type == TransactionType.TRANSFER:
        other_account_id = transaction['other_account_id']
    return {
        "account_id": account_id,
        "transaction_type": transaction_type,
        "amount": amount,
        "other_account_id": other_account_id,
        "transaction_date": transaction_date,
        "transaction_status": make_transaction_status(transaction_date)
    }


def update_balance_on_update(before_update_data, after_update_data):
    update_balance_on_delete(before_update_data)
    update_balance_on_insert(after_update_data["account_id"], after_update_data["transaction_type"],
                             after_update_data["amount"], after_update_data["other_account_id"], after_update_data["transaction_status"])


def update_balance_on_delete(before_delete_data):
    update_balance_on_insert(before_delete_data["account_id"], before_delete_data["transaction_type"],
                             -before_delete_data["amount"], before_delete_data["other_account_id"], before_delete_data["transaction_status"])


def make_transaction_status(transaction_date):
    transaction_status = "executed"
    if transaction_date>datetime.now(transaction_date.tzinfo):
        transaction_status = "forthcoming"
    return transaction_status


def handle_forthcoming_transactions(username):
    user_id = User.objects(username=username).first().id
    user_accounts = Account.objects(user_id=user_id)
    for account in user_accounts:
        account_id = account.id
        transactions = Transaction.objects(account_id=account_id, transaction_status="forthcoming")
        for transaction in transactions:
            transaction_date = transaction.transaction_date
            if transaction_date < datetime.now(transaction_date.tzinfo):
                transaction.update(transaction_status="executed")
                update_balance_on_insert(account_id, transaction.transaction_type, transaction.amount,
                                         transaction.other_account_id, "executed")
                # while True:
                #     transaction_date += relativedelta(months=1)
                #     if transaction_date > datetime.now(transaction_date.tzinfo):
                #         Transaction(account_id=account_id,
                #                     amount=transaction.amount,
                #                     category_id=transaction.category_id,
                #                     transaction_type=transaction.transaction_type,
                #                     other_account_id=transaction.other_account_id,
                #                     transaction_status="forthcoming",
                #                     person=transaction.person,
                #                     recipient=transaction.recipient,
                #                     transaction_date=transaction_date,
                #                     cyclic_period=transaction.cyclic_period
                #                     ).save()
                #         break
                #     else:
                #         Transaction(account_id=account_id,
                #                     amount=transaction.amount,
                #                     category_id=transaction.category_id,
                #                     transaction_type=transaction.transaction_type,
                #                     other_account_id=transaction.other_account_id,
                #                     transaction_status="executed",
                #                     person=transaction.person,
                #                     recipient=transaction.recipient,
                #                     transaction_date=transaction_date,
                #                     cyclic_period=transaction.cyclic_period
                #                     ).save()
                #         update_balance_on_insert(account_id, transaction.transaction_type, transaction.amount,
                #                                  transaction.other_account_id, transaction_date)

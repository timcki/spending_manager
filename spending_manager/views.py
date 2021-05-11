from datetime import datetime, timedelta, timezone

from spending_manager import app, jwt
from flask import render_template, jsonify, request, redirect
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, \
    set_access_cookies, get_jwt

import spending_manager.database as smDB

db = smDB.SpendingManagerDB()


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


@app.route("/logout")
@jwt_required(optional=True)
def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.insert_blocklisted(jti, now)
    return redirect('/login')


@app.route('/new_acc')
@jwt_required()
def account_new_acc():
    return render_template('account_new_acc.html')


@app.route('/api/v1/login', methods=['POST', 'OPTIONS'])
def api_login():
    if request.is_json:
        u = request.json.get("username", None)
        p = request.json.get("password", None)

        if db.get_user_login_data(u, p):
            access_token = create_access_token(identity=u)
            response = jsonify({"token": access_token, "success": True})
            set_access_cookies(response, access_token)
            return response
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


@app.route('/api/v1/accounts/get', methods=['GET'])
@jwt_required()
def api_accounts_get():
    username = get_jwt_identity()
    users_accounts = db.get_account(username)
    return jsonify({"success": True, "accounts": users_accounts})


@app.route('/api/v1/accounts/create', methods=['POST', 'OPTIONS'])
@jwt_required()
def api_accounts_create():
    if request.is_json:
        acc_name = request.json.get("acc_name", None)
        acc_balance = request.json.get("acc_balance", None)
        username = get_jwt_identity()
        if db.insert_account(username, acc_name, acc_balance):
            return jsonify({"success": True, "mssg": "Poprawnie dodano konto"})
        else:
            return jsonify({"success": False, "mssg": "Konto z podaną nazwą już istnieje!"})
    return jsonify({"success": False, "mssg": "Brak danych"})

from spending_manager.models import User
from spending_manager.utility import hash_password, handle_forthcoming_transactions
from spending_manager import app, jwt, blocklisted

from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, set_access_cookies, get_jwt
from flask import jsonify, request, redirect, make_response
from datetime import datetime, timedelta, timezone


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
            if u is not None and p is not None:
                hashed_password = hash_password(p)
                User(username=u, password=hashed_password, main_account_id=m).save()
                return jsonify({"success": True}), 200
            else:
                return jsonify({"success": False}), 203

    return jsonify({"success": False}), 400

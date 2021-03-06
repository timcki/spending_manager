from spending_manager import app, jwt, blocklisted
from spending_manager.models import User, Transaction, Account, TransactionType, Category
import spending_manager.utility as utility

from flask import jsonify, request, redirect, make_response
from flask_jwt_extended import get_jwt_identity, jwt_required
from datetime import datetime, timedelta, timezone
from bson.objectid import ObjectId
import dateutil.parser
from dateutil.relativedelta import relativedelta


@jwt_required()
@app.route('/api/v1/transactions/create', methods=['POST'])
def api_transactions_create():
    if request.is_json:
        account_id = request.json.get('account_id', None)
        amount = float(request.json.get("amount", None))
        category_id = request.json.get("category_id", None)
        person = request.json.get("person", None)
        recipient = request.json.get("recipient", None)
        transaction_type = int(request.json.get("transaction_type", None))
        transaction_date = dateutil.parser.parse(request.json.get("transaction_date", None))
        transaction_status = utility.make_transaction_status(transaction_date)
        other_account_id = request.json.get("other_account_id", None)
        other_account_name = request.json.get("other_account_name", None)
        cyclic_period = request.json.get("cyclic_period", None)

        Transaction(account_id=account_id,
                    amount=amount,
                    category_id=category_id,
                    transaction_type=transaction_type,
                    other_account_id=other_account_id,
                    other_account_name=other_account_name,
                    transaction_status=transaction_status,
                    person=person,
                    recipient=recipient,
                    transaction_date=transaction_date,
                    cyclic_period=cyclic_period
                    ).save()
        utility.update_balance_on_insert(account_id, transaction_type, amount,
                                         other_account_id, transaction_status)
        # transakcje cykliczne je??li cykl zaczyna sie dzis
        if cyclic_period is not None and transaction_status == "executed":
            delta = cyclic_period
            if delta == "miesi??c":
                transaction_date += relativedelta(months=1)
            elif delta == "tydzie??":
                transaction_date += relativedelta(weeks=1)
            elif delta == "dzie??":
                transaction_date += relativedelta(days=1)
            Transaction(account_id=account_id,
                        amount=amount,
                        category_id=category_id,
                        transaction_type=transaction_type,
                        other_account_id=other_account_id,
                        transaction_status="forthcoming",
                        person=person,
                        recipient=recipient,
                        transaction_date=transaction_date,
                        cyclic_period=cyclic_period
                        ).save()

        account_data = Account.objects(id=account_id).first()
        return jsonify(account_data), 200
    return jsonify({"success": False}), 400


@app.route('/api/v1/transactions/get', methods=['GET'])
@jwt_required()
def api_transactions_get():
    username = get_jwt_identity()
    user = User.objects(username=username).first()

    tx = Transaction.objects(account_id=user.main_account_id).order_by('-transaction_date')
    return jsonify(tx), 200


@app.route('/api/v1/transaction/get', methods=['GET'])
@jwt_required()
def api_transaction_get():
    # if request.is_json:
    transaction_id = request.args.get('transaction_id', None)
    username = get_jwt_identity()
    user = User.objects(username=username).first()

#     tx = Transaction.objects(id=transaction_id)
#     return jsonify(tx), 200


@app.route('/api/v1/statistics/get', methods=['GET'])
@jwt_required()
def api_statistics_get():
    username = get_jwt_identity()
    user = User.objects(username=username).first()

    transactions = Transaction.objects(account_id=user.main_account_id)
    stats = {}
    for transaction in transactions:
        month = transaction.transaction_date.month
        year = transaction.transaction_date.year
        amount = transaction.amount
        month_year = f"{month}-{year}"
        if month_year in stats:
            if transaction.transaction_type == 1:
                stats[month_year]["expense"] += amount
            elif transaction.transaction_type == 2:
                stats[month_year]["income"] += amount
        else:
            stats[month_year] = {}
            stats[month_year]["month"] = month
            stats[month_year]["year"] = year
            if transaction.transaction_type == 1:
                stats[month_year]["expense"] = amount
                stats[month_year]["income"] = 0
            elif transaction.transaction_type == 2:
                stats[month_year]["income"] = amount
                stats[month_year]["expense"] = 0

    return stats, 200


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
        before_update_data = utility.get_transaction_data(tx)
        tx.update(id=transaction_id, amount=amount, transaction_date=transaction_date, category_id=category_id,
                  transaction_type=transaction_type, recipient=recipient)
        after_update_data = utility.get_transaction_data(Transaction.objects(id=transaction_id).first())
        utility.update_balance_on_update(before_update_data, after_update_data)

        username = get_jwt_identity()
        user = User.objects(username=username).first()
        user_account = Account.objects(user_id=user.id, id=user.main_account_id).first()
        return jsonify(user_account), 200

    return jsonify({"success": False}), 400


@app.route('/api/v1/transactions/delete', methods=['POST'])
@jwt_required()
def api_transactions_delete():
    if request.is_json:
        transaction_id = request.json.get("transaction_id", None)
        tx = Transaction.objects(id=transaction_id).first()
        before_delete_data = utility.get_transaction_data(tx)
        tx.delete()
        utility.update_balance_on_delete(before_delete_data)
        username = get_jwt_identity()
        user = User.objects(username=username).first()
        user_account = Account.objects(user_id=user.id, id=user.main_account_id).first()
        return jsonify(user_account), 200
    return jsonify({"success": False}), 400


@app.route('/api/v1/categories/get', methods=['GET'])
@jwt_required()
def api_categories_get():
    username = get_jwt_identity()
    user = User.objects(username=username).first()
    users_categories = list(Category.objects(user_id=user.id))
    default_categories = list(Category.objects(is_default=True))
    result = users_categories + default_categories
    return jsonify(result), 200


@app.route('/api/v1/categories/create', methods=['POST'])
@jwt_required()
def api_categories_create():
    if request.is_json:
        username = get_jwt_identity()
        user = User.objects(username=username).first()
        name = request.json.get("name", None)
        icon_colour = request.json.get("icon_colour", None)
        category = Category.objects(user_id=user.id, name=name).first()
        if category is None:
            Category(user_id=user.id, name=name, icon_colour=icon_colour, is_default=False).save()
            return jsonify({"message": "Poprawnie dodano kategorie"}), 200
        else:
            return jsonify({"success": False, "message": "Kategoria o podanej nazwie ju?? istnieje"}), 409

    return jsonify({"success": False, "mssg": "Brak danych"}), 400


@app.route('/api/v1/categories/delete', methods=['POST'])
@jwt_required()
def api_categories_delete():
    if request.is_json:
        username = get_jwt_identity()
        user = User.objects(username=username).first()
        name = request.json.get("name", None)
        if name is None:
            cid = request.json.get("category_id", None)
            category = Category.objects(id=cid).first()
        else:
            category = Category.objects(name=name, user_id=user.id).first()
        if category is not None:
            if category.is_default:
                return jsonify({"success": False, "mssg": "Nie mo??esz usun???? kategorii domy??lnej"}), 400
            category.delete()
            return jsonify({"success": True, "mssg": "Poprawnie usuni??to kategori??"}), 200
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
        return jsonify({"message": "U??ytkownik nie posiada g????wnego konta"}), 400
    else:
        user_account = Account.objects(user_id=user.id, id=user.main_account_id).first()
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
            user.update(main_account_id=account_id)
            user_account = Account.objects(user_id=user.id, id=account_id).first()

            # return jsonify({"message": "Pomy??lnie zmieniono konto domy??lne"}), 200
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
        return jsonify({"message": "Konto o podanej nazwie ju?? istnieje"}), 400
    return jsonify({"success": False, "mssg": "Brak danych"}), 400


@app.route('/api/v1/accounts/update', methods=['POST', 'PUT'])
@jwt_required()
def api_accounts_update():
    if request.is_json:
        account_id = request.json.get("account_id", None)
        new_name = request.json.get("acc_name", None)
        new_balance = request.json.get("acc_balance", None)

        account = Account.objects(id=account_id).first()
        if new_balance or new_name:
            if new_balance:
                account.update(balance=new_balance)
            if new_name:
                account.update(name=new_name)
            return jsonify({"message": "Poprawnie edytowano konto"}), 200
        return jsonify({"message": "Blad podczas edycji danych"}), 400
    return jsonify({"success": False, "mssg": "Brak danych"}), 400


@app.route('/api/v1/accounts/delete', methods=['POST', 'DELETE'])
@jwt_required()
def api_accounts_delete():
    if request.is_json:
        account_id = request.json.get("account_id", None)
        account = Account.objects(id=account_id).first()
        if Account is not None:
            account.delete()
            return jsonify({"success": True, "mssg": "Poprawnie usunieto konto"}), 200
    return jsonify({"success": False, "mssg": "Brak danych"}), 400

@app.route('/api/v1/stats/get', methods=['GET'])
@jwt_required()
def api_stats_get():
    username = get_jwt_identity()
    user = User.objects(username=username).first()

    max_expense = Transaction.objects(account_id=user.main_account_id,transaction_type=1).order_by('-amount').first()
    max_income = Transaction.objects(account_id=user.main_account_id,transaction_type=2).order_by('amount').first()

    today=datetime.now()
    start = datetime(today.year,today.month, 1)
    number = Transaction.objects(account_id=user.main_account_id,transaction_date__gte=start).count()

    expense = Transaction.objects(account_id=user.main_account_id,transaction_date__gte=start,transaction_type=1)
    income=Transaction.objects(account_id=user.main_account_id,transaction_date__gte=start,transaction_type=2)
    transfer=Transaction.objects(account_id=user.main_account_id,transaction_date__gte=start,transaction_type=3)
    
    expense_number = len(expense)
    income_number=len(income)
    transfer_number=len(transfer)

    expense_value=0
    for el in expense:
        expense_value+=el.amount

    income_value=0
    for el in income:
        income_value+=el.amount

    transfer_value=0
    for el in transfer:
        transfer_value+=el.amount

    return jsonify(
        {
            "max_expense": max_expense,
            "max_income":max_income,
            "number":number,
            "expense_number":expense_number,
            "income_number":income_number,
            "transfer_number":transfer_number,
            "start":start,
            "expense_value":expense_value,
            "income_value":income_value,
            "transfer_value":transfer_value
        }), 200


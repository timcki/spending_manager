import hashlib
from spending_manager.models import *


def hash_password(password):
    s = hashlib.sha3_224()
    s.update(password.encode())
    return s.hexdigest()


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
                             after_update_data["amount"], after_update_data["other_account_id"],
                             after_update_data["transaction_status"])


def update_balance_on_delete(before_delete_data):
    update_balance_on_insert(before_delete_data["account_id"], before_delete_data["transaction_type"],
                             -before_delete_data["amount"], before_delete_data["other_account_id"],
                             before_delete_data["transaction_status"])


def make_transaction_status(transaction_date):
    transaction_status = "executed"
    if transaction_date > datetime.now(transaction_date.tzinfo):
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
                if transaction.cyclic_period is not None:
                    while True:
                        delta = transaction.cyclic_period
                        if delta == "miesiąc":
                            transaction_date += relativedelta(months=1)
                        elif delta == "tydzień":
                            transaction_date += relativedelta(weeks=1)
                        elif delta == "dzień":
                            transaction_date += relativedelta(days=1)
                        if transaction_date > datetime.now(transaction_date.tzinfo):
                            Transaction(account_id=account_id,
                                        amount=transaction.amount,
                                        category_id=transaction.category_id,
                                        transaction_type=transaction.transaction_type,
                                        other_account_id=transaction.other_account_id,
                                        transaction_status="forthcoming",
                                        person=transaction.person,
                                        recipient=transaction.recipient,
                                        transaction_date=transaction_date,
                                        cyclic_period=transaction.cyclic_period
                                        ).save()
                            break
                        else:
                            Transaction(account_id=account_id,
                                        amount=transaction.amount,
                                        category_id=transaction.category_id,
                                        transaction_type=transaction.transaction_type,
                                        other_account_id=transaction.other_account_id,
                                        transaction_status="executed",
                                        person=transaction.person,
                                        recipient=transaction.recipient,
                                        transaction_date=transaction_date,
                                        cyclic_period=transaction.cyclic_period
                                        ).save()
                            update_balance_on_insert(account_id, transaction.transaction_type, transaction.amount,
                                                     transaction.other_account_id, transaction_date)

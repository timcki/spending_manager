from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from TransactionType import TransactionType


class SpendingManagerDB():
    def __init__(self):
        self.client = MongoClient(
            "mongodb+srv://projectIO:{}@ioproject.6ezke.mongodb.net/Project_IO?retryWrites=true&w=majority".format(
                os.environ.get("SPENDING_MANAGER_DB")))
        self.db = self.client.get_database('Project_IO')
        self.user_records = self.db.user
        self.account_records = self.db.account
        self.transaction_records = self.db.transaction
        self.categories_records = self.db.categories

    def get_user(self, username):
        result = self.user_records.find_one({'user_name': username})
        if result is None:
            return None
        else:
            return list(result)

    def insert_user(self, user_name, password):
        user_json = {'user_name': user_name,
                     'password': password
                     }
        self.user_records.insert_one(user_json)

    def get_user_login_data(self, username, password):
        result = self.user_records.find_one({'user_name': username,
                                             'password': password
                                             })
        if result is None:
            return False
        else:
            return True

    def get_transaction(self, account_id):
        result = self.transaction_records.find({'account_id': account_id})
        if result is None:
            return None
        else:
            return list(result)

    def insert_transaction(self, account_id, amount, category_id, transaction_type, other_account_id,
                           transaction_status, person, recipient, transaction_date, cyclic_period):
        transaction_json = {'account_id': account_id,
                            'amount': amount,
                            'category_id': category_id,
                            'transaction_type': transaction_type,
                            'other_account_id': other_account_id,
                            'transaction_status': transaction_status,
                            'person': person,
                            'recipient': recipient,
                            'transaction_date': transaction_date,
                            'cyclic_period': cyclic_period
                            }
        self.transaction_records.insert_one(transaction_json)
        self.update_balance_on_insert(account_id, transaction_type, amount,other_account_id)

    def delete_transaction(self, transaction_id):
        delete_data = self.update_balance_on_delete(transaction_id)
        self.transaction_records.delete_one({'_id': ObjectId(transaction_id)})
        self.update_balance_on_insert(delete_data["account_id"], delete_data["transaction_type"],
                                      -delete_data["old_amount"], delete_data["other_account_id"])

    def update_transaction(self, transaction_id, attribute, value):
        filter = {'_id': ObjectId(transaction_id)}
        change = {"$set": {str(attribute): value}}
        update_data = self.update_balance_on_update(transaction_id, value)
        self.transaction_records.update_one(filter, change)
        self.update_balance_on_insert(update_data["account_id"], update_data["transaction_type"], update_data["delta"],
                                      update_data["other_account_id"])

    def update_balance_on_insert(self, account_id, transaction_type, amount, other_account_id):
        filter = {'_id': ObjectId(account_id)}
        account = self.account_records.find_one(filter)
        new_balance = account["balance"]
        if transaction_type == TransactionType.EXPENSE or transaction_type == TransactionType.LENT:
            new_balance -= amount
        elif transaction_type == TransactionType.TRANSFER and ObjectId.is_valid(other_account_id):
            new_balance -= amount
            other_account = self.account_records.find_one({'_id': ObjectId(other_account_id)})
            new_other_balance = other_account['balance'] + amount
            self.account_records.update_one({'_id': ObjectId(other_account_id)}, {'$set': {'balance': new_other_balance}})
        elif transaction_type == TransactionType.INCOME or transaction_type == TransactionType.BORROWED:
            new_balance += amount

        change = {'$set': {'balance': new_balance}}
        self.account_records.update_one(filter, change)

    def update_balance_on_update(self, transaction_id, value):
        transaction = self.transaction_records.find_one({'_id': ObjectId(transaction_id)})
        old_amount = transaction['amount']
        account_id = transaction['account_id']
        transaction_type = transaction['transaction_type']
        other_account_id = 'other_account_id' #placeholder
        if transaction_type == TransactionType.TRANSFER:
            other_account_id = transaction['other_account_id']
        delta = value - old_amount
        return {
            "account_id": account_id,
            "transaction_type": transaction_type,
            "delta": delta,
            "other_account_id": other_account_id
        }

    def update_balance_on_delete(self, transaction_id):
        transaction = self.transaction_records.find_one({'_id': ObjectId(transaction_id)})
        old_amount = transaction['amount']
        account_id = transaction['account_id']
        transaction_type = transaction['transaction_type']
        other_account_id = 'other_account_id'  # placeholder
        if transaction_type == TransactionType.TRANSFER:
            other_account_id = transaction['other_account_id']
        return {
            "account_id": account_id,
            "transaction_type": transaction_type,
            "old_amount": old_amount,
            "other_account_id": other_account_id
        }



    # TODO
    ''' 
    def get_category(self):
    
    def insert_category(self):
    '''


if __name__ == "__main__":
    db = SpendingManagerDB()
    # db.update_balance_on_insert("609ad3a7d48b1b7a2d3b8bc1", TransactionType.TRANSFER, 50, "609ae959d48b1b7a2d3b8bc2")
    # db.update_balance_on_update("609ffdc37cc3c60adc2a20c6", 60)
    # db.update_balance_on_delete("609ad29cd48b1b7a2d3b8bc0")
    # db.insert_transaction("609ad3a7d48b1b7a2d3b8bc1", 100, "kategoria testowa przychod", TransactionType.INCOME, "not_cyclic","executed","someone","someone","somedate","no")
    # db.update_transaction("60a004e1cb3c089809dc8533", "amount", 120)
    # db.delete_transaction("60a004e1cb3c089809dc8533")


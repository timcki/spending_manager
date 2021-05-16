from pymongo import MongoClient
from bson.objectid import ObjectId
from flask import make_response
import os, json, bson


def json_response(obj, cls=None):
    response = make_response(json.dumps(obj, cls=cls))
    response.content_type = 'application/json'

    return response


class MongoJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, bson.ObjectId):
            return str(obj)

        return json.JSONEncoder.default(self, obj)


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
        result = [doc for doc in self.transaction_records.find({'account_id': account_id})]
        if result is None:
            return None
        else:
            return json_response(result, cls=MongoJsonEncoder)

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

    def delete_transaction(self, transaction_id):
        self.transaction_records.delete_one({'_id': ObjectId(transaction_id)})

    def update_transaction(self, transaction_id, attribute, value):
        filter = {'_id': ObjectId(transaction_id)}
        change = { "$set": {str(attribute): value}}
        self.transaction_records.update_one(filter, change)

    # TODO
    ''' 
    def get_category(self):
    
    def insert_category(self):
    '''

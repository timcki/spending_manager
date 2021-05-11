from pymongo import MongoClient
import os
from datetime import datetime, timedelta, timezone


class SpendingManagerDB:
    def __init__(self):
        self.client = MongoClient(
            "mongodb+srv://projectIO:{}@ioproject.6ezke.mongodb.net/Project_IO?retryWrites=true&w=majority".format(os.environ.get("SPENDING_MANAGER_DB")))
        self.db = self.client.get_database('Project_IO')
        self.user_records = self.db.user
        self.account_records = self.db.account
        self.transaction_records = self.db.transaction
        self.categories_records = self.db.categories
        self.blocklisted_tokens = self.db.blocklisted
        self.actualize_blocklisted()

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

    def get_account(self, username):
        result = self.account_records.find({"username": username})
        if result is None:
            return False
        else:
            return list(result)

    def insert_account(self, username, acc_name, acc_balance):
        if self.account_records.find_one({"user_name": username, "name": acc_name}):
            return False
        else:
            self.account_records.insert({"user_name": username, "name": acc_name, "balance": acc_balance})
            return True

    def insert_blocklisted(self, jti, created_at):
        self.blocklisted_tokens.insert({"jti": jti, "created_at": created_at})

    def get_blocklisted(self, jti):
        return self.blocklisted_tokens.find_one({"jti": jti}) is not None

    def actualize_blocklisted(self):
        self.blocklisted_tokens.delete_many({"created_at": {'$lt': datetime.now(timezone.utc)-timedelta(minutes=30)}})

    # TODO
    ''' 
    def get_transaction(self):

    def insert_transaction(self):

    def delete_transaction(self):

    def update_transaction(self):
    '''
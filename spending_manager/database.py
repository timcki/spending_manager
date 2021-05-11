from pymongo import MongoClient
from mongotriggers import MongoTrigger
import os


def transaction_insert_trigger(callback):
    print("Insertion trigger called")


def transaction_update_trigger(callback):
    print("Update trigger called")


def transaction_delete_trigger(callback):
    print("Delete trigger called")


class SpendingManagerDB():
    def __init__(self):
        self.client = MongoClient(
            "mongodb+srv://projectIO:{}@ioproject.6ezke.mongodb.net/Project_IO?retryWrites=true&w=majority".format(os.environ.get("SPENDING_MANAGER_DB")))
        self.db = self.client.get_database('Project_IO')
        self.user_records = self.db.user
        self.account_records = self.db.account
        self.transaction_records = self.db.transaction
        self.categories_records = self.db.categories
        self.triggers = MongoTrigger(self.client)

    def set_triggers(self):
        self.triggers.register_insert_trigger(transaction_insert_trigger, db_name="Project_IO", collection_name="transaction")
        self.triggers.register_insert_trigger(transaction_update_trigger, db_name="Project_IO", collection_name="transaction")
        self.triggers.register_insert_trigger(transaction_update_trigger, db_name="Project_IO", collection_name="transaction")

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

    # TODO
    ''' 
    def get_transaction(self):

    def insert_transaction(self):

    def delete_transaction(self):

    def update_transaction(self):

    def get_category(self):
    
    def insert_category(self):
    '''
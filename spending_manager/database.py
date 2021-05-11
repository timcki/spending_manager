from pymongo import MongoClient
from mongotriggers import MongoTrigger
from bson.objectid import ObjectId
import os
from TransactionType import TransactionType





def transaction_update_trigger(callback):
    print("Update trigger called")



def transaction_delete_trigger(callback):
    print("Delete trigger called")


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
        self.triggers = MongoTrigger(self.client)

    def set_triggers(self):
        #self.triggers.register_insert_trigger(self.transaction_insert_trigger, db_name="Project_IO", collection_name="transaction")
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
        self.triggers.tail_oplog()
        self.user_records.insert_one(user_json)
        self.triggers.stop_tail()

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
        self.update_balance_on_insert(account_id, transaction_type, amount)

    def delete_transaction(self, transaction_id):
        self.transaction_records.delete_one({'_id': ObjectId(transaction_id)})

    def update_transaction(self, transaction_id, attribute, value):
        filter = {'_id': ObjectId(transaction_id)}
        change = {"$set": {str(attribute): value}}
        self.update_balance_on_update(transaction_id, value)
        self.transaction_records.update_one(filter, change)


    def update_balance_on_insert(self, account_id, transaction_type, amount, other_account_id):
        filter = {'_id': ObjectId(account_id)}
        account = self.account_records.find_one(filter)
        new_balance = account["balance"]
        if transaction_type == TransactionType.EXPENSE:
            new_balance -= amount
        elif transaction_type == TransactionType.TRANSFER and ObjectId.is_valid(other_account_id):
            new_balance -= amount
            other_account = self.account_records.find_one({'_id': ObjectId(other_account_id)})
            new_other_balance = other_account['balance'] + amount
            self.account_records.update_one({'_id': ObjectId(other_account_id)}, {'$set': {'balance': new_other_balance}})
        elif transaction_type == TransactionType.INCOME:
            new_balance += amount

        change = {'$set': {'balance': new_balance}}
        self.account_records.update_one(filter, change)

    def update_balance_on_update(self, transaction_id, value):
        transaction = self.transaction_records.find_one({'_id': ObjectId(transaction_id)})
        old_amount = transaction['amount']
        account_id = transaction['account_id']
        #other_account_id = transaction['other_account_id']
        transaction_type = transaction['transaction_type']
        delta = value - old_amount
        self.update_balance_on_insert(account_id,transaction_type,delta, 'sth')

    def update_balance_on_delete(self, transaction_id):
        transaction = self.transaction_records.find_one({'_id': ObjectId(transaction_id)})
        old_amount = transaction['amount']
        account_id = transaction['account_id']
        #other_account_id = transaction['other_account_id']
        transaction_type = transaction['transaction_type']
        self.update_balance_on_insert(account_id,transaction_type, -old_amount, 'sth')



    # TODO
    ''' 
    def get_category(self):
    
    def insert_category(self):
    '''


if __name__ == "__main__":
    db = SpendingManagerDB()
    db.update_balance_on_insert("609ad3a7d48b1b7a2d3b8bc1", TransactionType.TRANSFER, 50, "609ae959d48b1b7a2d3b8bc2")
    db.update_balance_on_update("609ad29cd48b1b7a2d3b8bc0", 40)
    db.update_balance_on_delete("609ad29cd48b1b7a2d3b8bc0")


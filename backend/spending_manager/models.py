from spending_manager import db
from flask_mongoengine import MongoEngine
from enum import IntEnum


class TransactionType(IntEnum):
    EXPENSE = 1
    INCOME = 2
    TRANSFER = 3
    LENT = 4
    BORROWED = 5


class User(db.Document):
    username = db.StringField()
    password = db.StringField()


class Transaction(db.Document):
    # TODO: Switch all ID fields to proper datatype db.ObjectIdField
    account_id = db.IntField()
    amount = db.FloatField()
    category_id = db.IntField()
    transaction_type = db.StringField()
    other_account_id = db.IntField()
    transaction_status = db.StringField()
    person = db.IntField()
    recipient = db.StringField()
    transaction_date = db.DateTimeField()
    cyclic_period = db.BooleanField()
    # account_id = db.StringField()
    # amount = db.StringField()
    # category_id = db.StringField()
    # transaction_type = db.StringField()
    # other_account_id = db.StringField()
    # transaction_status = db.StringField()
    # person = db.StringField()
    # recipient = db.StringField()
    # transaction_date = db.StringField()
    # cyclic_period = db.StringField()


class Account(db.Document):
    user_id = db.ObjectIdField()
    name = db.StringField()
    # balance = db.StringField()
    balance = db.FloatField()

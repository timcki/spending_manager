from spending_manager import db
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
    main_account_id=db.ObjectIdField()


class Transaction(db.Document):
    account_id = db.ObjectIdField()
    amount = db.FloatField()
    category_id = db.StringField()
    transaction_type = db.IntField()
    other_account_id = db.ObjectIdField()
    other_account_name = db.StringField()
    transaction_status = db.StringField()
    person = db.StringField()
    recipient = db.StringField()
    transaction_date = db.DateTimeField()
    cyclic_period = db.StringField()


class Account(db.Document):
    user_id = db.ObjectIdField()
    name = db.StringField()
    balance = db.FloatField()


class Category(db.Document):
    user_id = db.ObjectIdField()
    name = db.StringField()
    icon_colour = db.StringField()
    is_default = db.BooleanField()

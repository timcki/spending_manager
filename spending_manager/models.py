from spending_manager import app
from flask_mongoengine import MongoEngine

db = MongoEngine(app)

class User(db.Document):
    username = db.StringField()
    password = db.StringField()

    def to_json(self):
        return {"username": self.username,
                "password": self.password}


class Transaction(db.Document):
    # TODO: Switch all ID fields to proper datatype db.ObjectIdField
    account_id = db.IntField()
    amount = db.IntField()
    category_id = db.IntField()
    transaction_type = db.StringField()
    other_account_id = db.IntField()
    transaction_status = db.StringField()
    person = db.IntField()
    recipient = db.StringField()
    transaction_date = db.DateTimeField()
    cyclic_period = db.BooleanField()


import unittest
from database import SpendingManagerDB
from bson.objectid import ObjectId
from TransactionType import TransactionType


class MyTestCase(unittest.TestCase):

    def setUp(self) -> None:
        self.db = SpendingManagerDB()
        self.db.insert_user("db_test_user", "db_test_pass")
        self.db.insert_account("db_test_user", "db_test_acc_name1", 1000)
        self.db.insert_account("db_test_user", "db_test_acc_name2", 2000)
        self.acc_id1 = self.db.account_records.find_one({"name": "db_test_acc_name1"})['_id']
        self.acc_id2 = self.db.account_records.find_one({"name": "db_test_acc_name2"})['_id']

    def test_get_user(self):
        self.assertEqual(self.db.get_user("db_test_user")["user_name"], "db_test_user")

    def test_update_balance_on_insert_expense(self):
        self.db.update_balance_on_insert(self.acc_id1, TransactionType.EXPENSE, 7, 'sth')
        balance = self.db.account_records.find_one({'_id': ObjectId(self.acc_id1)})["balance"]
        self.assertEqual(balance, 993)

    def test_update_balance_on_insert_income(self):
        self.db.update_balance_on_insert(self.acc_id1, TransactionType.INCOME, 7, 'sth')
        balance = self.db.account_records.find_one({'_id': ObjectId(self.acc_id1)})["balance"]
        self.assertEqual(balance, 1007)

    def test_update_balance_on_insert_transfer(self):
        self.db.update_balance_on_insert(self.acc_id1, TransactionType.TRANSFER, 7, self.acc_id2)
        balance1 = self.db.account_records.find_one({'_id': ObjectId(self.acc_id1)})["balance"]
        balance2 = self.db.account_records.find_one({'_id': ObjectId(self.acc_id2)})["balance"]
        self.assertEqual(balance1, 993)
        self.assertEqual(balance2, 2007)

    def tearDown(self) -> None:
        self.db.user_records.delete_one({'user_name': "db_test_user"})
        self.db.account_records.delete_one({'user_name': "db_test_user", "name": "db_test_acc_name1"})
        self.db.account_records.delete_one({'user_name': "db_test_user", "name": "db_test_acc_name2"})


if __name__ == '__main__':
    unittest.main()


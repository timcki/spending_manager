import unittest
from spending_manager import app, db


class BaseCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()

    def tearDown(self):
        print("Finished")

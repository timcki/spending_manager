import unittest
import json
from spending_manager import app

unittest.TestLoader.sortTestMethodsUsing = None


class BaseCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()

    def tearDown(self):
        pass


class LoginCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        payload = json.dumps({
            "username": "hehe",
            "password": "mycoolpassword",
        })
        response = self.app.post('/api/v1/login',
                                 headers={"Content-Type": "application/json"},
                                 data=payload
                                 )
        self.jwt = response.json['token']
        self.account_id = ''

    def putAuth(self, url, payload):
        payload = json.dumps(payload)
        return self.app.put(url,
                            headers={
                                     "Authorization": f"Bearer {self.jwt}",
                                     "Content-Type": "application/json"
                                     },
                            data=payload
                            )

    def deleteAuth(self, url, payload):
        payload = json.dumps(payload)
        return self.app.delete(url,
                               headers={
                                     "Authorization": f"Bearer {self.jwt}",
                                     "Content-Type": "application/json"
                                     },
                               data=payload
                               )

    def postAuth(self, url, payload):
        payload = json.dumps(payload)
        return self.app.post(url,
                             headers={
                                      "Authorization": f"Bearer {self.jwt}",
                                      "Content-Type": "application/json"
                                      },
                             data=payload
                             )

    def getAuth(self, url):
        return self.app.get(url, headers={"token": self.jwt})

    def tearDown(self):
        self.getAuth('logout')

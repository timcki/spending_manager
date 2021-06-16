from tests.base_case import BaseCase
import unittest
import json



class SignUpTest(BaseCase):

    def test_successful_signup(self):

        unittest.TestLoader.sortTestMethodsUsing = None
        payload = json.dumps({
            "username": "hehe",
            "password": "mycoolpassword",
            "main_account_id": None
        })

        # When
        response = self.app.post('/api/v1/registration', headers={"Content-Type": "application/json"}, data=payload)

        # Then
        self.assertEqual(True, response.json['success'])
        self.assertEqual(200, response.status_code)

    def test_unsuccessful_signup(self):

        payload = json.dumps({
            "email": "hehe",
            "password": "mycoolpassword",
            "main_account_id": None
        })

        # When
        response = self.app.post('/api/v1/registration', headers={"Content-Type": "application/json"}, data=payload)

        # Then
        self.assertEqual(False, response.json['success'])
        self.assertEqual(203, response.status_code)

#    def test_existing_user_signup(self):
#
#        payload = json.dumps({
#            "username": "hehe",
#            "password": "mycoolpassword",
#            "main_account_id": None
#        })
#
#        # When
#        response = self.app.post('/api/v1/registration', headers={"Content-Type": "application/json"}, data=payload)
#
#        # Then
#        self.assertEqual(False, response.json['success'])
#        self.assertEqual(400, response.status_code)
        payload = json.dumps({
            "username": "hehe",
            "password": "mycoolpassword",
        })

        # When
        response = self.app.post('/api/v1/login', headers={"Content-Type": "application/json"}, data=payload)
        self.jwt = response.json['token']

from tests.base_case import BaseCase
import json


class LoginTest(BaseCase):

    def test_successful_login(self):

        payload = json.dumps({
            "username": "hehe",
            "password": "mycoolpassword",
        })

        # When
        response = self.app.post('/api/v1/login', headers={"Content-Type": "application/json"}, data=payload)

        # Then
        self.assertEqual(str, type(response.json['token']))
        self.assertEqual(200, response.status_code)

    def test_unsuccessful_login(self):

        payload = json.dumps({
            "username": "hehe1",
            "password": "mynotcoolpassword",
        })

        # When
        response = self.app.post('/api/v1/login', headers={"Content-Type": "application/json"}, data=payload)

        # Then
        self.assertEqual(False, response.json['success'])
        self.assertEqual(203, response.status_code)

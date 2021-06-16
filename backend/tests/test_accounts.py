from tests.base_case import LoginCase

class AccountsTest(LoginCase):

    def test_create(self):
        response = self.postAuth('/api/v1/accounts/create',
                                 {'name': 'weedzik',
                                  'balance': 69420,
                                 })

        self.assertEqual(200, response.status_code)

    def test_main_accout_set(self):
        response = self.getAuth('/api/v1/main_account/get')
        self.assertFalse(None, response.json['user_id'])

    def test_get(self):
        response = self.getAuth('/api/v1/accounts/get')
        self.assertEqual(200, response.status_code)

    def test_update(self):
        response = self.getAuth('/api/v1/accounts/get')
        account_id = response.json[0]['_id']['$oid']
        response = self.putAuth('/api/v1/accounts/update',
                                 {'account_id': account_id,
                                  'acc_balance': 42069
                                  })
        self.assertEqual(200, response.status_code)

    def test_zdelete(self):
        response = self.getAuth('/api/v1/accounts/get')
        account_id = response.json[0]['_id']['$oid']
        response = self.deleteAuth('/api/v1/accounts/delete', {'account_id': account_id})

        self.assertEqual(200, response.status_code)

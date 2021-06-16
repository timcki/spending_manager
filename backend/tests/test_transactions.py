from tests.base_case import LoginCase
from datetime import datetime


class TransactionsTest(LoginCase):

    def test_create(self):
        oid = 'deadbeef'*3
        #response = self.postAuth('/api/v1/transactions/create',
#                    { 'account_id': oid,
#                    'amount': 69,
#                    'category_id': oid,
#                    'transaction_type': 1,
#                    'other_account_id': oid,
#                    'other_account_name': 'abc',
#                    'transaction_status': 'executed',
#                    'person': 'abc',
#                    'recipient': 'def',
#                    'transaction_date': str(datetime.now()),
#                    'cyclic_period': 'ddd'
#                    })
#
#        self.assertEqual(200, response.status_code)

    def test_get(self):
        response = self.getAuth('/api/v1/transactions/get')

        self.assertEqual(200, response.status_code)

    def test_get_statistics(self):
        response = self.getAuth('/api/v1/statistics/get')

        self.assertEqual(200, response.status_code)

#    def test_zdelete(self):
#        txid = self.getAuth('/api/v1/transactions/get').json[0]['_id']['$oid']
#        response = self.postAuth('/api/v1/transactions/delete',
#                                 {'transaction_id': txid}
#                                 )
#
#        self.assertEqual(200, response.status_code)

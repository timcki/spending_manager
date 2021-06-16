from tests.base_case import LoginCase


class CategoriesTest(LoginCase):

    def test_create(self):
        response = self.postAuth('/api/v1/categories/create', {'name': 'test123', 'icon_colour': 'blue'})

        self.assertEqual(200, response.status_code)

    def test_get(self):
        response = self.getAuth('/api/v1/categories/get')

        self.assertEqual(200, response.status_code)

    def test_zdelete(self):
        response = self.postAuth('/api/v1/categories/delete', {'name': 'test123'})

        self.assertEqual(200, response.status_code)

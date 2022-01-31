import app from '../../../app';
import supertest from 'supertest';
import { signup, truncateDB } from '../../../spec/utils';

describe('[E2E] Category', function() {

  describe('Testing create category endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('creates a category', async function() {
    // status code should be 201 `Created`
      const response = await supertest(app)
        .post('/categories')
        .set({ Authorization: await signup() })
        .send({
          name: 'drinks',
        });
      expect(response.statusCode).toBe(201);
    });

    // Failure scenarios
    it('requires authentication', async function() {
    // status code should be 201 `Created`
      const response = await supertest(app)
        .post('/categories')
        .send({
          name: 'drinks',
        });
      expect(response.statusCode).toBe(401);
    });
  });

  describe('Testing categories list endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('returns the categories', async function() {
      await supertest(app)
        .post('/categories')
        .set({ Authorization: await signup() })
        .send({
          name: 'drinks',
        });

      const response = await supertest(app)
        .get('/categories');

      expect(response.statusCode).toBe(200);
      expect(response.body.data.categories.length).toBe(1);

    });
  });

  describe('Testing show category endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('returns category details', async function() {
      const createCategoryResponse = await supertest(app)
        .post('/categories')
        .set({ Authorization: await signup() })
        .send({
          name: 'drinks',
        });
      const categoryId = createCategoryResponse.body.data.category.id;

      const getCategoryResponse = await supertest(app)
        .get(`/categories/${categoryId}`);

      expect(getCategoryResponse.statusCode).toBe(200);
      expect(getCategoryResponse.body.data.category.name).toBe('drinks');

    });
  });

  describe('Testing category products endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    it('returns category products', async function() {
      const createCategoryResponse = await supertest(app)
        .post('/categories')
        .set({ Authorization: await signup() })
        .send({
          name: 'drinks',
        });
      const categoryId = createCategoryResponse.body.data.category.id;

      const createProduct1Response = await supertest(app)
        .post('/products')
        .set({ Authorization: await signup() })
        .send({
          'name': 'Tea',
          'description': 'Libton',
          'price': 5,
          'category_id': categoryId,
        });

      const createProduct2Response = await supertest(app)
        .post('/products')
        .set({ Authorization: await signup() })
        .send({
          'name': 'Coffee',
          'description': 'Brazillian',
          'price': 10,
          'category_id': categoryId,
        });

      const getCategoryProductsResponse = await supertest(app)
        .get(`/categories/${categoryId}/products`)
        .set({ Authorization: await signup() });

      expect(getCategoryProductsResponse.statusCode).toBe(200);
      expect(getCategoryProductsResponse.body.data.products.length).toBe(2);

    });
  });
});

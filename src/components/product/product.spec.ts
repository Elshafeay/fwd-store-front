import app from '../../../app';
import supertest from 'supertest';
import { createProduct, signup, truncateDB } from '../../../spec/utils';

describe('[E2E] Product', function() {

  describe('Testing create product endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('creates a product without category', async function() {
      const response = await supertest(app)
        .post('/products')
        .set({ Authorization: await signup() })
        .send({
          'name': 'test',
          'description': 'test test',
          'price': 5,
        });
      expect(response.statusCode).toBe(201);
    });

    it('creates a product with category', async function() {
      const createCategoryResponse = await supertest(app)
        .post('/categories')
        .set({ Authorization: await signup() })
        .send({
          'name': 'drinks',
        });
      const categoryId = createCategoryResponse.body.data.category.id;

      const createProductResponse = await supertest(app)
        .post('/products')
        .set({ Authorization: await signup() })
        .send({
          'name': 'Tea',
          'description': 'Libton',
          'price': 5,
          'category_id': categoryId,
        });
      expect(createProductResponse.statusCode).toBe(201);
      expect(createProductResponse.body.data.product.name).toBe('Tea');
      expect(createProductResponse.body.data.product.category_id).toBe(categoryId);
    });

    // Failure scenarios
    it('requires authentication', async function() {
      const response = await supertest(app)
        .post('/products')
        .send({
          'name': 'test',
          'description': 'test test',
          'price': 5,
        });
      expect(response.statusCode).toBe(401);
    });

  });

  describe('Testing products list endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('returns the products', async function() {
      await createProduct();

      const response = await supertest(app)
        .get('/products');

      expect(response.statusCode).toBe(200);
      expect(response.body.data.products.length).toBe(1);
    });
  });

  describe('Testing show product endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('returns product details', async function() {
      const product = await createProduct();
      const listProductResponse = await supertest(app)
        .get(`/products/${product.id}`);

      expect(listProductResponse.statusCode).toBe(200);
      expect(listProductResponse.body.data.product.name).toBe('test');

    });
  });
});

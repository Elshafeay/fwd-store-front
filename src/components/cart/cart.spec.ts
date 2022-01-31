import app from '../../../app';
import supertest from 'supertest';
import { createProduct, signup, truncateDB, addItemToCart } from '../../../spec/utils';

describe('[E2E] Cart', function() {

  describe('Testing add item to cart endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('adds item to cart', async function() {
      const token =  await signup();
      const emptyCartResponse = await supertest(app)
        .get('/cart')
        .set({ Authorization: token });
      expect(emptyCartResponse.body.data.cart.items.length).toBe(0);

      const product = await createProduct();
      const addingToCartResponse = await supertest(app)
        .post('/cart/items')
        .set({ Authorization: token })
        .send({
          'product_id': product.id,
          'quantity': 3,
        });

      expect(addingToCartResponse.statusCode).toBe(201);

      const cartDetailsResponse = await supertest(app)
        .get('/cart')
        .set({ Authorization: token });

      expect(cartDetailsResponse.body.data.cart.items.length).toBe(1);
      expect(cartDetailsResponse.body.data.cart.subTotal).toBe(15); // 3 * 5
    });

  });

  describe('Testing the Cart details endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    it('gets the cart details', async function() {
      const token =  await signup();

      const emptyCartResponse = await supertest(app)
        .get('/cart')
        .set({ Authorization: token });

      expect(emptyCartResponse.statusCode).toBe(200);
      expect(emptyCartResponse.body.data.cart.items.length).toBe(0);
      expect(emptyCartResponse.body.data.cart.subTotal).toBe(0);

      await addItemToCart(token);

      const cartResponse = await supertest(app)
        .get('/cart')
        .set({ Authorization: token });
      expect(cartResponse.body.data.cart.items.length).toBe(1);
    });

    it('requires authentication', async function() {
      const response = await supertest(app)
        .get('/cart/');

      expect(response.statusCode).toBe(401);
    });

  });

  describe('Testing remove item from cart endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    it('removes an item from the cart', async function() {
      const token =  await signup();

      const addedProduct = await addItemToCart(token);

      // removing the added item
      await supertest(app)
        .delete(`/cart/items/${addedProduct.id}`)
        .set({ Authorization: token });

      const emptyCartResponse = await supertest(app)
        .get('/cart')
        .set({ Authorization: token });

      // making sure it got removed
      expect(emptyCartResponse.body.data.cart.items.length).toBe(0);
    });

    it('requires authentication', async function() {
      const response = await supertest(app)
        .delete('/cart/items/1');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('Testing emptying cart endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    it('empties the cart', async function() {
      const token =  await signup();

      // adding two items
      await addItemToCart(token);
      await addItemToCart(token);

      // removing the added items
      await supertest(app)
        .delete('/cart/items')
        .set({ Authorization: token });

      const emptyCartResponse = await supertest(app)
        .get('/cart')
        .set({ Authorization: token });

      // making sure the cart is empty
      expect(emptyCartResponse.body.data.cart.items.length).toBe(0);
    });

    it('requires authentication', async function() {
      const response = await supertest(app)
        .delete('/cart/items');

      expect(response.statusCode).toBe(401);
    });
  });

});

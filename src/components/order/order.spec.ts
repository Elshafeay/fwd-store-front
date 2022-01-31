import app from '../../../app';
import supertest from 'supertest';
import { signup, truncateDB, addItemToCart, placeOrder } from '../../../spec/utils';

describe('[E2E] Order', function() {

  describe('Testing place order endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    it('places an order', async function() {
      const token = await signup();

      await addItemToCart(token);

      const response = await supertest(app)
        .post('/order/place')
        .set({ Authorization: token });
      expect(response.statusCode).toBe(201);
    });

    it('returns 400 if the cart is empty', async function() {
      const token = await signup();
      const response = await supertest(app)
        .post('/order/place')
        .set({ Authorization: token });
      expect(response.statusCode).toBe(400);
    });

    it('requires authentication', async function() {
      const response = await supertest(app)
        .post('/order/place');
      expect(response.statusCode).toBe(401);
    });
  });

  describe('Testing get order endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    it('gets an order details', async function() {
      const token = await signup();

      const orderId = (await placeOrder(token)).id;
      const getOrderResponse = await supertest(app)
        .get(`/orders/${orderId}`)
        .set({ Authorization: token });

      expect(getOrderResponse.statusCode).toBe(200);
      expect(getOrderResponse.body.data.id).toBe(orderId);
      expect(getOrderResponse.body.data.sub_total).toBe(15);
    });
  });

  describe('Testing update order endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    it('updates an order status to completed', async function() {
      const token = await signup();
      const orderId = (await placeOrder(token)).id;

      const updateOrderResponse = await supertest(app)
        .patch(`/orders/${orderId}`)
        .set({ Authorization: token })
        .send({ status: 'Completed' });

      expect(updateOrderResponse.statusCode).toBe(202);

      const getOrderResponse = await supertest(app)
        .get(`/orders/${orderId}`)
        .set({ Authorization: token });

      expect(getOrderResponse.body.data.id).toBe(orderId);
      expect(getOrderResponse.body.data.status).toBe('Completed');
    });
  });
});

import app from '../../../app';
import supertest from 'supertest';
import { signup, truncateDB, addItemToCart, placeOrder } from '../../../spec/utils';

describe('[E2E] User', function() {

  describe('Testing the signup endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('creates an account', async function() {
      // status code should be 201 `Created`
      const response = await supertest(app)
        .post('/users')
        .send({
          firstname: 'test',
          lastname: 'test',
          email: 'test@test.com',
          password: '123456',
        });
      expect(response.statusCode).toBe(201);
    });

    // Failure scenarios
    it('returns 400 if an account existed with the same email address', async function() {
      // status code should be 201 `Created`
      const createUser1Response = await supertest(app)
        .post('/users')
        .send({
          firstname: 'test',
          lastname: 'test',
          email: 'test@test.com',
          password: '123456',
        });
      expect(createUser1Response.statusCode).toBe(201);

      // status code should be 400
      const createUser2Response = await supertest(app)
        .post('/users')
        .send({
          firstname: 'test',
          lastname: 'test',
          email: 'test@test.com',
          password: '123456',
        });
      expect(createUser2Response.statusCode).toBe(400);
    });
  });

  describe('Testing the login endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('logins successfully', async function() {
      await supertest(app)
        .post('/users')
        .send({
          firstname: 'test',
          lastname: 'test',
          email: 'test@test.com',
          password: '123456',
        });

      // status code should be 201 `Created`
      const response = await supertest(app)
        .post('/users/login')
        .send({
          email: 'test@test.com',
          password: '123456',
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.data.token).toBeDefined();
    });

    // Failure scenarios
    it('returns 400 if invalid credentials', async function() {
      await supertest(app)
        .post('/users')
        .send({
          firstname: 'test',
          lastname: 'test',
          email: 'test@test.com',
          password: '123456',
        });

      // status code should be 201 `Created`
      const response = await supertest(app)
        .post('/users/login')
        .send({
          email: 'test@test.com',
          password: '12345',
        });
      expect(response.statusCode).toBe(400);
    });
  });

  describe('Testing the profile endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('returns the profile data successfully', async function() {
      const response = await supertest(app)
        .get('/me')
        .set({ Authorization: await signup() });

      expect(response.statusCode).toBe(200);
      expect(response.body.data.profile.firstname).toBe('test');
    });

    // Failure scenarios
    it('requires authentication', async function() {
      const response = await supertest(app)
        .get('/me');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('Testing the users list endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('returns the profile data successfully', async function() {
      const response = await supertest(app)
        .get('/users')
        .set({ Authorization: await signup() });

      expect(response.statusCode).toBe(200);
      // This user in the list refers to the user I created in signup
      expect(response.body.data.users.length).toBe(1);
    });
  });

  describe('Testing the user show endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('returns the user data successfully', async function() {
      const createUserResponse = await supertest(app)
        .post('/users')
        .send({
          firstname: 'user',
          lastname: 'test',
          email: 'user-test@test.com',
          password: '123456',
        });
      const userId = createUserResponse.body.data.user.id;

      const getUserResponse = await supertest(app)
        .get(`/users/${userId}`)
        .set({ Authorization: await signup() });

      expect(getUserResponse.statusCode).toBe(200);
      expect(getUserResponse.body.data.user.firstname).toBe('user');
    });
  });

  describe('Testing the user orders endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    it('returns the user orders successfully', async function() {
      const createUserResponse = await supertest(app)
        .post('/users')
        .send({
          firstname: 'user',
          lastname: 'test',
          email: 'user-test@test.com',
          password: '123456',
        });

      const userId = createUserResponse.body.data.user.id;
      const token = 'Bearer ' + createUserResponse.body.data.token;
      const orderId = (await placeOrder(token)).id;

      const getUserOrdersResponse = await supertest(app)
        .get(`/users/${userId}/orders`)
        .set({ Authorization: token });

      expect(getUserOrdersResponse.statusCode).toBe(200);
      expect(getUserOrdersResponse.body.data.orders.length).toBe(1);
      expect(getUserOrdersResponse.body.data.orders[0].id).toBe(orderId);
    });
  });

  describe('Testing the user completed orders endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    it('returns the user orders successfully', async function() {
      const createUserResponse = await supertest(app)
        .post('/users')
        .send({
          firstname: 'user',
          lastname: 'test',
          email: 'user-test@test.com',
          password: '123456',
        });

      const userId = createUserResponse.body.data.user.id;
      const token = 'Bearer ' + createUserResponse.body.data.token;
      const orderId = (await placeOrder(token)).id;

      const emptyUserCompletedOrdersResponse = await supertest(app)
        .get(`/users/${userId}/completed-orders`)
        .set({ Authorization: token });

      expect(emptyUserCompletedOrdersResponse.statusCode).toBe(200);
      expect(emptyUserCompletedOrdersResponse.body.data.orders.length).toBe(0);

      await supertest(app)
        .patch(`/orders/${orderId}`)
        .set({ Authorization: token })
        .send({ status: 'Completed' });

      const getUserCompletedOrdersResponse = await supertest(app)
        .get(`/users/${userId}/completed-orders`)
        .set({ Authorization: token });

      expect(getUserCompletedOrdersResponse.statusCode).toBe(200);
      expect(getUserCompletedOrdersResponse.body.data.orders.length).toBe(1);
      expect(getUserCompletedOrdersResponse.body.data.orders[0].id).toBe(orderId);

    });
  });

  describe('Testing the user current order endpoint', function() {
    beforeEach(async() => {
      await truncateDB();
    });

    // Success scenarios
    it('returns the user current order', async function() {
      const createUserResponse = await supertest(app)
        .post('/users')
        .send({
          firstname: 'user',
          lastname: 'test',
          email: 'user-test@test.com',
          password: '123456',
        });

      const userId = createUserResponse.body.data.user.id;
      const token = 'Bearer ' + createUserResponse.body.data.token;
      await addItemToCart(token);

      const getUserCurrentOrderResponse = await supertest(app)
        .get(`/users/${userId}/current-order`)
        .set({ Authorization: await signup() });

      expect(getUserCurrentOrderResponse.statusCode).toBe(200);
      expect(getUserCurrentOrderResponse.body.data.cart.items.length).toBe(1);
      expect(getUserCurrentOrderResponse.body.data.cart.subTotal).toBe(15);
    });
  });
});

import supertest from 'supertest';
import app from '../../app';
import Common from '../../src/utils/common';

const truncateDB = async () => {
  await Common.dbTruncate();
};

const signup = async () => {
  const randomId = Math.floor(Math.random() * 1000);
  const response = await supertest(app)
    .post('/users')
    .send({
      firstname: 'test',
      lastname: 'test',
      email: `test-${randomId}@test.com`,
      password: '123456',
    });
  const token = response.body.data.token;
  return 'Bearer ' + token;
};

const createProduct = async () => {
  const response = await supertest(app)
    .post('/products')
    .set({ Authorization: await signup() })
    .send({
      'name': 'test',
      'description': 'test test',
      'price': 5,
    });
  return response.body.data.product;
};

const addItemToCart = async (token: string) => {
  const product = await createProduct();
  await supertest(app)
    .post('/cart/items')
    .set({ Authorization: token })
    .send({
      'product_id': product.id,
      'quantity': 3,
    });

  return product;
};

const placeOrder = async (token: string) => {
  await addItemToCart(token);

  const placeOrderResponse = await supertest(app)
    .post('/order/place')
    .set({ Authorization: token });

  return placeOrderResponse.body.data.order;
};

export { truncateDB, signup, createProduct, addItemToCart, placeOrder };
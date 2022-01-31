import { Express } from 'express';
import user from './user/user.routes';
import order from './order/order.routes';
import product from './product/product.routes';
import cart from './cart/cart.routes';
import category from './category/category.routes';

class routing {

  api(app: Express) {
    user(app);
    order(app);
    product(app);
    cart(app);
    category(app);
  }
}
export default new routing();
import { Express } from 'express';
import { requireAuth } from '../../middlewares/require-auth';
import { validateRequest } from '../../middlewares/validate-request';
import CartController from './cart.controller';
import { createCartItemValidation, deleteCartItemValidation } from './cart.schemas';

const categoryRouter = (app: Express) => {
  app.get('/cart', requireAuth, CartController.getCartDetails);
  app.post(
    '/cart/items',
    requireAuth,
    validateRequest(createCartItemValidation),
    CartController.addItemToTheCart,
  );
  app.delete(
    '/cart/items/:id',
    requireAuth,
    validateRequest(deleteCartItemValidation),
    CartController.removeAnItemFromTheCart,
  );
  app.delete('/cart/items', requireAuth, CartController.emptyTheCart);
};

export default categoryRouter;
import { Express } from 'express';
import { requireAuth } from '../../middlewares/require-auth';
import { validateRequest } from '../../middlewares/validate-request';

import OrderController from './order.controller';
import { getOrderValidation, updateOrderValidation } from './order.schemas';

const orderRouter = (app: Express) => {
  app.get(
    '/orders/:id',
    requireAuth,
    validateRequest(getOrderValidation),
    OrderController.getOrder,
  );
  app.patch(
    '/orders/:id',
    requireAuth,
    validateRequest(updateOrderValidation),
    OrderController.updateOrder,
  );
  app.post('/order/place', requireAuth, OrderController.placeOrder);
};

export default orderRouter;
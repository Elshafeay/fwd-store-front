import { Express } from 'express';
import { requireAuth } from '../../middlewares/require-auth';
import { validateRequest } from '../../middlewares/validate-request';
import productController from './product.controller';
import { createProductValidation, getProductValidation } from './product.schemas';

const productRouter = (app: Express) => {

  app.get('/products', productController.getProducts);
  app.get('/products/popular', productController.findTopProducts);
  app.get(
    '/products/:id',
    validateRequest(getProductValidation),
    productController.getProduct,
  );
  app.post(
    '/products',
    requireAuth,
    validateRequest(createProductValidation),
    productController.createProduct,
  );
};

export default productRouter;
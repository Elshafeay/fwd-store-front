import { Express } from 'express';
import { requireAuth } from '../../middlewares/require-auth';
import { validateRequest } from '../../middlewares/validate-request';
import CategoryController from './category.controller';
import { createCategoryValidation, getCategoryValidation } from './cateogry.schemas';

const categoryRouter = (app: Express) => {

  app.get('/categories', CategoryController.getCategories);
  app.post(
    '/categories', requireAuth,
    validateRequest(createCategoryValidation),
    CategoryController.createCategory,
  );
  app.get(
    '/categories/:id',
    validateRequest(getCategoryValidation),
    CategoryController.getCategory,
  );
  app.get('/categories/:id/products', CategoryController.getCategoryProducts);
};

export default categoryRouter;
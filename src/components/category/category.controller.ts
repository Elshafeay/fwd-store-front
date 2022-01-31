import { Request, Response } from 'express';
import { BadRequestError } from '../../errors/bad-request-error';
import { NotFoundError } from '../../errors/not-found-error';
import CustomResponse from '../../utils/custom-response';
import Category from './category.model';

class CategoryController {

  async getCategories(req: Request, res: Response){
    const categories = await Category.findAll();
    CustomResponse.send(res, { categories });
  }

  async getCategory(req: Request, res: Response){
    const category = await Category.findOneById(+req.params.id);
    if(!category){
      throw new NotFoundError('Category Not Found!');
    }
    CustomResponse.send(res, { category });
  }

  async createCategory(req: Request, res: Response){
    const { name } = req.body;

    const existingCategory = await Category.findOneByName(name);
    if(existingCategory){
      throw new BadRequestError('There\'s a category with this name already!');
    }

    const category = await Category.create({ name });
    CustomResponse.send(res, { category }, 'Created Successfully!', 201);
  }

  async getCategoryProducts(req: Request, res: Response){
    const { id } = req.params;

    const products = await Category.findCategoryProducts(+id);
    CustomResponse.send(res, { products });
  }

}

export default new CategoryController();
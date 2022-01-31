import { Request, Response } from 'express';
import { NotFoundError } from '../../errors/not-found-error';
import Logger from '../../middlewares/logger';
import CustomResponse from '../../utils/custom-response';
import Category from '../category/category.model';
import { ICreateProduct } from './product.interfaces';
import Product from './product.model';

class ProductController {

  async getProduct(req: Request, res: Response){
    const product = await Product.findOneById(+req.params.id);

    if(!product){
      throw new NotFoundError('Product Not Found!');
    }
    CustomResponse.send(res, { product });
  }

  async getProducts(req: Request, res: Response){
    const products = await Product.findAll();
    CustomResponse.send(res, { products });
  }

  async createProduct(req: Request, res: Response){

    const { name,  price } = req.body;
    const description = req.body.description || '';
    const category_id = req.body.category_id || null;

    const productData: ICreateProduct = { name, price, description };

    if(category_id){
      const category = await Category.findOneById(category_id);
      if(!category){
        throw new NotFoundError('There\'s no category with this id');
      }
      productData.category_id = category_id;
    }

    const product = await Product.create(productData);

    CustomResponse.send(res, { product }, 'Created Successfully!', 201);
  }

  async findTopProducts(req: Request, res: Response){
    const products = await Product.findTopProducts();
    CustomResponse.send(res, { products });
  }

}

export default new ProductController();
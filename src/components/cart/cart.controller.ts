import { Request, Response } from 'express';
import { NotFoundError } from '../../errors/not-found-error';
import Product from '../product/product.model';
import Cart from './cart.model';
import CustomResponse from '../../utils/custom-response';

class CartController {

  async getCartDetails(req: Request, res: Response){
    const cart = await Cart.getFullCartDetailsByUser(req.user?.id!);
    CustomResponse.send(res, { cart });
  }

  async addItemToTheCart(req: Request, res: Response){
    const { product_id, quantity } = req.body;

    const product = await Product.findOneById(product_id);

    if(!product){
      throw new NotFoundError('Product Not Found!');
    }

    const cartItem = await Cart.create({
      product_id,
      quantity,
      user_id: req.user?.id!,
    });

    if(cartItem){
      CustomResponse.send(res, { cartItem }, 'Created Successfully!', 201);
    }else{
      throw new Error();
    }
  }

  async removeAnItemFromTheCart(req: Request, res: Response){
    await Cart.removeAnItemFromTheCart(req.user?.id!, +req.params.id);
    CustomResponse.sendWithoutData(res, 'The item has been deleted successfully', 202);
  }

  async emptyTheCart(req: Request, res: Response){
    await Cart.emptyTheCart(req.user?.id!);
    CustomResponse.sendWithoutData(res, 'Your cart has been emptied successfully', 202);
  }

}

export default new CartController();
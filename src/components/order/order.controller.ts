import { Request, Response } from 'express';
import { NotFoundError } from '../../errors/not-found-error';
import Order from './order.model';
import CustomResponse from '../../utils/custom-response';
import { IOrderFullDetails, IOrderItem } from './order.interfaces';
import Cart from '../cart/cart.model';
import { BadRequestError } from '../../errors/bad-request-error';
import Product from '../product/product.model';
import { OrderStatuses } from './order.enums';

class OrderController {

  async getOrder(req: Request, res: Response){
    const order = await Order.findOneById(+req.params.id);
    if(!order){
      throw new NotFoundError('Order Not Found!');
    }
    const orderItems = await Order.getOrderItems(order.id);
    const result: IOrderFullDetails = {
      ...order,
      orderItems,
    };
    CustomResponse.send(res, result);
  }

  async placeOrder(req: Request, res: Response){
    const cartItems = await Cart.getCartItemsByUser(req.user?.id!);

    if(cartItems.length === 0){
      throw new BadRequestError('Your Cart is Empty!');
    }

    const orderItems: IOrderItem[] = [];
    for(let cartItem of cartItems){
      const product = await Product.findOneById(cartItem.product_id);

      if(!product){
        throw new NotFoundError(
          `
          The product with id ${cartItem.product_id} doesn\'t exist anymore!
          You need to empty your cart in order to procced.
          `,
        );
      }

      orderItems.push({
        name: product.name,
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
        price: product.price,
      });
    }

    const subTotal = orderItems.reduce((acc: number, curr: IOrderItem) => {
      return acc + +(curr.price * curr.quantity).toFixed(2);
    }, 0);

    const order = await Order.create(
      {
        status: OrderStatuses.pending,
        sub_total: subTotal,
        user_id: req.user?.id!,
      },
      orderItems,
    );

    if(!order){
      throw new BadRequestError('Something Went Wrong, try again later');
    }
    await Cart.emptyTheCart(req.user?.id!);

    CustomResponse.send(res, { order }, 'Your order has been placed successfully!', 201);
  }

  async updateOrder(req: Request, res: Response){
    const order = await Order.findOneById(+req.params.id);
    const { status } = req.body;

    if(!order){
      throw new BadRequestError('Something Went Wrong, try again later');
    }

    const updateOrder = await Order.updateOrderStatus(+req.params.id, status);
    if(!updateOrder){
      throw new BadRequestError('Something Went Wrong, try again later');
    }

    order.status = status;

    CustomResponse.send(res, { order }, 'The Order is now completed successfully!', 202);
  }

}

export default new OrderController();
import Common from '../../utils/common';
import { IProduct } from '../product/product.interfaces';
import Product from '../product/product.model';
import { ICreateCartItem, ICart, ICartItem } from './cart.interfaces';

class Cart {
  static tableName = 'cart_items';

  static async getCartItemsByUser(user_id: number): Promise<ICartItem[]>{
    const rows = await Common.dbFetch(Cart.tableName, { user_id }) as ICartItem[];
    return rows;
  }

  static async getFullCartDetailsByUser(user_id: number): Promise<ICart>{
    const rows = await Common.dbFetch(Cart.tableName, { user_id }) as ICartItem[];
    let subTotal = 0;

    const items = [];
    for (let cartItem of rows){
      const product = await Product.findOneById(cartItem.product_id) as IProduct;

      cartItem.totalPrice = +(product.price * cartItem.quantity).toFixed(2);
      cartItem.productDetails = product;

      subTotal += cartItem.totalPrice;
      items.push(cartItem);
    }

    return { items, subTotal };
  }

  static async create(cartItem: ICreateCartItem): Promise<ICartItem | null> {
    const existingItem = await Common.dbFetch(
      Cart.tableName,
      {
        product_id: cartItem.product_id,
        user_id: cartItem.user_id,
      },
    ) as ICartItem[];

    if(existingItem && existingItem?.length > 0){
      /*
        user already has this product in his cart,
        so we're increasing the quantity rather than adding a new record.
      */
      const newQuantity = existingItem[0].quantity + cartItem.quantity;
      const updatedQuery = await Common.dbUpdate(
        Cart.tableName,
        {
          quantity: newQuantity,
        },
        {
          product_id: cartItem.product_id,
          user_id: cartItem.user_id,
        },
      );

      if(updatedQuery && updatedQuery.updated){
        const cartItem = existingItem[0];
        cartItem.quantity = newQuantity;
        return cartItem;
      }else{
        return null;
      }

    }else{
      const insertQuery = await Common.dbInsertion(Cart.tableName, cartItem);
      if(insertQuery && insertQuery.inserted){
        return insertQuery.data[0];
      }else{
        return null;
      }
    }
  }

  static async removeAnItemFromTheCart(user_id: number, product_id: number): Promise<void> {
    await Common.dbDeletion(Cart.tableName, { user_id, product_id });
  }

  static async emptyTheCart(user_id: number): Promise<void> {
    await Common.dbDeletion(Cart.tableName, { user_id });
  }
}

export default Cart;
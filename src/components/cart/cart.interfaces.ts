import { IProduct } from '../product/product.interfaces';

export interface ICreateCartItem {
  product_id: number,
  quantity: number,
  user_id: number,
}

export interface ICartItem {
  id: number,
  product_id: number,
  quantity: number,
  totalPrice?: number,
  productDetails?: IProduct
  created_at: string,
}

export interface ICart {
  items: ICartItem[],
  subTotal: number
}
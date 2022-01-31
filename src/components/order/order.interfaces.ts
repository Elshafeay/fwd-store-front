import { OrderStatuses } from './order.enums';

export interface ICreateOrder {
  status: OrderStatuses,
  user_id: number,
  sub_total: number,
}

export interface ICreateOrderItem {
  name: string,
  product_id: number,
  order_id:number,
  price: number,
  quantity: number,
}

export interface IOrder {
  id: number,
  status: OrderStatuses,
  user_id: number,
  sub_total: number,
  created_at: Date,
}

export interface IOrderFullDetails {
  id: number,
  status: OrderStatuses,
  user_id: number,
  sub_total: number,
  created_at: Date,
  orderItems: IOrderItem[],
}

export interface IOrderItem {
  name: string,
  product_id: number,
  price: number,
  quantity: number,
}
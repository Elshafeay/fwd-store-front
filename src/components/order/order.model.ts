import Common from '../../utils/common';
import { OrderStatuses } from './order.enums';
import {
  ICreateOrder,
  ICreateOrderItem,
  IOrder,
  IOrderFullDetails,
  IOrderItem,
} from './order.interfaces';

class Order {
  static tableName = 'orders';

  static async findOneById(id: number): Promise< IOrder| null> {
    const rows = await Common.dbFetch(Order.tableName, { id });
    if(rows?.length){
      return rows[0] as IOrder;
    }else{
      return null;
    }
  }

  static async create(order: ICreateOrder, orderItems: IOrderItem[]): Promise<IOrder | null> {

    const insertQuery = await Common.dbInsertion(Order.tableName, order);
    if(insertQuery && insertQuery.inserted){
      orderItems.map(async orderItem => {
        const createOrderItem: ICreateOrderItem = {
          ...orderItem,
          order_id: insertQuery.data[0].id,
        };
        await Common.dbInsertion('order_items', createOrderItem);
      });
      const createdOrder = insertQuery.data[0];
      const fullOrderDetails = Order.getOrderFullDetails(createdOrder.id);
      return fullOrderDetails;

    }else{
      return null;
    }
  }

  static async updateOrderStatus(order_id: number, status: OrderStatuses): Promise<number | null> {
    const updatedQuery = await Common.dbUpdate(
      Order.tableName,
      {
        status,
      },
      {
        id: order_id,
      },
    );

    if(updatedQuery && updatedQuery.updated){
      return updatedQuery.updated;
    }else{
      return null;
    }
  }

  static async getOrderItems(order_id: number): Promise<IOrderItem[]> {
    const orderItems = await Common.dbFetch(
      'order_items',
      { order_id },
      ['name', 'product_id', 'price', 'quantity'],
    ) as IOrderItem[];

    return  orderItems;
  }

  static async getOrderFullDetails(order_id: number): Promise<IOrderFullDetails | null> {
    const order = await Order.findOneById(order_id) as IOrder;

    if(!order){
      return null;
    }

    const orderItems = await Common.dbFetch(
      'order_items',
      { order_id },
      ['name', 'product_id', 'price', 'quantity'],
    ) as IOrderItem[];

    const result: IOrderFullDetails = { ...order, orderItems };

    return result;
  }

  static async getUserOrders(user_id: number): Promise<IOrder[]> {
    const rows = await Common.dbFetch(Order.tableName, { user_id }) as IOrder[];
    return rows;
  }

  static async getUserCompletedOrders(user_id: number): Promise<IOrder[]> {
    const rows = await Common.dbFetch(
      Order.tableName,
      {
        user_id,
        status: OrderStatuses.completed,
      },
    ) as IOrder[];
    return rows;
  }
}

export default Order;
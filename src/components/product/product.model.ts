import { QueryTypes } from 'sequelize';
import { sequelize } from '../../../config/sequelize';
import Common from '../../utils/common';
import { ICreateProduct, IProduct } from './product.interfaces';

class Product {
  static tableName = 'products';

  static async findOneById(id: number): Promise<IProduct | null> {
    const rows = await Common.dbFetch(Product.tableName, { id });
    if(rows?.length){
      return rows[0] as IProduct;
    }else{
      return null;
    }
  }

  static async findAll(): Promise<IProduct[]> {
    const rows = await Common.dbFetch(Product.tableName);
    return rows as IProduct[];
  }

  static async create(product: ICreateProduct): Promise<IProduct | null> {
    const insertQuery = await Common.dbInsertion(Product.tableName, product);
    if(insertQuery && insertQuery.inserted){
      return insertQuery.data[0] as IProduct;
    }else{
      return null;
    }
  }

  static async findTopProducts(): Promise<IProduct[]> {
    const query = `
      SELECT products.*, sum(quantity) as total_ordered
      FROM order_items, products
      WHERE order_items.product_id = products.id
      GROUP BY products.id
      ORDER BY sum(quantity) DESC
      LIMIT 5
    `;

    const rows = await sequelize.query(
      query,
      { type: QueryTypes.SELECT },
    );
    return rows as IProduct[];
  }

}

export default Product;
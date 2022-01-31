import Common from '../../utils/common';
import { ICreateCategory } from './category.interfaces';

class Category {
  static tableName = 'categories';

  static async findOneById(id: number){
    const rows = await Common.dbFetch(Category.tableName, { id });
    if(rows?.length){
      return rows[0];
    }else{
      return null;
    }
  }

  static async findOneByName(name: string){
    const rows = await Common.dbFetch(Category.tableName, { name });
    if(rows?.length){
      return rows[0];
    }else{
      return null;
    }
  }

  static async findAll(){
    const rows = await Common.dbFetch(Category.tableName);
    return rows;
  }

  static async findCategoryProducts(id: number){
    const rows = await Common.dbFetch('products', { category_id: id });
    return rows;
  }

  static async create(category: ICreateCategory){
    const insertQuery = await Common.dbInsertion(Category.tableName, category);
    if(insertQuery && insertQuery.inserted){
      return insertQuery.data[0];
    }else{
      return null;
    }
  }

}

export default Category;
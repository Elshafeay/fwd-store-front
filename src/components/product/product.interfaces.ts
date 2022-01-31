export interface ICreateProduct{
  name: string,
  price: number,
  description?: string,
  category_id?: number,
}

export interface IProduct {
  id: number,
  name: string,
  description: string,
  price: number,
  category_id: number,
  created_at: string,
}
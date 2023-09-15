import { ProductSchema } from '@database/repositories/pg/product';

export interface ProductViewModel extends ProductSchema {
  discount: number;
}

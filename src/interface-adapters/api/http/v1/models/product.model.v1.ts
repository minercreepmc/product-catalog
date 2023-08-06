import { ProductWithDetailsSchema } from '@database/repositories/pg/product';

export class V1ProductModel {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  discount_id?: string;
}

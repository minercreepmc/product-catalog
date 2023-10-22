import { PickType } from '@nestjs/swagger';
import { CategoryModel } from '@v2/category/model';
import { Expose, Type } from 'class-transformer';

export class OrderItemRO {
  @Expose()
  id: string;
  @Expose()
  price: number;
  @Expose()
  order_id: string;
  @Expose()
  product_id: string;
  @Expose()
  amount: number;
  @Expose()
  name: string;
  @Expose()
  image_urls: string[];
  @Expose()
  description: string;
  @Expose()
  @Type(() => CategoryRO)
  categories: CategoryRO[];
}

class CategoryRO extends PickType(CategoryModel, ['id', 'name']) {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

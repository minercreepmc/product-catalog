import type { CategoryModel } from '@v2/category/model';
import type { DiscountModel } from '@v2/discount/model';

export class ProductIncludeDiscountRO {
  id: string;
  name: string;
  description: string;
  price: number;
  image_urls: string[];
  discount_name: string;
  discount_percentage: number;
}

export class ProductRO {
  id: string;
  name: string;
  description: string;
  price: number;
  image_urls: string[];
  category_ids: string[];
  discount: DiscountModel[];
  categories: CategoryModel[];
}

export class CreateProductRO {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_id?: string;
  category_ids?: string[];
  image_urls?: string[];
}

export class UpdateProductRO {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_id: string;
  category_ids: string[];
}

export class GetAllProductWithImagesRO {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_id?: string;
  image_urls?: string[];
}

import type { CategoryModel } from '@v2/category/model';

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
  discount_id: string;
  discount_name: string;
  discount_percentage: number;
  categories: CategoryModel[];
}

export class CreateProductRO {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_id: string;
  category_ids: string[];
}

export class UpdateProductRO {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_id: string;
  category_ids: string[];
}

export class GetAllProductRO {
  id: string;
  name: string;
  description: string;
  price: number;
  image_urls: string[];
  discount_name: string;
  discount_percentage: number;
  categories: CategoryModel[];
}

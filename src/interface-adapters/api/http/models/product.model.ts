export class ProductModel {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  discount_id?: string;
  category_ids?: string[];
}

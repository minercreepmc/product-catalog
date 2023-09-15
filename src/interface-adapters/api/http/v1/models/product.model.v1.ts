export class V1ProductModel {
  id: string;
  name: string;
  price: number;
  description?: string;
  sold: number;
  image_url?: string;
  discount: number;
  discount_id?: string;
  category_ids?: string[];
}

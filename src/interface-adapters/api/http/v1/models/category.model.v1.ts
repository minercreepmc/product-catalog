export class V1CategoryModel {
  id: string;
  name: string;
  description?: string;
  product_ids?: string[];
  products?: {
    product_id: string;
    product_name?: string;
    product_price?: number;
  }[];
}

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
}

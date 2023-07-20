import { CategoryIdValueObject } from '@value-objects/category';
import {
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductImageUrlValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';

export interface ProductAggregateDetails {
  id: ProductIdValueObject;
  name: ProductNameValueObject;
  description?: ProductDescriptionValueObject;
  price: ProductPriceValueObject;
  image?: ProductImageUrlValueObject;
  categoryId?: CategoryIdValueObject;
  //discountId?: DiscountIdValueObject;
}

export interface CreateProductAggregateOptions {
  name: ProductNameValueObject;
  description?: ProductDescriptionValueObject;
  price: ProductPriceValueObject;
  image?: ProductImageUrlValueObject;
}

export interface UpdateProductAggregateOptions {
  name?: ProductNameValueObject;
  description?: ProductDescriptionValueObject;
  price?: ProductPriceValueObject;
  image?: ProductImageUrlValueObject;
}

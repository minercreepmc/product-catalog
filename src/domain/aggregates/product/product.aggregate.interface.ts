import { CategoryIdValueObject } from '@value-objects/category';
import { DiscountIdValueObject } from '@value-objects/discount';
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
  categoryIds?: CategoryIdValueObject[];
  discountId?: DiscountIdValueObject;
}

export interface CreateProductAggregateOptions {
  name: ProductNameValueObject;
  description?: ProductDescriptionValueObject;
  price: ProductPriceValueObject;
  image?: ProductImageUrlValueObject;
  categoryIds?: CategoryIdValueObject[];
}

export interface UpdateProductAggregateOptions {
  name?: ProductNameValueObject;
  description?: ProductDescriptionValueObject;
  price?: ProductPriceValueObject;
  image?: ProductImageUrlValueObject;
  discountId?: DiscountIdValueObject;
  categoryIds?: CategoryIdValueObject[];
}

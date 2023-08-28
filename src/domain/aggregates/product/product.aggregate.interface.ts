import { CategoryIdValueObject } from '@value-objects/category';
import { DiscountIdValueObject } from '@value-objects/discount';
import {
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductImageUrlValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
  ProductSoldValueObject,
} from '@value-objects/product';

export interface ProductAggregateDetails {
  id: ProductIdValueObject;
  name: ProductNameValueObject;
  description?: ProductDescriptionValueObject;
  price: ProductPriceValueObject;
  sold?: ProductSoldValueObject;
  image?: ProductImageUrlValueObject;
  categoryIds?: CategoryIdValueObject[];
  discountId?: DiscountIdValueObject;
}

export interface CreateProductAggregateOptions {
  name: ProductNameValueObject;
  price: ProductPriceValueObject;
  description?: ProductDescriptionValueObject;
  image?: ProductImageUrlValueObject;
  discountId?: DiscountIdValueObject;
  categoryIds?: CategoryIdValueObject[];
}

export interface UpdateProductAggregateOptions {
  name?: ProductNameValueObject;
  description?: ProductDescriptionValueObject;
  price?: ProductPriceValueObject;
  sold?: ProductSoldValueObject;
  image?: ProductImageUrlValueObject;
  discountId?: DiscountIdValueObject;
  categoryIds?: CategoryIdValueObject[];
}

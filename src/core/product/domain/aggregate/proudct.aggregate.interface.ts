import {
  ProductAttributesValueObject,
  ProductDescriptionValueObject,
  ProductImageValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@product-domain/value-objects';

export interface ProductAggregateDetails {
  name: ProductNameValueObject;
  description: ProductDescriptionValueObject;
  price: ProductPriceValueObject;
  image: ProductImageValueObject;
  attributes: ProductAttributesValueObject;
}

export interface CreateProductAggregateOptions {
  name: ProductNameValueObject;
  description?: ProductDescriptionValueObject;
  price: ProductPriceValueObject;
  image?: ProductImageValueObject;
  attributes?: ProductAttributesValueObject;
}

export interface UpdateProductAggregateOptions {
  name?: ProductNameValueObject;
  description?: ProductDescriptionValueObject;
  price?: ProductPriceValueObject;
  image?: ProductImageValueObject;
  attributes?: ProductAttributesValueObject;
}

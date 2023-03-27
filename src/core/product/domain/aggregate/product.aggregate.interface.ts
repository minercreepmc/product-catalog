import {
  ProductAttributesValueObject,
  ProductDescriptionValueObject,
  ProductImageValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
  ProductStatusValueObject,
} from '@product-domain/value-objects';
import { ReviewerIdValueObject } from '@reviewer-domain/value-objects';
import { TextValueObject } from 'common-base-classes';

export interface ProductAggregateDetails {
  name: ProductNameValueObject;
  description?: ProductDescriptionValueObject;
  price: ProductPriceValueObject;
  image?: ProductImageValueObject;
  attributes?: ProductAttributesValueObject;
  status: ProductStatusValueObject;
  submittedBy?: ReviewerIdValueObject;
  approvedBy?: ReviewerIdValueObject;
  rejectedBy?: ReviewerIdValueObject;
  rejectionReason?: TextValueObject;
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

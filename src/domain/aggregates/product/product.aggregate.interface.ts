import {
  ProductAttributesValueObject,
  ProductDescriptionValueObject,
  ProductImageUrlValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
  ProductStatusValueObject,
  RejectionReasonValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';

export interface ProductAggregateDetails {
  name: ProductNameValueObject;
  description?: ProductDescriptionValueObject;
  price: ProductPriceValueObject;
  image?: ProductImageUrlValueObject;
  attributes?: ProductAttributesValueObject;
  status?: ProductStatusValueObject;
  submittedBy?: ReviewerIdValueObject;
  approvedBy?: ReviewerIdValueObject;
  rejectedBy?: ReviewerIdValueObject;
  rejectionReason?: RejectionReasonValueObject;
}

export interface CreateProductAggregateOptions {
  name: ProductNameValueObject;
  description?: ProductDescriptionValueObject;
  price: ProductPriceValueObject;
  image?: ProductImageUrlValueObject;
  attributes?: ProductAttributesValueObject;
}

export interface UpdateProductAggregateOptions {
  name?: ProductNameValueObject;
  description?: ProductDescriptionValueObject;
  price?: ProductPriceValueObject;
  image?: ProductImageUrlValueObject;
  attributes?: ProductAttributesValueObject;
}

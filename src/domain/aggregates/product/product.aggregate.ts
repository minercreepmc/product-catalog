import { AggregateRootBase } from '@base/domain';
import {
  ProductCreatedDomainEvent,
  ProductUpdatedDomainEvent,
} from '@domain-events/product';
import { CategoryIdValueObject } from '@value-objects/category';
import { DiscountIdValueObject } from '@value-objects/discount';
import {
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductImageUrlValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';
import {
  CreateProductAggregateOptions,
  ProductAggregateDetails,
  UpdateProductAggregateOptions,
} from './product.aggregate.interface';

export class ProductAggregate
  implements ProductAggregateDetails, AggregateRootBase
{
  constructor(options?: ProductAggregateDetails) {
    if (options) {
      this.id = options.id;
      this.name = options.name;
      this.description = options.description;
      this.price = options.price;
      this.image = options.image;
      this.categoryId = options.categoryId;
      this.discountId = options.discountId;
    } else {
      this.id = new ProductIdValueObject();
    }
  }

  id: ProductIdValueObject;
  name: ProductNameValueObject;
  description?: ProductDescriptionValueObject;
  price: ProductPriceValueObject;
  image?: ProductImageUrlValueObject;
  categoryId?: CategoryIdValueObject;
  discountId?: DiscountIdValueObject;

  createProduct(options: CreateProductAggregateOptions) {
    this.name = options.name;
    this.price = options.price;

    if (options.description) {
      this.description = options.description;
    }
    if (options.image) {
      this.image = options.image;
    }

    return new ProductCreatedDomainEvent({
      id: this.id,
      name: this.name,
      price: this.price,
      description: this.description,
      image: this.image,
    });
  }

  updateProduct(options: UpdateProductAggregateOptions) {
    if (options.name) {
      this.name = options.name;
    }
    if (options.description) {
      this.description = options.description;
    }
    if (options.price) {
      this.price = options.price;
    }
    if (options.image) {
      this.image = options.image;
    }

    if (options.discountId) {
      this.discountId = options.discountId;
    }

    return new ProductUpdatedDomainEvent({
      id: this.id,
      name: this.name,
      price: this.price,
      description: this.description,
      image: this.image,
      discountId: this.discountId,
    });
  }

  removeProduct() {
    return new ProductUpdatedDomainEvent({
      id: this.id,
      name: this.name,
      price: this.price,
      description: this.description,
      image: this.image,
      discountId: this.discountId,
    });
  }
}

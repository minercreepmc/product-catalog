import { ProductIdValueObject } from '@product-domain/value-objects';
import { AbstractAggregateRoot } from 'common-base-classes';
import {
  CreateProductAggregateOptions,
  ProductAggregateDetails,
  UpdateProductAggregateOptions,
} from './proudct.aggregate.interface';

export class ProductAggregate extends AbstractAggregateRoot<
  Partial<ProductAggregateDetails>
> {
  constructor(id?: ProductIdValueObject) {
    super({ id: id ? id : new ProductIdValueObject(), details: {} });
  }

  createProduct(options: CreateProductAggregateOptions) {
    this.details.name = options.name;
    this.details.price = options.price;

    if (options.description) {
      this.details.description = options.description;
    }
    if (options.image) {
      this.details.image = options.image;
    }

    if (options.attributes) {
      this.details.attributes = options.attributes;
    }
  }

  updateProduct(options: UpdateProductAggregateOptions) {
    if (options.name) {
      this.details.name = options.name;
    }
    if (options.description) {
      this.details.description = options.description;
    }
    if (options.price) {
      this.details.price = options.price;
    }
    if (options.image) {
      this.details.image = options.image;
    }
    if (options.attributes) {
      this.details.attributes = options.attributes;
    }
  }
}

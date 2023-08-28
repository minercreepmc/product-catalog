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
  ProductSoldValueObject,
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
      this.categoryIds = options.categoryIds;
      this.discountId = options.discountId;
      this.sold = options.sold;
    } else {
      this.id = new ProductIdValueObject();
      this.sold = new ProductSoldValueObject(0);
    }
  }

  id: ProductIdValueObject;
  name: ProductNameValueObject;
  description?: ProductDescriptionValueObject;
  price: ProductPriceValueObject;
  image?: ProductImageUrlValueObject;
  sold?: ProductSoldValueObject;
  categoryIds?: CategoryIdValueObject[];
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
    if (options.categoryIds) {
      this.categoryIds = options.categoryIds;
    }

    if (options.discountId) {
      this.discountId = options.discountId;
    }

    return new ProductCreatedDomainEvent({
      id: this.id,
      name: this.name,
      price: this.price,
      description: this.description,
      image: this.image,
      categoryIds: this.categoryIds,
      discountId: this.discountId,
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
    if (options.categoryIds) {
      this.categoryIds = options.categoryIds;
    }
    if (options.sold) {
      this.sold = options.sold;
    }

    return new ProductUpdatedDomainEvent({
      id: this.id,
      name: this.name,
      price: this.price,
      description: this.description,
      sold: this.sold,
      image: this.image,
      discountId: this.discountId,
      categoryIds: this.categoryIds,
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
      categoryIds: this.categoryIds,
    });
  }

  increaseSold() {
    const currentSold = this.sold!.value;
    this.sold = new ProductSoldValueObject(currentSold + 1);

    return new ProductUpdatedDomainEvent({
      id: this.id,
      name: this.name,
      price: this.price,
      description: this.description,
      sold: this.sold,
      image: this.image,
      discountId: this.discountId,
      categoryIds: this.categoryIds,
    });
  }
}

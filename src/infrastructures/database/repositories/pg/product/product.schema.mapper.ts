import { ProductAggregate } from '@aggregates/product';
import { SchemaMapperBase } from '@base/database/repositories/pg';
import { Injectable } from '@nestjs/common';
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
import { plainToInstance } from 'class-transformer';
import { ProductSchema } from './product.schema';

@Injectable()
export class ProductSchemaMapper extends SchemaMapperBase<
  ProductAggregate,
  ProductSchema
> {
  toPersistance(product: Partial<ProductAggregate>): Partial<ProductSchema> {
    const {
      id,
      name,
      image,
      price,
      description,
      discountId,
      categoryIds,
      sold,
    } = product;

    const model: Partial<ProductSchema> = {
      id: id?.value,
      name: name?.value,
      price: price?.value,
      description: description?.value,
      image_url: image?.value,
      //  category_id: categoryId?.value,
      discount_id: discountId?.value,
      category_ids: categoryIds?.map?.((id) => id.value) || [],
      sold: sold?.value,
    };

    return plainToInstance(ProductSchema, model);
  }

  toDomain(model: ProductSchema): ProductAggregate {
    const {
      id,
      name,
      image_url,
      price,
      description,
      discount_id,
      category_ids,
      sold,
    } = model;

    return new ProductAggregate({
      id: new ProductIdValueObject(id),
      name: new ProductNameValueObject(name),
      image: image_url ? new ProductImageUrlValueObject(image_url) : undefined,
      price: new ProductPriceValueObject(price),
      description: description
        ? new ProductDescriptionValueObject(description)
        : undefined,
      discountId: discount_id
        ? new DiscountIdValueObject(discount_id)
        : undefined,
      categoryIds: category_ids?.map?.((id) => new CategoryIdValueObject(id)),
      sold: new ProductSoldValueObject(sold),
    });
  }
}

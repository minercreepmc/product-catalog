import { CategoryAggregate } from '@aggregates/category';
import { SchemaMapperBase } from '@base/database/repositories/pg';
import { Injectable } from '@nestjs/common';
import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
  CategoryNameValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';
import { plainToInstance } from 'class-transformer';
import { CategorySchema } from './category.schema';

@Injectable()
export class CategorySchemaMapper extends SchemaMapperBase<
  CategoryAggregate,
  CategorySchema
> {
  toDomain(model: CategorySchema): CategoryAggregate {
    const { id, name, description, product_ids } = model;

    return new CategoryAggregate({
      id: new CategoryIdValueObject(id),
      name: new CategoryNameValueObject(name),
      description: description
        ? new CategoryDescriptionValueObject(description)
        : undefined,
      productIds: product_ids?.map?.((id) => new ProductIdValueObject(id)),
    });
  }
  toPersistance(domain: Partial<CategoryAggregate>): Partial<CategorySchema> {
    const { id, name, description, productIds } = domain;

    const model: Partial<CategorySchema> = {
      id: id?.value,
      name: name?.value,
      description: description?.value,
      product_ids: productIds?.map?.((id) => id.value),
    };

    return plainToInstance(CategorySchema, model);
  }
}

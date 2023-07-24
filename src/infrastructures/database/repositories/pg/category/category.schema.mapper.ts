import { CategoryAggregate } from '@aggregates/category';
import { SchemaMapperBase } from '@base/database/repositories/pg';
import { Injectable } from '@nestjs/common';
import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
  CategoryNameValueObject,
} from '@value-objects/category';
import { plainToInstance } from 'class-transformer';
import { CategorySchema } from './category.schema';

@Injectable()
export class CategorySchemaMapper extends SchemaMapperBase<
  CategoryAggregate,
  CategorySchema
> {
  toDomain(model: CategorySchema): CategoryAggregate {
    const { id, name, description } = model;

    return new CategoryAggregate({
      id: new CategoryIdValueObject(id),
      name: new CategoryNameValueObject(name),
      description:
        description && new CategoryDescriptionValueObject(description),
    });
  }
  toPersistance(domain: Partial<CategoryAggregate>): Partial<CategorySchema> {
    const { id, name, description } = domain;

    const model: Partial<CategorySchema> = {
      id: id?.value,
      name: name?.value,
      description: description?.value,
    };

    return plainToInstance(CategorySchema, model);
  }
}

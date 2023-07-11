import {
  CategoryAggregate,
  CategoryAggregateDetails,
} from '@aggregates/category';
import { CategoryRepositoryPort } from '@domain-interfaces';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { MikroOrmRepositoryBase } from '@utils/base/database/repositories/mikroorm';
import { CategoryNameValueObject } from '@value-objects/category';
import { ProductMikroOrmRepository } from '../product';
import { CategoryMikroOrmMapper } from './category.mikroorm.mapper';
import { CategoryMikroOrmModel } from './category.mikroorm.model';
import { CategoryMikroOrmQueryMapper } from './category.mikroorm.query-mapper';


@Injectable()
export class CategoryMikroOrmRepository
  extends MikroOrmRepositoryBase<
    CategoryAggregate,
    CategoryAggregateDetails,
    CategoryMikroOrmModel
  >
  implements CategoryRepositoryPort
{
  constructor(entityManager: EntityManager) {
    super(
      entityManager,
      new CategoryMikroOrmMapper(CategoryAggregate, CategoryMikroOrmModel),
      new CategoryMikroOrmQueryMapper(),
      CategoryMikroOrmModel,
      new Logger(ProductMikroOrmRepository.name),
    );
  }

  async findOneByName(
    name: CategoryNameValueObject,
  ): Promise<CategoryAggregate> {
    return this.findOne({ name });
  }
}

import {
  CategoryAggregate,
  CategoryAggregateDetails,
} from '@aggregates/category';
import { CategoryNameValueObject } from '@value-objects/category';
import { RepositoryPort } from '@domain-interfaces';

export interface CategoryRepositoryPort
  extends RepositoryPort<CategoryAggregate, CategoryAggregateDetails> {
  findOneByName(name: CategoryNameValueObject): Promise<CategoryAggregate>;
}

export const categoryRepositoryDiToken = Symbol('CATEGORY_REPOSITORY');

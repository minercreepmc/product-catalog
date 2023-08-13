import { CategoryAggregate } from '@aggregates/category';
import { CategoryNameValueObject } from '@value-objects/category';
import { RepositoryPort } from '@domain-interfaces';

export interface CategoryRepositoryPort
  extends RepositoryPort<CategoryAggregate> {
  findOneByName(
    name: CategoryNameValueObject,
  ): Promise<CategoryAggregate | null>;
}

export const categoryRepositoryDiToken = Symbol('CATEGORY_REPOSITORY');

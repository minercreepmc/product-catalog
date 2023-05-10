import { CategoryAggregateDetails } from '@aggregates/category';
import { IBaseEntity } from 'common-base-classes';
import { AbstractQueryMapper, WhereClause } from 'nest-typeorm-common-classes';
import { Any, Equal } from 'typeorm';
import { CategoryTypeOrmModel } from './category.typeorm.model';

export type CategoryQueryParams = Partial<
  IBaseEntity & CategoryAggregateDetails
>;

export class CategoryTypeOrmQueryMapper extends AbstractQueryMapper<
  CategoryAggregateDetails,
  CategoryTypeOrmModel
> {
  toQuery(params: CategoryQueryParams): WhereClause<CategoryTypeOrmModel> {
    const where: WhereClause<CategoryTypeOrmModel> = {};
    const {
      id,
      name,
      parentIds,
      createdAt,
      updatedAt,
      productIds,
      description,
      subCategoryIds,
    } = params;

    if (id) {
      where.id = id.unpack();
    }

    if (name) {
      where.name = name.unpack();
    }

    if (parentIds) {
      where.parentIds = Any(parentIds.map((parentId) => parentId.unpack()));
    }

    if (createdAt) {
      where.createdAt = Equal(createdAt.unpack());
    }

    if (updatedAt) {
      where.updatedAt = updatedAt.unpack();
    }

    if (productIds) {
      where.productIds = Any(productIds.map((productId) => productId.unpack()));
    }

    if (description) {
      where.description = description.unpack();
    }

    if (subCategoryIds) {
      where.subCategoryIds = Any(
        subCategoryIds.map((subCategoryId) => subCategoryId.unpack()),
      );
    }

    return where;
  }
}

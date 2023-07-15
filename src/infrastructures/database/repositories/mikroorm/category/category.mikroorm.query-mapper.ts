import { CategoryAggregateDetails } from '@aggregates/category';
import {
  MikroOrmQueryMapper,
  OrmModelDetails,
} from '@utils/base/database/repositories/mikroorm';
import { IBaseEntity } from 'common-base-classes';
import { CategoryMikroOrmModel } from './category.mikroorm.model';

export type CategoryQueryParams = Partial<
  IBaseEntity & CategoryAggregateDetails
>;
export type CategoryMikroOrmModelDetails = Partial<
  OrmModelDetails<CategoryMikroOrmModel>
>;

export class CategoryMikroOrmQueryMapper extends MikroOrmQueryMapper<
  CategoryAggregateDetails,
  CategoryMikroOrmModel
> {
  toQueryDetails(params: CategoryQueryParams): CategoryMikroOrmModelDetails {
    const where: CategoryMikroOrmModelDetails = {};
    const { name, parentIds, productIds, description, subIds: subCategoryIds } = params;

    if (name) {
      where.name = name.unpack();
    }

    if (parentIds) {
      where.parentIds = parentIds.map((parentId) => parentId.unpack());
    }

    if (productIds) {
      where.productIds = productIds.map((productId) => productId.unpack());
    }

    if (description) {
      where.description = description.unpack();
    }

    if (subCategoryIds) {
      where.subIds = subCategoryIds.map((subCategoryId) =>
        subCategoryId.unpack(),
      );
    }

    return where;
  }
}

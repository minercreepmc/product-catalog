import {
  CategoryAggregate,
  CategoryAggregateDetails,
} from '@aggregates/category';
import {
  MikroOrmMapperBase,
  OrmModelDetails,
} from '@utils/base/database/repositories/mikroorm';
import {
  CategoryDescriptionValueObject,
  CategoryNameValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';
import { CategoryMikroOrmModel } from './category.mikroorm.model';

export type CategoryOrmModelDetails = OrmModelDetails<CategoryMikroOrmModel>;

export class CategoryMikroOrmMapper extends MikroOrmMapperBase<
  CategoryAggregate,
  CategoryAggregateDetails,
  CategoryMikroOrmModel
> {
  protected async toPersistanceDetails(
    entity: CategoryAggregate,
  ): Promise<CategoryOrmModelDetails> {
    const { name, description, parentIds, subCategoryIds, productIds } =
      entity.details;
    return {
      name: name?.unpack(),
      description: description?.unpack(),
      parentIds: parentIds?.map((id) => id.unpack()),
      subCategoryIds: subCategoryIds?.map((id) => id.unpack()),
      productIds: productIds?.map((id) => id.unpack()),
    };
  }

  protected async toDomainDetails(
    ormModel: CategoryMikroOrmModel,
  ): Promise<CategoryAggregateDetails> {
    let name: CategoryNameValueObject | undefined;
    let description: CategoryDescriptionValueObject | undefined;
    let parentIds: ParentCategoryIdValueObject[] | undefined;
    let subCategoryIds: SubCategoryIdValueObject[] | undefined;
    let productIds: ProductIdValueObject[] | undefined;

    if (ormModel.name) {
      name = new CategoryNameValueObject(ormModel?.name);
    }

    if (ormModel.description) {
      description = new CategoryDescriptionValueObject(ormModel?.description);
    }

    if (ormModel.parentIds) {
      parentIds = ormModel?.parentIds.map(
        (id) => new ParentCategoryIdValueObject(id),
      );
    }

    if (ormModel.subCategoryIds) {
      subCategoryIds = ormModel?.subCategoryIds.map(
        (id) => new SubCategoryIdValueObject(id),
      );
    }

    if (ormModel.productIds) {
      productIds = ormModel?.productIds.map(
        (id) => new ProductIdValueObject(id),
      );
    }

    return {
      name,
      description,
      parentIds,
      subCategoryIds,
      productIds,
    };
  }
}

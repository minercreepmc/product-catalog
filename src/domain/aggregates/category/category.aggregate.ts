import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import type { CategoryNameValueObject } from '@value-objects/category';
import { AbstractAggregateRoot, UUID } from 'common-base-classes';
import {
  CategoryAggregateDetails,
  CategoryAggregateOptions,
  CreateCategoryAggregateOptions,
} from './category.aggregate.interface';
import { CategoryCreatedDomainEvent } from '@domain-events/category/category-created.domain-event';
import { ProductIdValueObject } from '@value-objects/product';

export class CategoryAggregate extends AbstractAggregateRoot<
  Partial<CategoryAggregateDetails>
> {
  constructor(options?: CategoryAggregateOptions) {
    const defaultId = new UUID();
    const defaultDetails = {};
    const { id = defaultId, details = defaultDetails } = options ?? {};

    super({ id, details });
  }

  createCategory(options: CreateCategoryAggregateOptions) {
    const { name, parentIds, productIds, description, subCategoryIds } =
      options;
    this.name = name;
    this.parentIds = parentIds;
    this.productIds = productIds;
    this.description = description;
    this.subCategoryIds = subCategoryIds;

    return new CategoryCreatedDomainEvent({
      id: this.id,
      details: {
        name,
        subCategoryIds,
        productIds,
        parentIds,
        description,
      },
    });
  }

  createSubCategory() {
    throw new Error('Method not implemented.');
  }

  addProduct() {
    throw new Error('Method not implemented.');
  }

  removeProduct() {
    throw new Error('Method not implemented.');
  }

  updateCategory() {
    throw new Error('Method not implemented.');
  }

  get name(): CategoryNameValueObject {
    return this.details.name;
  }

  set name(newName: CategoryNameValueObject) {
    this.details.name = newName;
  }

  get parentIds(): ParentCategoryIdValueObject[] {
    return this.details.parentIds;
  }

  set parentIds(newParentId: ParentCategoryIdValueObject[]) {
    this.details.parentIds = newParentId;
  }

  get productIds(): ProductIdValueObject[] {
    return this.details.productIds;
  }

  set productIds(newProductIds: CategoryIdValueObject[]) {
    this.details.productIds = newProductIds;
  }

  get description(): CategoryDescriptionValueObject {
    return this.details.description;
  }

  set description(newDescription: CategoryDescriptionValueObject) {
    this.details.description = newDescription;
  }

  get subCategoryIds(): SubCategoryIdValueObject[] {
    return this.details.subCategoryIds;
  }

  set subCategoryIds(newSubCategoryIds: SubCategoryIdValueObject[]) {
    this.details.subCategoryIds = newSubCategoryIds;
  }
}

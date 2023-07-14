import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { CategoryNameValueObject } from '@value-objects/category';
import { AbstractAggregateRoot, UUID } from 'common-base-classes';
import {
  CategoryAggregateDetails,
  CategoryAggregateOptions,
  CreateCategoryAggregateOptions,
} from './category.aggregate.interface';
import { CategoryCreatedDomainEvent } from '@domain-events/category/category-created.domain-event';
import { ProductIdValueObject } from '@value-objects/product';
import {
  CategoryRemovedDomainEvent,
  ParentCategoriesDetachedDomainEvent,
  ParentCategoryAddedDomainEvent,
  SubCategoriesDetachedDomainEvent,
  SubCategoryAddedDomainEvent,
} from '@domain-events/category';

export class CategoryAggregate extends AbstractAggregateRoot<
  Partial<CategoryAggregateDetails>
> {
  constructor(options?: CategoryAggregateOptions) {
    const defaultId = new UUID();
    const defaultDetails: Partial<CategoryAggregateDetails> = {
      name: new CategoryNameValueObject('some-name'),
      description: new CategoryDescriptionValueObject('some-description'),
      parentIds: [],
      subCategoryIds: [],
      productIds: [],
    };
    const { id = defaultId, details = defaultDetails } = options ?? {};

    super({ id, details });
  }

  createCategory(options: CreateCategoryAggregateOptions) {
    const { name, parentIds, productIds, description, subCategoryIds } =
      options;
    this.name = name;

    if (parentIds && parentIds.length > 0) {
      this.parentIds = parentIds;
    }

    if (productIds && productIds.length > 0) {
      this.productIds = productIds;
    }

    if (description) {
      this.description = description;
    }

    if (subCategoryIds && subCategoryIds.length > 0) {
      this.subCategoryIds = subCategoryIds;
    }

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

  addSubCategories(subCategoryIds: SubCategoryIdValueObject[]) {
    this.subCategoryIds.push(...subCategoryIds);
    return new SubCategoryAddedDomainEvent({
      id: this.id,
      details: {
        subCategoryIds: this.subCategoryIds,
      },
    });
  }

  detachSubCategories(subCategoryIds: SubCategoryIdValueObject[]) {
    this.subCategoryIds = this.subCategoryIds.filter(
      (id) => !subCategoryIds.includes(id),
    );
    return new SubCategoriesDetachedDomainEvent({
      id: this.id,
      details: {
        subCategoryIds: this.subCategoryIds,
      },
    });
  }

  detachParentCategories(parentIds: ParentCategoryIdValueObject[]) {
    this.parentIds = this.parentIds.filter((id) => !parentIds.includes(id));
    return new ParentCategoriesDetachedDomainEvent({
      id: this.id,
      details: {
        parentIds: this.parentIds,
      },
    });
  }

  addParentCategories(parentIds: ParentCategoryIdValueObject[]) {
    this.parentIds.push(...parentIds);
    return new ParentCategoryAddedDomainEvent({
      id: this.id,
      details: {
        parentIds: this.parentIds,
      },
    });
  }

  removeCategory() {
    return new CategoryRemovedDomainEvent({
      id: this.id,
      details: {
        subCategoryIds: this.subCategoryIds,
      },
    });
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

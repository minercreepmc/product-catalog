import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { CategoryNameValueObject } from '@value-objects/category';
import {
  AbstractAggregateRoot,
  AbstractValueObject,
  UUID,
} from 'common-base-classes';
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
  ParentCategoriesAddedDomainEvent,
  SubCategoriesDetachedDomainEvent,
  SubCategoriesAddedDomainEvent,
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
      subIds: [],
      productIds: [],
    };
    const { id = defaultId, details = defaultDetails } = options ?? {};

    super({ id, details });
  }

  createCategory(options: CreateCategoryAggregateOptions) {
    const {
      name,
      parentIds,
      productIds,
      description,
      subIds: subCategoryIds,
    } = options;
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
      this.subIds = subCategoryIds;
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

  addSubCategories(subIds: SubCategoryIdValueObject[]) {
    this.subIds.push(...subIds);
    return new SubCategoriesAddedDomainEvent({
      id: this.id,
      details: {
        subIds: this.subIds,
      },
    });
  }

  addParentCategories(parentIds: ParentCategoryIdValueObject[]) {
    this.parentIds.push(...parentIds);
    return new ParentCategoriesAddedDomainEvent({
      id: this.id,
      details: {
        parentIds: this.parentIds,
      },
    });
  }
  detachSubCategories(subCategoryIds: SubCategoryIdValueObject[]) {
    this.subIds = AbstractValueObject.filter(
      this.subIds,
      (id) => !id.isIncludedIn(subCategoryIds),
    );
    return new SubCategoriesDetachedDomainEvent({
      id: this.id,
      details: {
        subIds: subCategoryIds,
      },
    });
  }

  detachParentCategories(parentIds: ParentCategoryIdValueObject[]) {
    this.parentIds = AbstractValueObject.filter(
      this.parentIds,
      (id) => !id.isIncludedIn(parentIds),
    );
    return new ParentCategoriesDetachedDomainEvent({
      id: this.id,
      details: {
        parentIds: parentIds,
      },
    });
  }

  removeCategory() {
    return new CategoryRemovedDomainEvent({
      id: this.id,
      details: {
        subIds: this.subIds,
        parentIds: this.parentIds,
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

  get subIds(): SubCategoryIdValueObject[] {
    return this.details.subIds;
  }

  set subIds(newSubCategoryIds: SubCategoryIdValueObject[]) {
    this.details.subIds = newSubCategoryIds;
  }
}

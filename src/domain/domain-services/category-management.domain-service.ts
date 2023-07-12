import {
  CategoryAggregate,
  CreateCategoryAggregateOptions,
} from '@aggregates/category';
import { CategoryRemovedDomainEvent } from '@domain-events/category';
import {
  categoryRepositoryDiToken,
  CategoryRepositoryPort,
} from '@domain-interfaces';
import { unitOfWorkDiToken, UnitOfWorkPort } from '@domain-interfaces';
import { eventBusDiToken, EventBusPort } from '@domain-interfaces/events';
import { Inject, Injectable } from '@nestjs/common';
import {
  CategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { CategoryVerificationDomainService } from './category-verification.domain-service';

export interface CreateCategoryOptions extends CreateCategoryAggregateOptions {}

export interface AddSubCategoriesServiceOptions {
  categoryId: CategoryIdValueObject;
  subCategoryIds: SubCategoryIdValueObject[];
}
export interface AddParentCategoriesServiceOptions {
  categoryId: CategoryIdValueObject;
  parentIds: SubCategoryIdValueObject[];
}

export interface RemoveCategoryServiceOptions {
  categoryId: CategoryIdValueObject;
}

export interface RemoveCategoriesServiceOptions {
  categoryIds: CategoryIdValueObject[];
}

@Injectable()
export class CategoryManagementDomainService {
  constructor(
    @Inject(unitOfWorkDiToken)
    private readonly unitOfWork: UnitOfWorkPort,
    @Inject(categoryRepositoryDiToken)
    private readonly categoryRepository: CategoryRepositoryPort,
    private readonly categoryVerification: CategoryVerificationDomainService,
    @Inject(eventBusDiToken)
    private readonly eventBus: EventBusPort,
  ) {}

  async createCategory(options: CreateCategoryOptions) {
    await this.categoryVerification.verifyCategoryCreationOptions(options);

    const categoryAggregate = new CategoryAggregate();

    const categoryCreated = categoryAggregate.createCategory(options);
    await this.categoryRepository.save(categoryAggregate);

    return categoryCreated;
  }

  async addSubCategories(options: AddSubCategoriesServiceOptions) {
    await this.categoryVerification.verifyAddSubCategoriesOptions(options);

    const categoryAggregate = await this.categoryRepository.findOneById(
      options.categoryId,
    );

    const subCategoryAdded = categoryAggregate.addSubCategories(
      options.subCategoryIds,
    );

    await this.categoryRepository.save(categoryAggregate);

    this.eventBus.publish(subCategoryAdded);

    return subCategoryAdded;
  }

  async addParentCategories(options: AddParentCategoriesServiceOptions) {
    await this.categoryVerification.verifyAddParentCategoriesOptions(options);

    const categoryAggregate = await this.categoryRepository.findOneById(
      options.categoryId,
    );

    const parentCategoryAdded = categoryAggregate.addParentCategories(
      options.parentIds,
    );

    await this.categoryRepository.save(categoryAggregate);
    return parentCategoryAdded;
  }

  async removeCategory(options: RemoveCategoryServiceOptions) {
    // TODO: run in transaction but with bulk delete not work
    await this.categoryVerification.verifyCategoryRemovalOptions(options);

    const { categoryId } = options;

    await this.categoryRepository.delete({
      id: categoryId,
    });

    return new CategoryRemovedDomainEvent({
      id: categoryId,
    });
  }

  // not test
  async removeCategories(options: RemoveCategoriesServiceOptions) {
    await this.categoryVerification.verifyCategoriesRemovalOptions(options);

    const promises = options.categoryIds.map((id: CategoryIdValueObject) => {
      this.categoryRepository.delete({
        id: id,
      });
    });

    await Promise.all(promises);

    const events = options.categoryIds.map((id: CategoryIdValueObject) => {
      return new CategoryRemovedDomainEvent({
        id: id,
      });
    });

    return events;
  }
}

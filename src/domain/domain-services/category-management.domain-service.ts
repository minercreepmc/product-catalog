import {
  CategoryAggregate,
  CreateCategoryAggregateOptions,
} from '@aggregates/category';
import {
  categoryRepositoryDiToken,
  CategoryRepositoryPort,
} from '@domain-interfaces';
import { unitOfWorkDiToken, UnitOfWorkPort } from '@domain-interfaces';
import { eventBusDiToken, EventBusPort } from '@domain-interfaces/events';
import { Inject, Injectable } from '@nestjs/common';
import {
  CategoryIdValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { CategoryVerificationDomainService } from './category-verification.domain-service';

export interface CreateCategoryOptions extends CreateCategoryAggregateOptions {}

export interface AddSubCategoriesServiceOptions {
  categoryId: CategoryIdValueObject;
  subIds: SubCategoryIdValueObject[];
}
export interface AddParentCategoriesServiceOptions {
  categoryId: CategoryIdValueObject;
  parentIds: ParentCategoryIdValueObject[];
}

export interface RemoveCategoryServiceOptions {
  categoryId: CategoryIdValueObject;
}

export interface RemoveCategoriesServiceOptions {
  categoryIds: CategoryIdValueObject[];
}

export interface RemoveSubCategoriesServiceOptions {
  categoryId: CategoryIdValueObject;
  subIds: SubCategoryIdValueObject[];
}

export interface RemoveParentCategoriesServiceOptions {
  categoryId: CategoryIdValueObject;
  parentIds: SubCategoryIdValueObject[];
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
    return this.unitOfWork.runInTransaction(async () => {
      await this.categoryVerification.verifyCategoryCreationOptions(options);

      const categoryAggregate = new CategoryAggregate();

      const categoryCreated = categoryAggregate.createCategory(options);
      await this.categoryRepository.save(categoryAggregate);

      return categoryCreated;
    });
  }

  async addSubCategories(options: AddSubCategoriesServiceOptions) {
    const event = await this.unitOfWork.runInTransaction(async () => {
      await this.categoryVerification.verifyAddSubCategoriesOptions(options);

      const categoryAggregate = await this.categoryRepository.findOneById(
        options.categoryId,
      );

      const subCategoryAdded = categoryAggregate.addSubCategories(
        options.subIds,
      );

      await this.categoryRepository.save(categoryAggregate);
      return subCategoryAdded;
    });

    this.eventBus.publish(event);
    return event;
  }

  async addParentCategories(options: AddParentCategoriesServiceOptions) {
    const event = await this.unitOfWork.runInTransaction(async () => {
      await this.categoryVerification.verifyAddParentCategoriesOptions(options);

      const categoryAggregate = await this.categoryRepository.findOneById(
        options.categoryId,
      );

      const parentCategoryAdded = categoryAggregate.addParentCategories(
        options.parentIds,
      );

      await this.categoryRepository.save(categoryAggregate);
      return parentCategoryAdded;
    });

    this.eventBus.publish(event);
    return event;
  }

  async removeCategory(options: RemoveCategoryServiceOptions) {
    // TODO: run in transaction but with bulk delete not work
    await this.categoryVerification.verifyCategoryRemovalOptions(options);

    const { categoryId } = options;

    const categoryAggregate = await this.categoryRepository.findOneById(
      categoryId,
    );

    const categoryRemoved = categoryAggregate.removeCategory();

    await this.categoryRepository.delete({
      id: categoryId,
    });

    return categoryRemoved;
  }

  async removeCategories(options: RemoveCategoriesServiceOptions) {
    await this.categoryVerification.verifyCategoriesRemovalOptions(options);

    const events = await this.unitOfWork.runInTransaction(async () => {
      const categories = [];
      for (const id of options.categoryIds) {
        categories.push(await this.categoryRepository.findOneById(id));
      }

      const categoriesRemoved = categories.map((category) =>
        category.removeCategory(),
      );

      for (const id of options.categoryIds) {
        await this.categoryRepository.delete({ id });
      }

      return categoriesRemoved;
    });

    for (const event of events) {
      this.eventBus.publish(event);
    }

    return events;
  }

  async detachSubCategories(options: RemoveSubCategoriesServiceOptions) {
    return this.unitOfWork.runInTransaction(async () => {
      const { categoryId, subIds } = options;

      await this.categoryVerification.verifyDetachSubCategoriesOptions(options);

      const categoryAggregate = await this.categoryRepository.findOneById(
        categoryId,
      );
      const subCategogiesDetached =
        categoryAggregate.detachSubCategories(subIds);

      await this.categoryRepository.save(categoryAggregate);

      return subCategogiesDetached;
    });
  }

  async detachParentCategories(options: RemoveParentCategoriesServiceOptions) {
    return this.unitOfWork.runInTransaction(async () => {
      const { categoryId, parentIds } = options;

      await this.categoryVerification.verifyDetachParentCategoriesOptiosn(
        options,
      );

      const categoryAggregate = await this.categoryRepository.findOneById(
        categoryId,
      );

      const parentCategoriesDetached =
        categoryAggregate.detachParentCategories(parentIds);

      await this.categoryRepository.save(categoryAggregate);

      return parentCategoriesDetached;
    });
  }
}

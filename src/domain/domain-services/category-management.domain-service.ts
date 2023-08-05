import {
  CategoryAggregate,
  CreateCategoryAggregateOptions,
  UpdateCategoryAggregateOptions,
} from '@aggregates/category';
import {
  CategoryRemovedDomainEvent,
  CategoryUpdatedDomainEvent,
} from '@domain-events/category';
import {
  categoryRepositoryDiToken,
  CategoryRepositoryPort,
} from '@domain-interfaces';
import { unitOfWorkDiToken, UnitOfWorkPort } from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { CategoryIdValueObject } from '@value-objects/category';
import { CategoryVerificationDomainService } from './category-verification.domain-service';

export interface CreateCategoryOptions extends CreateCategoryAggregateOptions {}

export interface RemoveCategoryServiceOptions {
  categoryId: CategoryIdValueObject;
}

export interface RemoveCategoriesServiceOptions {
  categoryIds: CategoryIdValueObject[];
}

export interface UpdateCategoryServiceOptions {
  id: CategoryIdValueObject;
  payload: UpdateCategoryAggregateOptions;
}

@Injectable()
export class CategoryManagementDomainService {
  constructor(
    @Inject(unitOfWorkDiToken)
    private readonly unitOfWork: UnitOfWorkPort,
    @Inject(categoryRepositoryDiToken)
    private readonly categoryRepository: CategoryRepositoryPort,
    private readonly categoryVerificationService: CategoryVerificationDomainService,
  ) {}

  async createCategory(options: CreateCategoryOptions) {
    return this.unitOfWork.runInTransaction(async () => {
      await this.categoryVerificationService.findCategoryOrThrowIfExist(
        options.name,
      );
      const categoryAggregate = new CategoryAggregate();
      const categoryCreated = categoryAggregate.createCategory(options);
      await this.categoryRepository.create(categoryAggregate);
      return categoryCreated;
    });
  }

  async removeCategory({ categoryId }: RemoveCategoryServiceOptions) {
    return this.unitOfWork.runInTransaction(async () => {
      const category =
        await this.categoryVerificationService.findCategoryOrThrow(categoryId);
      const categoryRemoved = category.removeCategory();
      await this.categoryRepository.deleteOneById(categoryId);
      return categoryRemoved;
    });
  }

  async removeCategories(
    options: RemoveCategoriesServiceOptions,
  ): Promise<CategoryRemovedDomainEvent[]> {
    const events = await this.unitOfWork.runInTransaction(async () => {
      const categories =
        await this.categoryVerificationService.findCategoriesOrThrow(
          options.categoryIds,
        );

      const categoriesRemovedEvent = categories.map((category) =>
        category.removeCategory(),
      );

      await this.categoryRepository.deleteManyByIds(options.categoryIds);
      return categoriesRemovedEvent;
    });

    return events;
  }

  async updateCategory(
    options: UpdateCategoryServiceOptions,
  ): Promise<CategoryUpdatedDomainEvent> {
    return this.unitOfWork.runInTransaction(async () => {
      const { id, payload } = options;
      const category =
        await this.categoryVerificationService.findCategoryOrThrow(id);
      const categoryUpdatedEvent = category.updateCategory(payload);
      await this.categoryRepository.updateOneById(id, category);
      return categoryUpdatedEvent;
    });
  }
}

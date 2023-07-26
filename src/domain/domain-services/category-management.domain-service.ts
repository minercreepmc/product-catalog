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
import { Inject, Injectable } from '@nestjs/common';
import {
  CategoryIdValueObject,
  CategoryNameValueObject,
} from '@value-objects/category';
import { CategoryVerificationDomainService } from './category-verification.domain-service';

export interface CreateCategoryOptions extends CreateCategoryAggregateOptions {}

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
  ) {}

  async doesCategoryExistByName(name: CategoryNameValueObject) {
    return this.categoryVerification.doesCategoryNameExist(name);
  }

  async doesCategoryExistById(id: CategoryIdValueObject) {
    return this.categoryVerification.doesCategoryIdExist(id);
  }

  async doesCategoryIdsExist(ids: CategoryIdValueObject[]) {
    return this.categoryVerification.doesCategoryIdsExist(ids);
  }

  async createCategory(options: CreateCategoryOptions) {
    return this.unitOfWork.runInTransaction(async () => {
      await this.categoryVerification.verifyCategoryCreationOptions(options);

      const categoryAggregate = new CategoryAggregate();

      const categoryCreated = categoryAggregate.createCategory(options);
      await this.categoryRepository.create(categoryAggregate);

      return categoryCreated;
    });
  }

  async removeCategory(options: RemoveCategoryServiceOptions) {
    // TODO: run in transaction but with bulk delete not work
    return this.unitOfWork.runInTransaction(async () => {
      await this.categoryVerification.verifyCategoryRemovalOptions(options);

      const { categoryId } = options;

      const categoryAggregate = await this.categoryRepository.findOneById(
        categoryId,
      );

      const categoryRemoved = categoryAggregate.removeCategory();

      await this.categoryRepository.deleteOneById(categoryId);

      return categoryRemoved;
    });
  }

  async removeCategories(
    options: RemoveCategoriesServiceOptions,
  ): Promise<CategoryRemovedDomainEvent[]> {
    const events = await this.unitOfWork.runInTransaction(async () => {
      const categories = [];
      for (const id of options.categoryIds) {
        categories.push(await this.categoryRepository.findOneById(id));
      }

      const categoriesRemoved = categories.map((category) =>
        category.removeCategory(),
      );

      for (const id of options.categoryIds) {
        await this.categoryRepository.deleteOneById(id);
      }

      return categoriesRemoved;
    });

    return events;
  }
}

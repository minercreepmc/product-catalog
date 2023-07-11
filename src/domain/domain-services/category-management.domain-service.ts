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

@Injectable()
export class CategoryManagementDomainService {
  constructor(
    @Inject(unitOfWorkDiToken)
    private readonly unitOfWork: UnitOfWorkPort,
    @Inject(categoryRepositoryDiToken)
    private readonly categoryRepository: CategoryRepositoryPort,
    private readonly categoryVerification: CategoryVerificationDomainService,
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
    return this.unitOfWork.runInTransaction(async () => {
      await this.categoryVerification.verifyAddSubCategoriesOptions(options);

      const categoryAggregate = await this.categoryRepository.findOneById(
        options.categoryId,
      );

      const subCategoryAdded = categoryAggregate.addSubCategories(
        options.subCategoryIds,
      );
      await this.categoryRepository.save(categoryAggregate);

      return subCategoryAdded;
    });
  }

  async addParentCategories(options: AddParentCategoriesServiceOptions) {
    return this.unitOfWork.runInTransaction(async () => {
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
}

import {
  CategoryAggregate,
  CreateCategoryAggregateOptions,
} from '@aggregates/category';
import {
  categoryRepositoryDiToken,
  CategoryRepositoryPort,
} from '@domain-interfaces';
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

@Injectable()
export class CategoryManagementDomainService {
  constructor(
    @Inject(categoryRepositoryDiToken)
    private readonly categoryRepository: CategoryRepositoryPort,
    private readonly categoryVerification: CategoryVerificationDomainService,
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

    return subCategoryAdded;
  }

  async addParentCategories(options: AddParentCategoriesServiceOptions) {
    await this.categoryVerification.verifyAddParentCategoriesOptions(options);
  }
}

import {
  CategoryAggregate,
  CreateCategoryAggregateOptions,
} from '@aggregates/category';
import {
  categoryRepositoryDiToken,
  CategoryRepositoryPort,
} from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { CategoryIdValueObject } from '@value-objects/category';
import { CategoryVerificationDomainService } from './category-verification.domain-service';

export interface CreateCategoryOptions extends CreateCategoryAggregateOptions {}
export interface DoesParentIdsAndCategoryIdsOverlap {
  parentIds: CategoryIdValueObject[];
  subCategoryIds: CategoryIdValueObject[];
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
}

import {
  CategoryAggregate,
  CreateCategoryAggregateOptions,
} from '@aggregates/category';
import { CategoryDomainExceptions } from '@domain-exceptions/category/category.domain-exception';
import {
  categoryRepositoryDiToken,
  CategoryRepositoryPort,
} from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { CategoryNameValueObject } from '@value-objects/category';

export interface CreateCategoryOptions extends CreateCategoryAggregateOptions {}

@Injectable()
export class CategoryManagementDomainService {
  constructor(
    @Inject(categoryRepositoryDiToken)
    private readonly categoryRepository: CategoryRepositoryPort,
  ) {}

  async doesCategoryNameExist(name: CategoryNameValueObject): Promise<boolean> {
    const exist = await this.categoryRepository.findOneByName(name);
    return Boolean(exist);
  }

  async createCategory(options: CreateCategoryOptions) {
    const exist = await this.categoryRepository.findOneByName(options.name);
    if (exist) {
      throw new CategoryDomainExceptions.DoesNotExist();
    }

    const categoryAggregate = new CategoryAggregate();

    const categoryCreated = categoryAggregate.createCategory(options);
    await this.categoryRepository.save(categoryAggregate);

    return categoryCreated;
  }
}

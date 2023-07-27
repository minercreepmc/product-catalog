import {
  readonlyCategoryRepositoryDiToken,
  ReadOnlyCategoryRepositoryPort,
} from '@application/interface/category';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CategoryViewModel } from '../category.model';
import { CategoryQuery } from '../category.query';
import { GetCategoriesQuery } from './get-categories.query';

export class GetCategoriesResponseDto {
  categories: CategoryViewModel[];
}

@QueryHandler(GetCategoriesQuery)
export class GetCategoriesHandler
  implements IQueryHandler<CategoryQuery, GetCategoriesResponseDto>
{
  async execute(query: CategoryQuery): Promise<GetCategoriesResponseDto> {
    const categories = await this.categoryRepository.findAll(query);

    return {
      categories,
    };
  }

  constructor(
    @Inject(readonlyCategoryRepositoryDiToken)
    private readonly categoryRepository: ReadOnlyCategoryRepositoryPort,
  ) {}
}

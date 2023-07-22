import {
  readonlyCategoryRepositoryDiToken,
  ReadOnlyCategoryRepositoryPort,
} from '@application@/interface/category';
import { CategorySchema } from '@database/repositories/pg/category';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoryQuery } from './get-category.query';

export type GetCategoryResponseDto = CategorySchema;

@QueryHandler(GetCategoryQuery)
export class GetCategoryHandler implements IQueryHandler<GetCategoryQuery> {
  execute(query: GetCategoryQuery): Promise<GetCategoryResponseDto> {
    const { id } = query;
    return this.categoryRepository.findOneById(id);
  }

  constructor(
    @Inject(readonlyCategoryRepositoryDiToken)
    private readonly categoryRepository: ReadOnlyCategoryRepositoryPort,
  ) {}
}

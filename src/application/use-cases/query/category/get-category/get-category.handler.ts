import {
  readonlyCategoryRepositoryDiToken,
  ReadOnlyCategoryRepositoryPort,
} from '@application/interface/category';
import {
  CategorySchema,
  CategorySchemaWithProducts,
} from '@database/repositories/pg/category';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoryQuery } from './get-category.query';

export type GetCategoryResponseDto =
  | CategorySchema
  | CategorySchemaWithProducts;

@QueryHandler(GetCategoryQuery)
export class GetCategoryHandler
  implements IQueryHandler<GetCategoryQuery, GetCategoryResponseDto | null>
{
  execute(query: GetCategoryQuery): Promise<GetCategoryResponseDto | null> {
    const { id, populate_products } = query;

    if (!id) {
      return Promise.resolve(null);
    }

    if (populate_products) {
      return this.categoryRepository.findOneWithProducts(id);
    }

    return this.categoryRepository.findOneById(id);
  }

  constructor(
    @Inject(readonlyCategoryRepositoryDiToken)
    private readonly categoryRepository: ReadOnlyCategoryRepositoryPort,
  ) {}
}

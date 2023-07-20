import { CategorySchema } from '@database/repositories/pg/category';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoryQuery } from './get-category.query';

export type GetCategoryResponseDto = CategorySchema;

@QueryHandler(GetCategoryQuery)
export class GetCategoryHandler implements IQueryHandler<GetCategoryQuery> {
  execute(query: GetCategoryQuery): Promise<GetCategoryResponseDto> {
    // TODO: Pool
    throw new Error('Method not implemented.');
  }
}

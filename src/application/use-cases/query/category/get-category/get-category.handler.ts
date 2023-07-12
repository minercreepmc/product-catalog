import { CategoryMikroOrmModel } from '@database/repositories/mikroorm/category';
import { EntityManager } from '@mikro-orm/postgresql';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoryQuery } from './get-category.query';

export type GetCategoryResponseDto = CategoryMikroOrmModel;

@QueryHandler(GetCategoryQuery)
export class GetCategoryHandler implements IQueryHandler<GetCategoryQuery> {
  execute(query: GetCategoryQuery): Promise<GetCategoryResponseDto> {
    const { where, fields, offset } = query;
    return this.entityManager.findOne(CategoryMikroOrmModel, where, {
      fields,
      offset,
    });
  }

  constructor(private readonly entityManager: EntityManager) {}
}

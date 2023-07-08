import { CategoryMikroOrmModel } from '@database/repositories/mikroorm/category';
import { EntityManager } from '@mikro-orm/postgresql';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CategoryViewModel } from '../category.model';
import { CategoryQuery } from '../category.query';

export interface GetCategoriesResponseDto {
  categories: CategoryViewModel[];
}

@QueryHandler(CategoryQuery)
export class GetCategoriesHandler
  implements IQueryHandler<CategoryQuery, GetCategoriesResponseDto>
{
  async execute(query: CategoryQuery): Promise<GetCategoriesResponseDto> {
    const categories = await this.entityManager.find(
      CategoryMikroOrmModel,
      {},
      query,
    );
    return {
      categories,
    };
  }

  constructor(private readonly entityManager: EntityManager) {}
}

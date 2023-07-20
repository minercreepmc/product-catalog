import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CategoryViewModel } from '../category.model';
import { CategoryQuery } from '../category.query';
import { GetCategoriesQuery } from './get-categories.query';

export interface GetCategoriesResponseDto {
  categories: CategoryViewModel[];
}

@QueryHandler(GetCategoriesQuery)
export class GetCategoriesHandler
  implements IQueryHandler<CategoryQuery, GetCategoriesResponseDto>
{
  async execute(query: CategoryQuery): Promise<GetCategoriesResponseDto> {
    // TODO: Pool
    return {} as GetCategoriesResponseDto;
  }

  //constructor(private readonly entityManager: EntityManager) {}
}

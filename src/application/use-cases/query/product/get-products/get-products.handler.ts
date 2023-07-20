import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductViewModel } from '../product.model';
import { GetProductsQuery } from './get-products.query';

export type GetProductsResponseDto = {
  products: ProductViewModel[];
};

@QueryHandler(GetProductsQuery)
export class GetProductsQueryHandler
  implements IQueryHandler<GetProductsQuery, GetProductsResponseDto>
{
  async execute(query: GetProductsQuery): Promise<GetProductsResponseDto> {
    throw new Error('Method not implemented.');
  }

  //constructor(private readonly databaseService: DatabaseService) {}
}

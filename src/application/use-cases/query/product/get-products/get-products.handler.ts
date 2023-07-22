import {
  readOnlyProductRepositoryDiToken,
  ReadonlyProductRepositoryPort,
} from '@application@/interface/product';
import { Inject } from '@nestjs/common';
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
    const products = await this.repository.findAll(query);
    return {
      products,
    };
  }

  constructor(
    @Inject(readOnlyProductRepositoryDiToken)
    private readonly repository: ReadonlyProductRepositoryPort,
  ) {}
}

import {
  readOnlyProductRepositoryDiToken,
  ReadonlyProductRepositoryPort,
} from '@application/interface/product';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductViewModel } from './product.model';
import { ProductQuery } from './product.query';

export class GetProductsQuery extends ProductQuery {}

export type GetProductsResponseDto = {
  products: ProductViewModel[];
};

@QueryHandler(GetProductsQuery)
export class GetProductsQueryHandler
  implements IQueryHandler<GetProductsQuery, GetProductsResponseDto>
{
  async execute(query: GetProductsQuery): Promise<GetProductsResponseDto> {
    const { discount_id } = query;
    let products: ProductViewModel[] = [];

    if (discount_id) {
      products = await this.repository.findByDiscountId(discount_id);
    } else {
      products = await this.repository.findAll(query);
    }

    return {
      products,
    };
  }

  constructor(
    @Inject(readOnlyProductRepositoryDiToken)
    private readonly repository: ReadonlyProductRepositoryPort,
  ) {}
}

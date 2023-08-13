import {
  readOnlyProductRepositoryDiToken,
  ReadonlyProductRepositoryPort,
} from '@application/interface/product';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductViewModel } from './product.model';

export class GetProductsQuery {
  offset?: number;
  limit?: number;
  discount_id?: string;
  category_id?: string;
}

export type GetProductsResponseDto = {
  products: ProductViewModel[];
};

@QueryHandler(GetProductsQuery)
export class GetProductsQueryHandler
  implements IQueryHandler<GetProductsQuery, GetProductsResponseDto>
{
  async execute(query: GetProductsQuery): Promise<GetProductsResponseDto> {
    const { discount_id, category_id } = query;
    let products: ProductViewModel[] | null = [];

    if (discount_id) {
      products = await this.repository.findByDiscountId(discount_id);
    } else if (category_id) {
      products = await this.repository.findByCategoryId(category_id);
    } else {
      products = await this.repository.findAll(query);
    }

    return products ? { products } : { products: [] };
  }

  constructor(
    @Inject(readOnlyProductRepositoryDiToken)
    private readonly repository: ReadonlyProductRepositoryPort,
  ) {}
}

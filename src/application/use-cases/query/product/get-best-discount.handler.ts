import {
  readOnlyProductRepositoryDiToken,
  ReadonlyProductRepositoryPort,
} from '@application/interface/product';
import { ProductSchema } from '@database/repositories/pg/product';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetBestDiscountQuery {
  limit?: number;
  offset?: number;
}
export class GetBestDiscountResponse {
  products: ProductSchema[];
}

@QueryHandler(GetBestDiscountQuery)
export class GetBestDiscountHandler
  implements IQueryHandler<GetBestDiscountQuery, GetBestDiscountResponse>
{
  constructor(
    @Inject(readOnlyProductRepositoryDiToken)
    private readonly productRepository: ReadonlyProductRepositoryPort,
  ) {}
  async execute(query: GetBestDiscountQuery): Promise<GetBestDiscountResponse> {
    const products = await this.productRepository.findSortByBestSelling({
      limit: query.limit,
      offset: query.offset,
    });

    return {
      products,
    };
  }
}

import {
  readOnlyProductRepositoryDiToken,
  ReadonlyProductRepositoryPort,
} from '@application/interface/product';
import { ProductSchema } from '@database/repositories/pg/product';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetBestSellingQuery {
  limit?: number;
  offset?: number;
}
export class GetBestSellingResponseDto {
  products: ProductSchema[];
}

@QueryHandler(GetBestSellingQuery)
export class GetBestSellingHandler
  implements IQueryHandler<GetBestSellingQuery, GetBestSellingResponseDto>
{
  constructor(
    @Inject(readOnlyProductRepositoryDiToken)
    private readonly productRepository: ReadonlyProductRepositoryPort,
  ) {}
  async execute(
    query: GetBestSellingQuery,
  ): Promise<GetBestSellingResponseDto> {
    const products = await this.productRepository.findSortByBestSelling({
      limit: query.limit,
      offset: query.offset,
    });

    return {
      products,
    };
  }
}

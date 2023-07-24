import {
  readOnlyProductRepositoryDiToken,
  ReadonlyProductRepositoryPort,
} from '@application/interface/product';
import {
  ProductSchema,
  ProductWithDiscountSchema,
} from '@database/repositories/pg/product';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetProductQuery {
  id?: string;
  populate_discount?: boolean;
}

export type GetProductResponseDto = ProductSchema | ProductWithDiscountSchema;

@QueryHandler(GetProductQuery)
export class GetProductQueryHandler
  implements IQueryHandler<GetProductQuery, GetProductResponseDto>
{
  async execute(query: GetProductQuery): Promise<GetProductResponseDto> {
    const { id, populate_discount } = query;

    if (populate_discount) {
      const res = await this.repository.findByIdWithDiscount(id);
      console.log(res);
      return res;
    } else {
      return this.repository.findOneById(id);
    }
  }

  constructor(
    @Inject(readOnlyProductRepositoryDiToken)
    private readonly repository: ReadonlyProductRepositoryPort,
  ) {}
}

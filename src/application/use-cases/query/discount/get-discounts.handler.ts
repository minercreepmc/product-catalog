import {
  readOnlyDiscountRepositoryDiToken,
  ReadOnlyDiscountRepositoryPort,
} from '@application/interface/discount';
import { DiscountSchema } from '@database/repositories/pg/discount';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetDiscountsQuery {
  limit?: number;
  offset?: number;
}

export class GetDiscountsResponseDto {
  discounts: DiscountSchema[] | null;
}

@QueryHandler(GetDiscountsQuery)
export class GetDiscountsHandler
  implements IQueryHandler<GetDiscountsQuery, GetDiscountsResponseDto>
{
  constructor(
    @Inject(readOnlyDiscountRepositoryDiToken)
    private readonly discountRepository: ReadOnlyDiscountRepositoryPort,
  ) {}

  async execute(query: GetDiscountsQuery): Promise<GetDiscountsResponseDto> {
    const discounts = await this.discountRepository.findAll({
      limit: query.limit,
      offset: query.offset,
    });

    return {
      discounts,
    };
  }
}

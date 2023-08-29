import {
  readOnlyDiscountRepositoryDiToken,
  ReadOnlyDiscountRepositoryPort,
} from '@application/interface/discount';
import { DiscountSchema } from '@database/repositories/pg/discount';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetDiscountQuery {
  id: string;
}

export type GetDiscountResponseDto = DiscountSchema | null;

@QueryHandler(GetDiscountQuery)
export class GetDiscountHandler
  implements IQueryHandler<GetDiscountQuery, GetDiscountResponseDto>
{
  constructor(
    @Inject(readOnlyDiscountRepositoryDiToken)
    private readonly discountRepository: ReadOnlyDiscountRepositoryPort,
  ) {}

  async execute(query: GetDiscountQuery): Promise<GetDiscountResponseDto> {
    const discount = await this.discountRepository.findOneById(query.id);
    return discount;
  }
}

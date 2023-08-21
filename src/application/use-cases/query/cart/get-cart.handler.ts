import { PaginationParams } from '@api/http';
import {
  readOnlyCartRepositoryDiToken,
  ReadonlyCartRepositoryPort,
} from '@application/interface/product';
import { CartDetailsSchema } from '@database/repositories/pg/cart';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetCartQuery extends PaginationParams {
  userId: string;
}
export type GetCartResponseDto = CartDetailsSchema;

@QueryHandler(GetCartQuery)
export class GetCartQueryHandler
  implements IQueryHandler<GetCartQuery, GetCartResponseDto>
{
  constructor(
    @Inject(readOnlyCartRepositoryDiToken)
    private readonly cartRepository: ReadonlyCartRepositoryPort,
  ) {}

  execute(query: GetCartQuery): Promise<GetCartResponseDto> {
    return this.cartRepository.findOneWithItems(query.userId);
  }
}

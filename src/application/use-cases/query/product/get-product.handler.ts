import {
  readOnlyProductRepositoryDiToken,
  ReadonlyProductRepositoryPort,
} from '@application/interface/product';
import { ProductSchema } from '@database/repositories/pg/product';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductQuery } from './product.query';

export class GetProductQuery extends ProductQuery {}
export class GetProductResponseDto extends ProductSchema {}

@QueryHandler(GetProductQuery)
export class GetProductQueryHandler
  implements IQueryHandler<GetProductQuery, GetProductResponseDto>
{
  async execute(query: GetProductQuery): Promise<GetProductResponseDto> {
    return this.repository.findOneById(query.id);
  }

  constructor(
    @Inject(readOnlyProductRepositoryDiToken)
    private readonly repository: ReadonlyProductRepositoryPort,
  ) {}
}

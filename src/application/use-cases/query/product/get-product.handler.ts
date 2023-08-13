import {
  readOnlyProductRepositoryDiToken,
  ReadonlyProductRepositoryPort,
} from '@application/interface/product';
import {
  ProductSchema,
  ProductWithDetailsSchema,
} from '@database/repositories/pg/product';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetProductQuery {
  id?: string;
  populate_details?: boolean;
}

export type GetProductResponseDto = ProductSchema | ProductWithDetailsSchema;

@QueryHandler(GetProductQuery)
export class GetProductQueryHandler
  implements IQueryHandler<GetProductQuery, GetProductResponseDto | null>
{
  async execute(query: GetProductQuery): Promise<GetProductResponseDto | null> {
    const { id, populate_details } = query;

    if (!id) {
      return Promise.resolve(null);
    }

    if (populate_details) return this.repository.findByIdWithDetails(id);
    else return this.repository.findOneById(id);
  }

  constructor(
    @Inject(readOnlyProductRepositoryDiToken)
    private readonly repository: ReadonlyProductRepositoryPort,
  ) {}
}

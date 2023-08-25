import {
  readonlyOrderRepositoryDiToken,
  ReadOnlyOrderRepositoryPort,
} from '@application/interface/order';
import { OrderSchema } from '@database/repositories/pg/order';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetOrderQuery {
  id: string;
}
export type GetOrderResponseDto = OrderSchema;

@QueryHandler(GetOrderQuery)
export class GetOrderHandler
  implements IQueryHandler<GetOrderQuery, GetOrderResponseDto | null>
{
  constructor(
    @Inject(readonlyOrderRepositoryDiToken)
    private readonly orderRepository: ReadOnlyOrderRepositoryPort,
  ) {}
  async execute(query: GetOrderQuery): Promise<GetOrderResponseDto | null> {
    return this.orderRepository.findOneById(query.id);
  }
}

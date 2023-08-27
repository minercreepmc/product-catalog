import {
  readonlyOrderRepositoryDiToken,
  ReadOnlyOrderRepositoryPort,
} from '@application/interface/order';
import { OrderSchema } from '@database/repositories/pg/order';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetOrdersQuery {
  userId: string;
  limit?: number;
  offset?: number;
}
export type GetOrdersResponseDto = {
  orders: OrderSchema[];
};

@QueryHandler(GetOrdersQuery)
export class GetOrdersHandler
  implements IQueryHandler<GetOrdersQuery, GetOrdersResponseDto | null>
{
  constructor(
    @Inject(readonlyOrderRepositoryDiToken)
    private readonly orderRepository: ReadOnlyOrderRepositoryPort,
  ) {}
  async execute(query: GetOrdersQuery): Promise<GetOrdersResponseDto | null> {
    const { limit, offset, userId } = query;
    const orders = await this.orderRepository.findByUserId(userId, {
      limit,
      offset,
    });

    return orders && orders.length > 0 ? { orders } : null;
  }
}

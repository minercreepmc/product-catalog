import {
  readonlyOrderRepositoryDiToken,
  ReadOnlyOrderRepositoryPort,
} from '@application/interface/order';
import { OrderSchema } from '@database/repositories/pg/order';
import { Inject } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';

export class GetOrdersByUserQuery {
  limit?: number;
  offset?: number;
  userId: string;
}
export class GetOrdersByUserResponseDto {
  orders: OrderSchema[];
}

export class GetOrdersByUserHandler
  implements
    IQueryHandler<GetOrdersByUserQuery, GetOrdersByUserResponseDto | null>
{
  constructor(
    @Inject(readonlyOrderRepositoryDiToken)
    private readonly orderRepository: ReadOnlyOrderRepositoryPort,
  ) {}
  async execute(
    query: GetOrdersByUserQuery,
  ): Promise<GetOrdersByUserResponseDto | null> {
    const { limit, offset, userId } = query;

    const orders = await this.orderRepository.findByUserId(userId, {
      limit,
      offset,
    });

    return orders && orders.length > 0 ? { orders } : null;
  }
}

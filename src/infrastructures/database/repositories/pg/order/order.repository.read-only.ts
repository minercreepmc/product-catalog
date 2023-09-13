import { PaginationParams } from '@api/http';
import { ReadOnlyOrderRepositoryPort } from '@application/interface/order';
import { DatabaseService } from '@config/pg';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { OrderSchema } from './order.schema';

@Injectable()
export class ReadOnlyOrderRepository implements ReadOnlyOrderRepositoryPort {
  constructor(private readonly databaseService: DatabaseService) {}
  async findOneById(id: string): Promise<OrderSchema | null> {
    const res = await this.databaseService.runQuery(
      `
        SELECT *, array_agg(product_id) as product_ids FROM orders
        JOIN product_orders ON orders.id = product_orders.order_id
        WHERE id = $1
        GROUP BY orders.id, product_orders.product_id, product_orders.order_id
      `,
      [id],
    );

    const found = res.rows[0];

    return found ? plainToInstance(OrderSchema, found) : null;
  }
  async findAll(filter: PaginationParams): Promise<OrderSchema[]> {
    const res = await this.databaseService.runQuery(
      `
      SELECT orders.total_price, orders.status, orders.id, orders.user_id, orders.updated_at, array_agg(product_orders.product_id) as product_ids FROM orders
      JOIN product_orders ON orders.id = product_orders.order_id
      GROUP BY orders.id
      ORDER BY updated_at ASC
      OFFSET $1 LIMIT $2
    `,
      [filter.offset, filter.limit],
    );

    return res.rows;
  }

  async findByUserId(
    userId: string,
    filter?: PaginationParams | undefined,
  ): Promise<OrderSchema[] | null> {
    const res = await this.databaseService.runQuery(
      `
          SELECT orders.total_price, orders.status, orders.id, orders.user_id, orders.updated_at, array_agg(product_orders.product_id) as product_ids FROM orders 
          JOIN product_orders ON orders.id = product_orders.order_id
          WHERE user_id = $1
          GROUP BY orders.id
          ORDER BY updated_at ASC
          OFFSET $2 LIMIT $3;
      `,
      [userId, filter?.offset, filter?.limit],
    );

    return res.rows;
  }
}

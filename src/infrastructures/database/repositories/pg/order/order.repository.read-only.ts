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
        SELECT * FROM orders WHERE id = $1;
      `,
      [id],
    );

    const found = res.rows[0];

    return found ? plainToInstance(OrderSchema, found) : null;
  }
  findAll(filter: PaginationParams): Promise<OrderSchema[]> {
    throw new Error('Method not implemented.');
  }

  async findByUserId(
    userId: string,
    filter?: PaginationParams | undefined,
  ): Promise<OrderSchema[] | null> {
    const res = await this.databaseService.runQuery(
      `
        SELECT * FROM orders 
        WHERE user_id = $1
        ORDER BY updated_at ASC
        OFFSET $2 LIMIT $3;
      `,
      [userId, filter?.offset, filter?.limit],
    );

    return res.rows;
  }
}

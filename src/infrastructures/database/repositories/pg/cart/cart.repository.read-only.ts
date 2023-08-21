import { ReadonlyCartRepositoryPort } from '@application/interface/product';
import { ReadonlyRepositoryBase } from '@base/database/repositories/pg';
import { PaginationParams } from '@base/use-cases/query-handler';
import { DatabaseService } from '@config/pg';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CartDetailsSchema, CartSchema } from './cart.schema';

@Injectable()
export class ReadOnlyCartRepository
  extends ReadonlyRepositoryBase<CartSchema>
  implements ReadonlyCartRepositoryPort
{
  constructor(databaseService: DatabaseService) {
    super({
      databaseService,
    });
  }

  findOneById(id: string): Promise<CartSchema | null> {
    throw new Error('Method not implemented.');
  }
  findAll(filter: PaginationParams): Promise<CartSchema[] | null> {
    throw new Error('Method not implemented.');
  }

  async findOneWithItems(userId: string): Promise<CartDetailsSchema> {
    const res = await this.databaseService.runQuery(
      `
        SELECT cart.id, cart.user_id,
               CASE
                   WHEN COUNT(cart_item.*) > 0 THEN to_json(array_agg(cart_item.*))
                   ELSE '[]'::json
               END as items
        FROM cart
        LEFT OUTER JOIN cart_item ON cart.id = cart_item.cart_id
        WHERE cart.user_id = $1
        GROUP BY cart.id, cart.user_id;
      `,
      [userId],
    );

    console.log(res.rows[0]);
    return plainToInstance(CartDetailsSchema, res.rows[0]);
  }
}

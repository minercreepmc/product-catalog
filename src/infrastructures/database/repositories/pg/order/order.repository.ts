import { OrderAggregate } from '@aggregates/order';
import { RepositoryBase } from '@base/database/repositories/pg';
import { ID } from '@base/domain';
import { DatabaseService } from '@config/pg';
import { OrderRepositoryPort } from '@domain-interfaces/database/order-repository.interface';
import { Injectable } from '@nestjs/common';
import {
  OrderIdValueObject,
  OrderStatusValueObject,
} from '@value-objects/order';
import { OrderSchema } from './order.schema';
import { OrderSchemaMapper } from './order.schema.mapper';

@Injectable()
export class OrderRepository
  extends RepositoryBase<OrderAggregate, OrderSchema>
  implements OrderRepositoryPort
{
  constructor(databaseService: DatabaseService, mapper: OrderSchemaMapper) {
    super({
      databaseService,
      mapper,
    });
  }

  async create(entity: OrderAggregate): Promise<OrderAggregate | null> {
    const model = this.mapper.toPersistance(entity);

    const { id, status, user_id, cart_id, address } = model;

    const res = await this.databaseService.runQuery(
      `
      INSERT INTO orders (id, status, user_id, cart_id, address)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
      [id, status, user_id, cart_id, address],
    );

    const created = res.rows[0];

    return created ? this.mapper.toDomain(created) : null;
  }

  async updateStatusById(
    id: OrderIdValueObject,
    status: OrderStatusValueObject,
  ): Promise<OrderAggregate | null> {
    const model = this.mapper.toPersistance({ id, status });

    const res = await this.databaseService.runQuery(
      `
        UPDATE orders
        SET status = $1
        WHERE id = $2 RETURNING *;
      `,
      [model.status, model.id],
    );

    const updated = res.rows[0];

    return updated ? this.mapper.toDomain(updated) : null;
  }

  deleteOneById(id: ID): Promise<OrderAggregate | null> {
    throw new Error('Method not implemented.');
  }
  findOneById(id: ID): Promise<OrderAggregate | null> {
    throw new Error('Method not implemented.');
  }
  updateOneById(
    id: ID,
    newState: OrderAggregate,
  ): Promise<OrderAggregate | null> {
    throw new Error('Method not implemented.');
  }
  deleteManyByIds(ids: ID[]): Promise<OrderAggregate[] | null> {
    throw new Error('Method not implemented.');
  }
}

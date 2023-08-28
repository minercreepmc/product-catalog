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

    const { id, status, user_id, address, total_price, product_ids } = model;

    const res = await this.databaseService.runQuery(
      `
        INSERT INTO orders (id, status, user_id, address, total_price)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `,

      [id, status, user_id, address, total_price],
    );

    const created = res.rows[0];

    const addProductsRes = await this.databaseService.runQuery(
      `
        INSERT INTO product_orders (order_id, product_id)
        SELECT $1, unnest($2::varchar[]) AS product_ids
        RETURNING product_id as product_ids
      `,
      [created.id, product_ids],
    );

    created.product_ids = addProductsRes.rows[0]?.product_ids;

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

  async findOneById(id: OrderIdValueObject): Promise<OrderAggregate | null> {
    const model = this.mapper.toPersistance({ id });
    const res = await this.databaseService.runQuery(
      `
        SELECT *, ARRAY[product_orders.product_id] as product_ids FROM orders
        JOIN product_orders ON orders.id = product_orders.order_id
        WHERE id = $1;
      `,
      [model.id],
    );

    const found = res.rows[0];

    return found ? this.mapper.toDomain(found) : null;
  }
  async updateOneById(
    id: OrderIdValueObject,
    newState: OrderAggregate,
  ): Promise<OrderAggregate | null> {
    const model = this.mapper.toPersistance({
      ...newState,
      id,
    });
    const res = await this.databaseService.runQuery(
      `
        UPDATE orders 
        SET address = $1, status = $2
        WHERE id = $3 RETURNING *;
      `,
      [model.address, model.status, model.id],
    );

    const updated = res.rows[0];

    return updated ? this.mapper.toDomain(updated) : null;
  }

  deleteOneById(id: ID): Promise<OrderAggregate | null> {
    throw new Error('Method not implemented.');
  }

  deleteManyByIds(ids: ID[]): Promise<OrderAggregate[] | null> {
    throw new Error('Method not implemented.');
  }
}

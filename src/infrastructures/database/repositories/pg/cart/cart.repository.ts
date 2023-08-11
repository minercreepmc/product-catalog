import { CartAggregate } from '@aggregates/cart';
import { ID } from '@base/domain';
import { DatabaseService } from '@config/pg';
import { CartRepositoryPort } from '@domain-interfaces';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CartSchema } from './cart.schema';
import { CartSchemaMapper } from './cart.schema.mapper';

@Injectable()
export class CartRepository implements CartRepositoryPort {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mapper: CartSchemaMapper,
  ) {}
  async create(entity: CartAggregate): Promise<CartAggregate> {
    const model = this.mapper.toPersistance(entity);
    const res = await this.databaseService.runQuery(
      `
        INSERT INTO cart (id, user_id) VALUES ($1, $2) RETURNING *;
      `,
      [model.id, model.userId],
    );

    const cart = plainToInstance(CartSchema, res.rows[0]);

    return cart ? this.mapper.toDomain(cart) : null;
  }

  async deleteOneById(id: any): Promise<CartAggregate> {
    const query = this.mapper.toPersistance({ id });

    const res = await this.databaseService.runQuery(
      `DELETE FROM cart WHERE id=$1 RETURNING *`,
      [query.id],
    );

    const deleted = res.rows[0];

    return deleted ? this.mapper.toDomain(deleted) : null;
  }

  async findOneById(id: ID): Promise<CartAggregate> {
    const query = this.mapper.toPersistance({ id });

    const res = await this.databaseService.runQuery(
      `SELECT * from category WHERE id=$1`,
      [query.id],
    );

    const deleted = res.rows[0];

    return deleted ? this.mapper.toDomain(deleted) : null;
  }
  updateOneById(id: any, newState: CartAggregate): Promise<CartAggregate> {
    throw new Error('Method not implemented.');
  }
  deleteManyByIds(ids: ID[]): Promise<CartAggregate[]> {
    throw new Error('Method not implemented.');
  }
}

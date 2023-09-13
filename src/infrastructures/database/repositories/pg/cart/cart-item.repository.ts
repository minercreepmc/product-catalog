import { ID } from '@base/domain';
import { DatabaseService } from '@config/pg';
import { RepositoryPort } from '@domain-interfaces';
import { CartItemEntity } from '@entities';
import { Injectable } from '@nestjs/common';
import { CartIdValueObject, CartItemIdValueObject } from '@value-objects/cart';
import { plainToInstance } from 'class-transformer';
import { CartItemSchema } from './cart-item.schema';
import { CartItemSchemaMapper } from './cart-item.schema.mapper';

@Injectable()
export class CartItemRepository implements RepositoryPort<CartItemEntity> {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mapper: CartItemSchemaMapper,
  ) {}

  async create(entity: CartItemEntity): Promise<CartItemEntity | null> {
    const model = this.mapper.toPersistance(entity);
    const res = await this.databaseService.runQuery(
      `
        INSERT INTO cart_item (id, cart_id, product_id, amount, discount, name, image_url, price, total_price) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *;
      `,
      [
        model.id,
        model.cart_id,
        model.product_id,
        model.amount,
        model.discount,
        model.name,
        model.image_url,
        model.price,
        model.total_price,
      ],
    );

    const cart = plainToInstance(CartItemSchema, res.rows[0]);

    return cart ? this.mapper.toDomain(cart) : null;
  }

  async deleteOneById(id: any): Promise<CartItemEntity | null> {
    const query = this.mapper.toPersistance({ id });

    const res = await this.databaseService.runQuery(
      `DELETE FROM cart_item WHERE id=$1 RETURNING *`,
      [query.id],
    );

    const deleted = res.rows[0];

    return deleted ? this.mapper.toDomain(deleted) : null;
  }
  async findOneById(id: ID): Promise<CartItemEntity | null> {
    const query = this.mapper.toPersistance({ id });

    const res = await this.databaseService.runQuery(
      `SELECT * from cart_item WHERE id=$1`,
      [query.id],
    );

    const deleted = res.rows[0];
    return deleted ? this.mapper.toDomain(deleted) : null;
  }
  async updateOneById(
    id: CartItemIdValueObject,
    newState: CartItemEntity,
  ): Promise<CartItemEntity | null> {
    const query = this.mapper.toPersistance({
      ...newState,
      id,
    });

    const res = await this.databaseService.runQuery(
      `
      UPDATE cart_item SET amount=$1, discount=$3, name=$4, price=$5, total_price=$6  WHERE id=$2 RETURNING *;
    `,
      [
        query.amount,
        query.id,
        query.discount,
        query.name,
        query.price,
        query.total_price,
      ],
    );

    const deleted = res.rows[0];

    return deleted ? this.mapper.toDomain(deleted) : null;
  }

  async updateOneByCartId(
    cartId: CartIdValueObject,
    newState: CartItemEntity,
  ): Promise<CartItemEntity | null> {
    const query = this.mapper.toPersistance({ ...newState, cartId });

    const res = await this.databaseService.runQuery(
      `
      UPDATE cart_item SET amount=$1, discount=$3, name=$4, price=$5, total_price=$6 WHERE cart_id=$2 RETURNING *;
    `,
      [
        query.amount,
        query.cart_id,
        query.discount,
        query.name,
        query.price,
        query.total_price,
      ],
    );

    const updated = res.rows[0];

    return updated ? this.mapper.toDomain(updated) : null;
  }

  async deleteManyByIds(
    ids: CartItemIdValueObject[],
  ): Promise<CartItemEntity[]> {
    const deleteds: CartItemEntity[] = [];

    for (const id of ids) {
      const deleted = await this.deleteOneById(id);
      if (deleted) {
        deleteds.push(deleted);
      } else {
        break;
      }
    }

    return deleteds ? deleteds : [];
  }

  async getByCartId(cartId: CartIdValueObject): Promise<CartItemEntity[]> {
    const query = this.mapper.toPersistance({ cartId });

    const res = await this.databaseService.runQuery(
      `
      SELECT * from cart_item WHERE cart_id=$1;
      `,
      [query.cart_id],
    );

    const items = res.rows;

    return items ? items.map((item) => this.mapper.toDomain(item)) : [];
  }
}

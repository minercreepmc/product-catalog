import { CartAggregate } from '@aggregates/cart';
import { ID } from '@base/domain';
import { DatabaseService } from '@config/pg';
import { CartRepositoryPort } from '@domain-interfaces';
import { Injectable } from '@nestjs/common';
import { CartIdValueObject } from '@value-objects/cart';
import { UserIdValueObject } from '@value-objects/user';
import { plainToInstance } from 'class-transformer';
import { CartItemRepository } from './cart-item.repository';
import { CartSchema } from './cart.schema';
import { CartSchemaMapper } from './cart.schema.mapper';

@Injectable()
export class CartRepository implements CartRepositoryPort {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cartItemRepository: CartItemRepository,
    private readonly mapper: CartSchemaMapper,
  ) {}
  async create(entity: CartAggregate): Promise<CartAggregate | null> {
    console.log('hey');
    const model = this.mapper.toPersistance(entity);
    const res = await this.databaseService.runQuery(
      `
        INSERT INTO cart (id, user_id) VALUES ($1, $2) RETURNING *;
      `,
      [model.id, model.user_id],
    );

    const cart = plainToInstance(CartSchema, res.rows[0]);

    return cart ? this.mapper.toDomain(cart) : null;
  }

  async deleteOneById(id: CartIdValueObject): Promise<CartAggregate | null> {
    const query = this.mapper.toPersistance({ id });

    const res = await this.databaseService.runQuery(
      `DELETE FROM cart WHERE id=$1 RETURNING *`,
      [query.id],
    );

    const deleted = res.rows[0];

    return deleted ? this.mapper.toDomain(deleted) : null;
  }

  async findOneById(id: ID): Promise<CartAggregate | null> {
    const query = this.mapper.toPersistance({ id });

    const res = await this.databaseService.runQuery(
      `SELECT * from cart WHERE id=$1 AND deleted_at IS NULL`,
      [query.id],
    );

    const model = res.rows[0];
    return model ? this.mapper.toDomain(model) : null;
  }

  async deleteManyByIds(ids: ID[]): Promise<CartAggregate[] | null> {
    const deleteds: CartAggregate[] = [];

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

  async updateOneById(
    id: CartIdValueObject,
    newState: CartAggregate,
  ): Promise<any> {
    const existingCartItems = await this.cartItemRepository.getByCartId(id);

    const newCartItems = Array.from(newState.items.values());

    for (const newCartItem of newCartItems) {
      const existingCartItem = existingCartItems.find(
        (item) => item.productId.value === newCartItem.productId.value,
      );

      if (existingCartItem) {
        if (existingCartItem.amount !== newCartItem.amount) {
          await this.cartItemRepository.updateOneById(
            existingCartItem.id,
            newCartItem,
          );
        }
      } else {
        await this.cartItemRepository.create(newCartItem);
      }
    }

    for (const existingCartItem of existingCartItems) {
      if (
        !newCartItems.some(
          (item) => item.productId.value === existingCartItem.productId.value,
        )
      ) {
        await this.cartItemRepository.deleteOneById(existingCartItem.id);
      }
    }
  }

  async findOneByUserId(
    userId: UserIdValueObject,
  ): Promise<CartAggregate | null> {
    const data = this.mapper.toPersistance({ userId });

    const res = await this.databaseService.runQuery(
      `
        SELECT * FROM cart
        WHERE user_id=$1 AND deleted_at IS NULL
      `,
      [data.user_id],
    );

    return res.rows[0] ? this.mapper.toDomain(res.rows[0]) : null;
  }
  async updateOneByUserId(
    userId: UserIdValueObject,
    newCart: CartAggregate,
  ): Promise<void> {
    const existingCart = await this.findOneByUserId(userId);
    const existingCartItems = await this.cartItemRepository.getByCartId(
      existingCart!.id,
    );

    const newCartItems = Array.from(newCart.items.values());

    for (const newCartItem of newCartItems) {
      const existingCartItem = existingCartItems.find(
        (item) => item.productId.value === newCartItem.productId.value,
      );

      if (existingCartItem) {
        if (existingCartItem.amount !== newCartItem.amount) {
          await this.cartItemRepository.updateOneById(
            existingCartItem.id,
            newCartItem,
          );
        }
      } else {
        await this.cartItemRepository.create(newCartItem);
      }
    }

    for (const existingCartItem of existingCartItems) {
      if (
        !newCartItems.some(
          (item) => item.productId.value === existingCartItem.productId.value,
        )
      ) {
        await this.cartItemRepository.deleteOneById(existingCartItem.id);
      }
    }
  }
}

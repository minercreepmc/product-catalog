import { ID } from '@base/domain';
import { DatabaseService } from '@config/pg';
import { RepositoryPort } from '@domain-interfaces';
import { CartItemEntity } from '@entities';
import { Injectable } from '@nestjs/common';
import { CartIdValueObject, CartItemIdValueObject } from '@value-objects/cart';
import { plainToInstance } from 'class-transformer';
import { CartItemDetailsSchema } from './cart-item.schema';
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
        INSERT INTO cart_item (id, cart_id, product_id, amount, total_price) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *;
      `,
      [
        model.id,
        model.cart_id,
        model.product_id,
        model.amount,
        model.total_price,
      ],
    );

    let cartItem = plainToInstance(CartItemDetailsSchema, res.rows[0]);
    cartItem = await this.addDetails(cartItem);

    return cartItem ? this.mapper.toDomain(cartItem) : null;
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
      UPDATE cart_item SET amount=$1, total_price=$3  WHERE id=$2 RETURNING *;
    `,
      [query.amount, query.id, query.total_price],
    );

    let updated = plainToInstance(CartItemDetailsSchema, res.rows[0]);
    updated = await this.addDetails(updated);
    return updated ? this.mapper.toDomain(updated) : null;
  }

  async updateOneByCartId(
    cartId: CartIdValueObject,
    newState: CartItemEntity,
  ): Promise<CartItemEntity | null> {
    const query = this.mapper.toPersistance({ ...newState, cartId });

    const res = await this.databaseService.runQuery(
      `
      UPDATE cart_item SET amount=$1, total_price=$2 WHERE cart_id=$3 RETURNING *;
    `,
      [query.amount, query.total_price, query.cart_id],
    );

    let updated = plainToInstance(CartItemDetailsSchema, res.rows[0]);
    updated = await this.addDetails(updated);

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

  private async addDetails(cartItem: CartItemDetailsSchema) {
    cartItem.product = await this.getProduct(cartItem.product_id);
    if (cartItem.product.discount_id) {
      cartItem.discount = await this.getDiscount(cartItem.product.discount_id);
    }
    return cartItem;
  }

  private async getProduct(productId: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT * from product WHERE id=$1
    `,
      [productId],
    );

    const product = res.rows[0];

    return product;
  }

  private async getDiscount(discountId: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT * from discount WHERE id=$1
    `,
      [discountId],
    );

    const discount = res.rows[0];

    return discount;
  }
}

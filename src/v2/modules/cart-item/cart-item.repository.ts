import { DatabaseService } from '@config/database';
import { Injectable } from '@nestjs/common';
import { CreateCartItemDto, UpdateCartItemDto } from './dtos';

@Injectable()
export class CartItemRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateCartItemDto) {
    const { cartId, productId, amount } = dto;
    const res = await this.databaseService.runQuery(
      `
        INSERT INTO cart_item (cart_id, product_id, amount) VALUES ($1, $2, $3) RETURNING *;
      `,
      [cartId, productId, amount],
    );

    return res.rows[0];
  }

  async update(cartItemId: string, dto: UpdateCartItemDto) {
    const { amount } = dto;

    const res = await this.databaseService.runQuery(
      `
        UPDATE cart_item SET amount=$1 WHERE id=$2 RETURNING *;
      `,
      [amount, cartItemId],
    );

    return res.rows[0];
  }

  async delete(cartItemId: string) {
    const res = await this.databaseService.runQuery(
      `
        DELETE FROM cart_item WHERE id=$1 RETURNING *;
      `,
      [cartItemId],
    );

    return res.rows[0];
  }
}

import { DatabaseService } from '@config/database';
import { Injectable } from '@nestjs/common';
import {
  CreateCartItemDto,
  UpdateCartItemDto,
  UpsertCartItemDto,
} from './dtos';

@Injectable()
export class CartItemRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userId: string, dto: CreateCartItemDto) {
    const { productId, amount } = dto;
    const res = await this.databaseService.runQuery(
      `
        INSERT INTO cart_item (cart_id, product_id, amount) VALUES ((
          SELECT id FROM cart
          WHERE user_id = $1
        ), $2, $3) RETURNING *;
      `,
      [userId, productId, amount],
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

  async upsert(dto: UpsertCartItemDto) {
    const { productId, amount } = dto;

    const res = await this.databaseService.runQuery(
      `
        INSERT INTO cart_item (product_id, amount) 
        VALUES ($1, $2) 
          ON CONFLICT (product_id) 
        DO UPDATE SET amount = cart_item.amount + $3
        RETURNING *;
      `,
      [productId, amount, amount],
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

  async findByUserId(userId: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT 
          i.id, i.amount,
          p.id as product_id, p.name as product_name, p.price as product_price,  
        d.id as discount_id, d.name as discount_name, d.percentage as discount_percentage
        FROM cart_item i 
        INNER JOIN product p ON p.id = i.product_id
        LEFT JOIN discount d ON d.id = p.discount_id
        WHERE cart_id = (
          SELECT id FROM cart WHERE user_id = $1
        );
      `,
      [userId],
    );

    return res.rows;
  }
}

import { DatabaseService } from '@config/database';
import { Injectable, NotFoundException } from '@nestjs/common';
import { randomString } from '@utils/functions';

@Injectable()
export class CartRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userId: string) {
    const res = await this.databaseService.runQuery(
      `
        INSERT INTO cart (id, user_id, total_price)
        VALUES ($1, $2, $3) 
        RETURNING *;
      `,
      [randomString(), userId, 0],
    );

    return res.rows[0];
  }

  async getByUserId(userId: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT id FROM cart WHERE user_id=$1
      `,
      [userId],
    );

    const cartId = res.rows[0]?.id;

    if (!cartId) {
      throw new NotFoundException('Cart not found');
    }

    const items = await this.getItems(cartId);

    return { id: cartId, items };
  }

  private async getItems(cartId: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT item.id, item.amount, product.id as product_id, product.name as product_name, product.price as product_price,
        discount.id as discount_id, discount.name as discount_name, discount.percentage as discount_percentage
        FROM cart_item item 
        INNER JOIN product product ON product.id = item.product_id
        LEFT JOIN discount discount ON discount.id = product.discount_id
        WHERE cart_id=$1
      `,
      [cartId],
    );

    return res.rows;
  }
}

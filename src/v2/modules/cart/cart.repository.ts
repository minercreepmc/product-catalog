import { DatabaseService } from '@config/database';
import { Injectable, NotFoundException } from '@nestjs/common';
import { randomString } from '@utils/functions';
import { DefaultCatch } from 'catch-decorator-ts';
import { CartRO } from './ro';

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
        SELECT * FROM cart WHERE user_id=$1
      `,
      [userId],
    );

    const cart: CartRO = res.rows[0];

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.items = await this.getItems(cart.id);
    cart.total_price = await this.getTotalPrice(cart.id);
    return cart;
  }

  async getItems(cartId: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT item.id, item.amount, product.id as product_id, product.name as product_name, product.price as product_price,
        discount.id as discount_id, discount.name as discount_name, discount.percentage as discount_percentage
        FROM cart_item item 
        INNER JOIN product product ON product.id = item.product_id
        LEFT JOIN discount discount ON discount.id = product.discount_id
        WHERE cart_id=$1;
      `,
      [cartId],
    );

    return res.rows;
  }

  @DefaultCatch((err) => {
    console.log('Cannot get total price', err);
    throw err;
  })
  async getTotalPrice(cartId: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT SUM(f.fee + (p.price - (p.price * COALESCE(d.percentage, 0) / 100)) * i.amount)
      FROM cart_item i
      LEFT JOIN cart c ON c.id = $1 
      LEFT JOIN shipping_fee f ON f.id = c.shipping_fee_id 
      INNER JOIN product p ON p.id = i.product_id
      LEFT JOIN discount d ON d.id = p.discount_id
      WHERE i.cart_id = $1;
    `,
      [cartId],
    );

    return res.rows[0].sum;
  }
}

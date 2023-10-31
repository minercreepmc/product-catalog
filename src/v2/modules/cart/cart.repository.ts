import { DatabaseService } from '@config/database';
import { Injectable } from '@nestjs/common';
import { DefaultCatch } from 'catch-decorator-ts';
import { UpdateCartDto } from './dto';

@Injectable()
export class CartRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userId: string) {
    const res = await this.databaseService.runQuery(
      `
        INSERT INTO cart (user_id)
        VALUES ($1) 
        RETURNING *;
      `,
      [userId],
    );

    return res.rows[0];
  }

  async update(userId: string, dto: UpdateCartDto) {
    const res = await this.databaseService.runQuery(
      `
        UPDATE cart
        SET 
          shipping_fee_id = COALESCE($2, shipping_fee_id),
          address_id = COALESCE($3, address_id)
        WHERE user_id = $1
        RETURNING *;
      `,
      [userId, dto.shippingFeeId, dto.addressId],
    );

    return res.rows[0];
  }

  async getByUserId(userId: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT c.*, f.fee as shipping_fee
        FROM cart c 
        LEFT JOIN shipping_fee f ON f.id = c.shipping_fee_id
        WHERE c.user_id=$1
      `,
      [userId],
    );

    return res.rows[0];
  }

  async getItems(cartId: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT item.id as item_id, 
               item.amount, 
               product.id as product_id, 
               product.name as product_name, 
               product.price as product_price,
               discount.id as discount_id, 
               discount.name as discount_name, 
               discount.percentage as discount_percentage
        FROM cart_item item 
        INNER JOIN product product ON product.id = item.product_id
        LEFT JOIN discount discount ON discount.id = product.discount_id
        WHERE item.cart_id = $1;
      `,
      [cartId],
    );

    return res.rows;
  }

  async clearCart(cartId: string) {
    await this.databaseService.runQuery(
      `
        DELETE FROM cart_item 
        WHERE cart_id = $1;
      `,
      [cartId],
    );

    await this.databaseService.runQuery(
      `
        UPDATE cart
        SET shipping_fee_id = null
        WHERE id = $1;
      `,
      [cartId],
    );
  }

  @DefaultCatch((err) => {
    console.log('Cannot get total price', err);
    throw err;
  })
  async getTotalPrice(cartId: string) {
    console.log(cartId);
    const res = await this.databaseService.runQuery(
      `
      SELECT SUM(COALESCE(f.fee, 0) + (p.price - (p.price * COALESCE(d.percentage, 0) / 100)) * i.amount)
      FROM cart_item i
      LEFT JOIN cart c ON c.id = $1 
      LEFT JOIN shipping_fee f ON f.id = c.shipping_fee_id 
      INNER JOIN product p ON p.id = i.product_id
      LEFT JOIN discount d ON d.id = p.discount_id
      WHERE i.cart_id = $1;
    `,
      [cartId],
    );
    return res.rows[0].sum ? res.rows[0].sum : 0;
  }

  async getIdByUserId(userId: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT id FROM cart WHERE user_id = $1;
      `,
      [userId],
    );

    return res.rows[0].id;
  }
}

import type { DatabaseService } from '@config/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderItemRepository {
  constructor(private databaseService: DatabaseService) {}

  async getByOrderId(orderId: string) {
    const res = await this.databaseService.runQuery(
      `SELECT 
          oi.id, oi.price, oi.product_id, oi.amount, oi.order_id,
          p.name, p.description,
          COALESCE(json_agg(pi.url) FILTER (WHERE pi.id IS NOT NULL), '[]'::json) AS image_urls, 
          COALESCE(json_agg(c) FILTER (WHERE c.id IS NOT NULL), '[]'::json) AS categories
        FROM order_item oi
        INNER JOIN product p ON p.id = oi.product_id
        LEFT JOIN product_image pi ON pi.product_id = p.id
        LEFT JOIN product_category pc ON pc.product_id = p.id
        LEFT JOIN category c ON c.id = pc.category_id
        WHERE order_id = $1
        GROUP BY oi.id, p.id
        `,
      [orderId],
    );
    return res.rows;
  }

  async createOrderItems(orderId: string, cartId: string): Promise<string[]> {
    const res = await this.databaseService.runQuery(
      `
        INSERT INTO order_item (order_id, price, amount, product_id)
          SELECT $2, p.price - (p.price * COALESCE(d.percentage, 0) / 100), i.amount, i.product_id 
          FROM cart_item i
          INNER JOIN product p ON p.id = i.product_id
          LEFT JOIN discount d ON d.id = p.discount_id
          WHERE i.cart_id = $1
        RETURNING order_item.id;
      `,
      [cartId, orderId],
    );

    const orderItems = res.rows;

    if (orderItems.length === 0) {
      throw new Error('Cannot create order items');
    }

    return orderItems;
  }
}

import { DatabaseService } from '@config/database';
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
}

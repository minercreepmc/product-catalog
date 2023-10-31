import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrderDto } from './dto';
import { DatabaseService } from '@config/database';
import { OrderStatus } from './constants';
import { DefaultCatch } from 'catch-decorator-ts';
import { OrderDetailsRO, OrderRO } from './ro';
import { plainToInstance } from 'class-transformer';
import { OrderItemRO } from '@v2/order-item/ro';

@Injectable()
export class OrderRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  @DefaultCatch((err) => {
    console.log('Cannot create order details', err);
    throw err;
  })
  async create(memberId: string, cartId: string, totalPrice: number) {
    const res = await this.databaseService.runQuery(
      `
      INSERT INTO order_details (status, member_id, address_id, total_price, fee_id) 
        VALUES ($1, $2, (SELECT address_id FROM cart WHERE id = $3), $4, (SELECT shipping_fee_id FROM cart WHERE id = $3))
      RETURNING *; 
    `,
      [OrderStatus.PROCESSING, memberId, cartId, totalPrice],
    );

    const orderDetails = res.rows[0];

    if (!orderDetails) {
      throw new Error('Cannot create order details');
    }

    return orderDetails;
  }

  async update(id: string, dto: UpdateOrderDto) {
    const res = await this.databaseService.runQuery(
      `
        UPDATE order_details SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *;
      `,
      [dto.status, id],
    );

    const order = res.rows[0];

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async countDaily() {
    const res = await this.databaseService.runQuery(
      `
      SELECT COUNT(*) AS count
      FROM order_details
      WHERE date_trunc('day', ) = date_trunc('day', current_date)
      `,
    );

    return res.rows[0].count;
  }

  async countMonthly() {
    const res = await this.databaseService.runQuery(
      `
      SELECT COUNT(*) AS count
      FROM order_details
      WHERE date_trunc('month', created_at) = date_trunc('month', current_date)
      `,
    );

    return res.rows[0].count;
  }

  async countWeekly() {
    const res = await this.databaseService.runQuery(
      `
      SELECT COUNT(*) AS count
      FROM order_details
      WHERE date_trunc('week', created_at) = date_trunc('week', current_date)
      `,
    );

    return res.rows[0].count;
  }

  async findOneById(orderId: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT o.updated_at, o.id, o.total_price, o.status, 
        a.location as address_location, f.name as fee_name,
        f.fee as fee_price, u.full_name as member_name, u.phone as member_phone
        FROM order_details o
        INNER JOIN address a ON a.id = o.address_id
        INNER JOIN shipping_fee f ON f.id = o.fee_id
        INNER JOIN users u ON u.id = o.member_id
        WHERE o.id = $1;
      `,
      [orderId],
    );

    const orderDetails = plainToInstance(OrderRO, res.rows[0]);

    if (!orderDetails) {
      throw new NotFoundException('Order not found');
    }

    const order: OrderDetailsRO = {
      id: orderDetails.id,
      total_price: orderDetails.total_price,
      status: orderDetails.status,
      fee_price: orderDetails.fee_price,
      fee_name: orderDetails.fee_name,
      member_name: orderDetails.member_name,
      member_phone: orderDetails.member_phone,
      address_location: orderDetails.address_location,
      updated_at: orderDetails.updated_at,
      items: [],
    };

    order.items = await this.getOrderItems(order.id);
    return order;
  }

  async findByMemberAndStatus(memberId: string, status?: OrderStatus) {
    console.log(status);
    const res = await this.databaseService.runQuery(
      `
        SELECT
          o.updated_at,
          o.id,
          o.total_price,
          o.status,
          a.location AS address_location,
          f.name AS fee_name,
          f.fee AS fee_price
      FROM order_details o
      INNER JOIN address a ON a.id = o.address_id
      INNER JOIN shipping_fee f ON f.id = o.fee_id
      INNER JOIN order_item oi ON oi.order_id = o.id
      WHERE o.member_id = $1 AND 
(o.status = $2 OR ($2 IS NULL AND o.status != $3))
      GROUP BY o.updated_at, o.id, o.total_price, o.status, a.location, f.name, f.fee;
      `,
      [memberId, status, OrderStatus.CANCELED],
    );

    console.log(res.rows);

    return res.rows;
  }

  async findAll() {
    const res = await this.databaseService.runQuery(
      `
        SELECT o.updated_at, o.id, o.total_price, o.status, 
        a.location as address_location, f.name as fee_name,
        f.fee as fee_price, u.full_name as member_name, u.phone as member_phone
        FROM order_details o
        INNER JOIN address a ON a.id = o.address_id
        INNER JOIN shipping_fee f ON f.id = o.fee_id
        INNER JOIN users u ON u.id = o.member_id
      `,
    );

    return res.rows;
  }

  @DefaultCatch((err) => {
    console.log('Cannot get total price', err);
    throw err;
  })
  private async getTotalPrice(cartId: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT SUM(f.fee + (p.price - (p.price * COALESCE(d.percentage, 0) / 100)) * i.amount)
      FROM cart_item i
      INNER JOIN cart c ON c.id = $1
      INNER JOIN shipping_fee f ON c.shipping_fee_id = f.id
      INNER JOIN product p ON p.id = i.product_id
      LEFT JOIN discount d ON d.id = p.discount_id
      WHERE i.cart_id = $1;
    `,
      [cartId],
    );

    return res.rows[0].sum;
  }

  private async getOrderItems(orderId: string): Promise<OrderItemRO[]> {
    const res = await this.databaseService.runQuery(
      `
        SELECT i.id, i.price, i.amount, p.id, p.name, p.description, c.id, c.name as category_name, json_agg(pi.url) as image_urls
        FROM order_item i
        INNER JOIN product p ON p.id = i.product_id
        LEFT JOIN product_category pc ON pc.product_id = p.id
        LEFT JOIN product_image pi ON pi.product_id = p.id
        LEFT JOIN category c ON c.id = pc.category_id
        WHERE i.order_id = $1
        GROUP BY i.id, p.id, c.id
      `,
      [orderId],
    );

    return res.rows;
  }
}

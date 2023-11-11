import { Injectable } from '@nestjs/common';
import type { OrderGetAllDto, UpdateOrderDto } from './dto';
import { DatabaseService } from '@config/database';
import { OrderStatus } from './constants';
import { KyselyDatabase } from '@config/kysely';
import { paginate } from '@common/function';

@Injectable()
export class OrderRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly database: KyselyDatabase,
  ) {}

  async create(
    memberId: string,
    cartId: string,
    totalPrice: number,
    shippingMethodId: string,
  ) {
    const res = await this.databaseService.runQuery(
      `
      INSERT INTO order_details (status, member_id, address_id, total_price, shipping_fee_id, shipping_method_id) 
        VALUES ($1, $2, (SELECT address_id FROM cart WHERE id = $3), $4, (SELECT shipping_fee_id FROM cart WHERE id = $3), $5)
      RETURNING *; 
    `,
      [OrderStatus.PROCESSING, memberId, cartId, totalPrice, shippingMethodId],
    );
    return res.rows[0];
  }

  async update(id: string, dto: UpdateOrderDto) {
    const res = await this.databaseService.runQuery(
      `
        UPDATE order_details SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *;
      `,
      [dto.status, id],
    );
    return res.rows[0];
  }

  async countDaily() {
    const res = await this.databaseService.runQuery(
      `
      SELECT COUNT(*) AS count
      FROM order_details
      WHERE date_trunc('day', created_at) = date_trunc('day', current_date)
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
        INNER JOIN shipping_fee f ON f.id = o.shipping_fee_id
        INNER JOIN users u ON u.id = o.member_id
        WHERE o.id = $1;
      `,
      [orderId],
    );
    return res.rows[0];
  }

  async findByMemberAndStatus(memberId: string, status?: OrderStatus) {
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
      INNER JOIN shipping_fee f ON f.id = o.shipping_fee_id
      INNER JOIN order_item oi ON oi.order_id = o.id
      WHERE o.member_id = $1 AND 
(o.status = $2 OR ($2 IS NULL AND o.status != $3))
      GROUP BY o.updated_at, o.id, o.total_price, o.status, a.location, f.name, f.fee;
      `,
      [memberId, status, OrderStatus.CANCELED],
    );
    return res.rows;
  }

  async findAll(dto: OrderGetAllDto) {
    const { limit, page, status } = dto;

    let query = this.database
      .selectFrom('order_details as o')
      .innerJoin('address as a', 'a.id', 'o.address_id')
      .innerJoin('shipping_fee as f', 'f.id', 'o.shipping_fee_id')
      .innerJoin('users as u', 'u.id', 'o.member_id')
      .orderBy('o.created_at')
      .select([
        'o.id',
        'o.total_price',
        'o.status',
        'o.created_at',
        'a.location as address_location',
        'f.name as fee_name',
        'f.fee as fee_price',
        'u.full_name as member_name',
        'u.phone as member_phone',
      ]);

    if (status) {
      query = query.where('o.status', '=', status);
    }

    return paginate(query, this.database, {
      limit,
      page,
      tableName: 'order_details',
      getOriginalTotalItems: true,
    });
  }
}

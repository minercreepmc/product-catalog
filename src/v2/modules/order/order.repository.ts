import { Injectable } from '@nestjs/common';
import type { OrderGetAllDto, UpdateOrderDto } from './dto';
import { DatabaseService } from '@config/database';
import { OrderStatus } from './constants';
import { KyselyDatabase } from '@config/kysely';
import { paginate } from '@common/function';

export interface OrderStoreDto {
  memberId: string;
  addressId: string;
  totalPrice: number;
  shippingFeeId: string;
  shippingMethodId: string;
}

@Injectable()
export class OrderRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly database: KyselyDatabase,
  ) {}

  store(dto: OrderStoreDto) {
    const { memberId, addressId, totalPrice, shippingFeeId, shippingMethodId } =
      dto;

    return this.database
      .insertInto('order_details')
      .values({
        address_id: addressId,
        status: OrderStatus.PROCESSING,
        member_id: memberId,
        total_price: totalPrice,
        shipping_fee_id: shippingFeeId,
        shipping_method_id: shippingMethodId,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
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

  getOne(orderId: string) {
    return this.database
      .selectFrom('order_details as o')
      .innerJoin('address as a', 'a.id', 'o.address_id')
      .innerJoin('shipping_fee as sf', 'sf.id', 'o.shipping_fee_id')
      .innerJoin('shipping_method as sm', 'sm.id', 'o.shipping_method_id')
      .innerJoin('users as u', 'u.id', 'o.member_id')
      .where('o.id', '=', orderId)
      .select([
        'o.id',
        'o.total_price',
        'o.status',
        'o.created_at',
        'a.location as address_location',
        'sf.name as fee_name',
        'sf.fee as fee_price',
        'sm.name as shipping_method',
        'u.full_name as member_name',
        'u.phone as member_phone',
      ])
      .executeTakeFirst();
  }

  async findAll(dto: OrderGetAllDto, userId?: string) {
    const { limit, page, status, orderBy } = dto;

    let query = this.database
      .selectFrom('order_details as o')
      .innerJoin('shipping_fee as f', 'f.id', 'o.shipping_fee_id')
      .innerJoin('address as a', 'a.id', 'o.address_id')
      .innerJoin('users as u', 'u.id', 'o.member_id')
      .innerJoin('shipping_method as sm', 'sm.id', 'o.shipping_method_id')
      .orderBy(`o.${orderBy}`, 'asc')
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
        'sm.name as shipping_method',
      ]);

    if (status) {
      query = query.where('o.status', '=', status);
    }

    if (userId) {
      query = query.where('o.member_id', '=', userId);
    }

    return paginate(query, this.database, {
      limit,
      page,
      tableName: 'order_details',
      getOriginalTotalItems: true,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@config/database';
import type { CreateShippingDto, UpdateShippingDto } from './dto';
import type { ShippingModel } from './model';
import { KyselyDatabase } from '@config/kysely';
import { OrderStatus } from '@v2/order/constants';

export interface ShippingGetDetailDto {
  id?: string;
  orderId?: string;
  shipperId?: string;
}

@Injectable()
export class ShippingRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly database: KyselyDatabase,
  ) {}

  async create(dto: CreateShippingDto): Promise<ShippingModel> {
    const { shipperId, orderId, dueDate } = dto;
    const res = await this.databaseService.runQuery(
      `
      INSERT INTO shipping (order_id, shipper_id, due_date) VALUES ($1, $2, $3) RETURNING *;
    `,
      [orderId, shipperId, dueDate],
    );

    return res.rows[0];
  }

  async update(id: string, dto: UpdateShippingDto) {
    const res = await this.databaseService.runQuery(
      `
      UPDATE shipping 
      SET 
          shipper_id = COALESCE($2, shipper_id),
          due_date = COALESCE($4, due_date)
      WHERE id = $1 RETURNING *;
    `,
      [id, dto.shipperId, dto.deletedAt],
    );

    return res.rows[0];
  }

  async deleteByOrderId(id: string) {
    const res = await this.databaseService.runQuery(
      `
        DELETE FROM shipping
        WHERE order_id IN (SELECT id FROM order_details WHERE order_id = $1)
        RETURNING *;
    `,
      [id],
    );

    return res.rows[0];
  }

  getAll() {
    return this.database
      .selectFrom('shipping')
      .innerJoin('order_details', 'order_details.id', 'shipping.order_id')
      .innerJoin(
        'shipping_fee',
        'shipping_fee.id',
        'order_details.shipping_fee_id',
      )
      .innerJoin(
        'shipping_method',
        'shipping_method.id',
        'order_details.shipping_method_id',
      )
      .innerJoin('users as shipper', 'shipper.id', 'shipping.shipper_id')
      .innerJoin('users as member', 'member.id', 'order_details.member_id')
      .select([
        'shipping.id',
        'shipping.created_at',
        'shipping.updated_at',
        'shipping.order_id',
        'shipping.due_date',
        'member.full_name as member_name',
        'member.phone as member_phone',
        'order_details.total_price',
        'order_details.status',
        'shipping_fee.name as fee_name',
        'shipping_fee.fee as fee_price',
        'shipping_method.name as shipping_method',
        'shipper.full_name as shipper_name',
      ])
      .execute();
  }

  async getDetail(dto: ShippingGetDetailDto) {
    const { id, shipperId, orderId } = dto;

    let query = this.database
      .selectFrom('shipping')
      .innerJoin('order_details', 'order_details.id', 'shipping.order_id')
      .innerJoin(
        'shipping_fee',
        'shipping_fee.id',
        'order_details.shipping_fee_id',
      )
      .innerJoin(
        'shipping_method',
        'shipping_method.id',
        'order_details.shipping_method_id',
      )
      .innerJoin('users as shipper', 'shipper.id', 'shipping.shipper_id')
      .innerJoin('users as member', 'member.id', 'order_details.member_id')
      .innerJoin('address', 'address.id', 'order_details.address_id')
      .select([
        'shipping.id',
        'shipping.created_at',
        'shipping.updated_at',
        'shipping.order_id',
        'shipping.due_date',
        'member.full_name as member_name',
        'member.phone as member_phone',
        'order_details.total_price',
        'shipping_fee.name as fee_name',
        'shipping_fee.fee as fee_price',
        'shipping_method.name as shipping_method',
        'address.location as address',
        'shipper.full_name as shipper_name',
        'shipper.phone as shipper_phone',
      ]);

    if (id) {
      query = query.where('shipping.id', '=', id);
    }

    if (shipperId) {
      query = query
        .where('shipping.shipper_id', '=', shipperId)
        .where('order_details.status', '!=', OrderStatus.CANCELED);
    }

    if (orderId) {
      query = query.where('shipping.order_id', '=', orderId);
    }

    return query.executeTakeFirst();
  }
}

import { Injectable } from '@nestjs/common';
import type { DatabaseService } from '@config/database';
import type { CreateShippingDto, UpdateShippingDto } from './dto';
import type { ShippingModel } from './model';

@Injectable()
export class ShippingRepository {
  constructor(private readonly databaseService: DatabaseService) {}

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
          deleted_at = COALESCE($3, deleted_at),
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

  async findOne(id: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT s.id, s.created_at, s.updated_at, s.order_id, s.due_date, s.due_date, u2.full_name as member_name, u2.phone as member_phone, o.total_price, o.status,
      f.fee as fee_price, f.name as fee_name,
      a.location as address, u1.full_name as shipper
      FROM shipping s
      INNER JOIN order_details o ON s.order_id = o.id
      INNER JOIN shipping_fee f ON f.id = o.fee_id 
      INNER JOIN address a ON a.id = o.address_id
      INNER JOIN users u1 ON u1.id = s.shipper_id
      INNER JOIN users u2 ON u2.id = o.member_id
      WHERE s.id = $1
      
    `,
      [id],
    );

    return res.rows[0];
  }

  async findOneByOrderId(orderId: string) {
    const res = await this.databaseService.runQuery(
      `

      SELECT s.id, s.created_at, s.updated_at, s.order_id, s.due_date, s.due_date, u.full_name as member_name, u.phone as member_phone, o.total_price,
      f.fee as fee_price, f.name as fee_name,
      a.location as address, u.full_name as shipper
      FROM shipping s
      INNER JOIN order_details o ON s.order_id = o.id
      INNER JOIN shipping_fee f ON f.id = o.fee_id 
      INNER JOIN address a ON a.id = o.address_id
      INNER JOIN users u ON u.id = s.shipper_id
      WHERE s.order_id = $1
     `,
      [orderId],
    );

    return res.rows[0];
  }

  async findAll() {
    const res = await this.databaseService.runQuery(
      `
      SELECT s.id, s.created_at, s.updated_at, s.order_id, s.due_date, s.due_date, u.full_name as member_name, u.phone as member_phone, o.total_price,
      f.fee as fee_price, f.name as fee_name,
      a.location as address, u.full_name as shipper
      FROM shipping s
      INNER JOIN order_details o ON s.order_id = o.id
      INNER JOIN shipping_fee f ON f.id = o.fee_id 
      INNER JOIN address a ON a.id = o.address_id
      INNER JOIN users u ON u.id = s.shipper_id
    `,
    );

    return res.rows;
  }

  async findByShipper(shipperId: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT s.id, s.created_at, s.updated_at, s.order_id, s.due_date, s.due_date, u2.full_name as member_name, u2.phone as member_phone, o.total_price, o.id as order_id, o.status,
      f.fee as fee_price, f.name as fee_name,
      a.location as address, u.full_name as shipper
      FROM shipping s
      INNER JOIN order_details o ON s.order_id = o.id
      INNER JOIN shipping_fee f ON f.id = o.fee_id 
      INNER JOIN address a ON a.id = o.address_id
      INNER JOIN users u ON u.id = s.shipper_id
      INNER JOIN users u2 ON u2.id = o.member_id
      WHERE s.shipper_id = $1 AND o.status != 'CANCELED'
      `,
      [shipperId],
    );

    return res.rows;
  }
}

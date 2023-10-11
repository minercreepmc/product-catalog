import { DatabaseService } from '@config/database';
import { Injectable } from '@nestjs/common';
import { CreateShippingDto, UpdateShippingDto } from './dto';
import { ShippingModel } from './model';

@Injectable()
export class ShippingRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateShippingDto): Promise<ShippingModel> {
    const { shipperId, orderId } = dto;
    const res = await this.databaseService.runQuery(
      `
      INSERT INTO shipping (order_id, shipper_id) VALUES ($1, $2) RETURNING *;
    `,
      [orderId, shipperId],
    );

    return res.rows[0];
  }

  async update(id: string, dto: UpdateShippingDto) {
    const res = await this.databaseService.runQuery(
      `
      UPDATE shipping 
      SET 
          shipper_id = COALESCE($2, shipper_id),
          deleted_at = COALESCE($3, deleted_at)
      WHERE id = $1 RETURNING *;
    `,
      [id, dto.shipperId, dto.deletedAt],
    );

    return res.rows[0];
  }

  async updateStatus(id: string, status: string) {
    const res = await this.databaseService.runQuery(
      `
      UPDATE shipping SET status = $1 WHERE id = $2 RETURNING *;
    `,
      [status, id],
    );

    return res.rows[0];
  }

  async findOne(id: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT s.id, s.created_at, s.updated_at, 
      f.fee as fee_price, f.name as fee_name,
      a.location as address, u.full_name as shipper
      FROM shipping s
      INNER JOIN order_details o ON s.order_id = o.id
      INNER JOIN shipping_fee f ON f.id = o.fee_id 
      INNER JOIN address a ON a.id = o.address_id
      INNER JOIN users u ON u.id = s.shipper_id
      WHERE s.id = $1
      
    `,
      [id],
    );

    return res.rows[0];
  }

  async findAll() {
    const res = await this.databaseService.runQuery(
      `
      SELECT s.id, s.created_at, s.updated_at, 
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
        SELECT s.id, s.created_at, s.updated_at, 
        f.fee, f.name as fee_name,
        a.location as address, u.full_name as shipper
        FROM shipping s
        INNER JOIN order_details o ON s.order_id = o.id
        INNER JOIN shipping_fee f ON f.id = o.fee_id 
        INNER JOIN address a ON a.id = o.address_id
        INNER JOIN users u ON u.id = s.shipper_id
        WHERE s.shipper_id = $1
      `,
      [shipperId],
    );

    return res.rows;
  }
}

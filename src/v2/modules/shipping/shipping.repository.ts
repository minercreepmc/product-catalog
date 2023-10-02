import { DatabaseService } from '@config/database';
import { Injectable } from '@nestjs/common';
import { CreateShippingDto, UpdateShippingDto } from './dto';

@Injectable()
export class ShippingRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateShippingDto) {
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
      UPDATE shipping SET shipper_id = $1, deleted_at = $2 WHERE id = $3 RETURNING *;
    `,
      [dto.shipperId, dto.deletedAt, id],
    );

    return res.rows[0];
  }

  async findOne(id: string) {
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
      WHERE s.id = $1
      
    `,
      [id],
    );

    return res.rows[0];
  }
}

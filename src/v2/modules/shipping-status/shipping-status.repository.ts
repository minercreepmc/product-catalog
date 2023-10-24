import { DatabaseService } from '@config/database';
import { Injectable } from '@nestjs/common';
import { CreateShippingStatusDto, UpdateShippingStatusDto } from './dto';

@Injectable()
export class ShippingStatusRepository {
  constructor(private databaseService: DatabaseService) {}

  async create(dto: CreateShippingStatusDto) {
    const res = await this.databaseService.runQuery(
      `
      INSERT INTO shipping_status (status, shipping_id) VALUES ($1, $2)
      RETURNING *;
      `,
      [dto.status, dto.shippingId],
    );

    return res.rows[0];
  }

  async update(id: string, dto: UpdateShippingStatusDto) {
    const res = await this.databaseService.runQuery(
      `
      UPDATE shipping_status SET status = $1 WHERE id = $2
      RETURNING *;
      `,
      [dto.status, id],
    );

    return res.rows[0];
  }

  async delete(id: string) {
    const res = await this.databaseService.runQuery(
      `
        DELETE FROM shipping_status WHERE id = $1
        RETURNING *;
      `,
      [id],
    );

    return res.rows[0];
  }

  async findByShippingId(shippingId: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT * FROM shipping_status WHERE shipping_id = $1 ORDER BY created_at;
      `,
      [shippingId],
    );

    return res.rows;
  }

  async findByOrderId(orderId: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT ss.* 
      FROM shipping_status ss
      INNER JOIN shipping s ON ss.shipping_id = s.id 
      WHERE s.order_id = $1 ORDER BY ss.created_at DESC; 
      `,
      [orderId],
    );

    return res.rows;
  }
}

import { CreateShippingStatusDto, UpdateShippingStatusDto } from '@api/http/v1';
import { DatabaseService } from '@config/pg';
import { Injectable } from '@nestjs/common';
import { randomString } from '@utils/functions';

@Injectable()
export class ShippingStatusRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateShippingStatusDto) {
    const res = await this.databaseService.runQuery(
      `
      INSERT INTO shipping_status (id, status, shipping_id) VALUES ($1, $2, $3)
      `,
      [randomString(), dto.status, dto.shippingId],
    );

    return res.rows[0];
  }

  async update(id: string, dto: UpdateShippingStatusDto) {
    const res = await this.databaseService.runQuery(
      `
      UPDATE shipping_status SET status = $1 WHERE id = $2
      `,
      [dto.status, id],
    );

    return res.rows[0];
  }

  async delete(id: string) {
    const res = await this.databaseService.runQuery(
      `
        DELETE FROM shipping_status WHERE id = $1
      `,
      [new Date(), id],
    );

    return res.rows[0];
  }

  async findAllByShippingId(shippingId: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT * FROM shipping_status WHERE shipping_id = $1;
      `,
      [shippingId],
    );

    return res.rows;
  }
}

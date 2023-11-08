import { Injectable } from '@nestjs/common';
import type { DatabaseService } from '@config/database';
import type { CreateShippingFeeDto } from './dto';

@Injectable()
export class ShippingFeeRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateShippingFeeDto) {
    const res = await this.databaseService.runQuery(
      `
      INSERT INTO shipping_fee (name, fee) VALUES ($1, $2) RETURNING *;
    `,
      [dto.name, dto.fee],
    );

    return res.rows[0];
  }

  async update(id: string, dto: CreateShippingFeeDto) {
    const res = await this.databaseService.runQuery(
      `
      UPDATE shipping_fee 
      SET fee = COALESCE($2, fee),
          name = COALESCE($3, name)
      WHERE id = $1 RETURNING *;
    `,
      [id, dto.fee, dto.name],
    );

    return res.rows[0];
  }

  async delete(id: string) {
    const res = await this.databaseService.runQuery(
      `
      DELETE FROM shipping_fee WHERE id = $1 RETURNING *;
    `,
      [id],
    );

    return res.rows[0];
  }

  async findAll() {
    const res = await this.databaseService.runQuery(
      `
      SELECT * FROM shipping_fee;
    `,
    );

    return res.rows;
  }

  async findOne(id: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT * FROM shipping_fee WHERE id = $1;
    `,
      [id],
    );

    return res.rows[0];
  }
}

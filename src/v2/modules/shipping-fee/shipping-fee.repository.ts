import { DatabaseService } from '@config/database';
import { Injectable } from '@nestjs/common';
import { randomString } from '@utils/functions';
import { CreateShippingFeeDto } from './dtos';

@Injectable()
export class ShippingFeeRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateShippingFeeDto) {
    const res = await this.databaseService.runQuery(
      `
      INSERT INTO shipping_fee (name, fee, id) VALUES ($1, $2, $3) RETURNING *;
    `,
      [dto.name, dto.fee, randomString()],
    );

    return res.rows[0];
  }

  async update(id: string, dto: CreateShippingFeeDto) {
    const res = await this.databaseService.runQuery(
      `
      UPDATE shipping_fee SET fee = $1 WHERE id = $2 RETURNING *;
    `,
      [dto.fee, id],
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

  async findOneByNameOrFailIfExist(name: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT * FROM shipping_fee WHERE name = $1;
    `,
      [name],
    );

    const shippingFee = res.rows[0];

    if (shippingFee) {
      throw new Error('Shipping fee already exists');
    }

    return shippingFee;
  }

  async findOneOrFail(id: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT * FROM shipping_fee WHERE id = $1;
    `,
      [id],
    );
    const shippingFee = res.rows[0];

    if (!shippingFee) {
      throw new Error('Shipping fee not found');
    }

    return shippingFee;
  }
}

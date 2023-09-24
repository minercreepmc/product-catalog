import { CreateShippingDto, UpdateShippingDto } from '@api/http';
import { DatabaseService } from '@config/pg';
import { Injectable } from '@nestjs/common';
import { randomString } from '@utils/functions';

@Injectable()
export class ShippingRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateShippingDto) {
    const res = await this.databaseService.runQuery(
      `
      INSERT INTO shipping (address_id, fee_id, shipper_id, id) VALUES ($1, $2, $3, $4) RETURNING *;
    `,
      [dto.addressId, dto.feeId, dto.shipperId, randomString()],
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
      SELECT shipping.id, shipping.created_at, shipping.updated_at, 
      shipping.deleted_at, shipping_fee.fee, shipping_fee.name as fee_name,
      address.location as address, users.full_name as shipper
      FROM shipping 
      LEFT JOIN shipping_fee ON shipping.fee_id = shipping_fee.id
      LEFT JOIN address ON shipping.address_id = address.id
      LEFT JOIN users ON shipping.shipper_id = users.id
      WHERE shipping.id = $1
      
    `,
      [id],
    );

    return res.rows[0];
  }
}

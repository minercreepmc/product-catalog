import { DatabaseService } from '@config/database';
import { Injectable } from '@nestjs/common';
import type { CreateAddressDto, UpdateAddressDto } from './dto';

@Injectable()
export class AddressRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userId: string, dto: CreateAddressDto) {
    const res = await this.databaseService.runQuery(
      `
      INSERT INTO address (location, user_id) VALUES ($1, $2) RETURNING *;
    `,
      [dto.location, userId],
    );

    return res.rows[0];
  }

  async delete(id: string) {
    const res = await this.databaseService.runQuery(
      `
      DELETE FROM address WHERE id = $1 RETURNING *;
    `,
      [id],
    );

    return res.rows[0];
  }

  async getAll(userId: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT * FROM address WHERE user_id = $1;
    `,
      [userId],
    );

    return res.rows;
  }

  async update(id: string, dto: UpdateAddressDto) {
    const res = await this.databaseService.runQuery(
      `
      UPDATE address SET location = $1 WHERE id = $2 RETURNING *;
    `,
      [dto.location, id],
    );

    return res.rows[0];
  }
}

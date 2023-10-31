import { DatabaseService } from '@config/database';
import { Injectable, Logger } from '@nestjs/common';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import { DefaultCatch } from 'catch-decorator-ts';
import { handleError } from '@util';

@Injectable()
export class AddressRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  @DefaultCatch((e) => handleError(e, logger))
  async create(userId: string, dto: CreateAddressDto) {
    const res = await this.databaseService.runQuery(
      `
      INSERT INTO address (location, user_id) VALUES ($1, $2) RETURNING *;
    `,
      [dto.location, userId],
    );

    return res.rows[0];
  }

  @DefaultCatch((e) => handleError(e, logger))
  async delete(id: string) {
    const res = await this.databaseService.runQuery(
      `
      DELETE FROM address WHERE id = $1 RETURNING *;
    `,
      [id],
    );

    return res.rows[0];
  }

  @DefaultCatch((e) => handleError(e, logger))
  async getAll(userId: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT * FROM address WHERE user_id = $1;
    `,
      [userId],
    );

    return res.rows;
  }

  @DefaultCatch((e) => handleError(e, logger))
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

const logger = new Logger(AddressRepository.name);

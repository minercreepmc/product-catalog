import { CreateAddressDto, UpdateAddressDto } from '@api/http/v1';
import { DatabaseService } from '@config/pg';
import { Injectable } from '@nestjs/common';
import { randomString } from '@utils/functions';

@Injectable()
export class AddressRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userId: string, dto: CreateAddressDto) {
    const res = await this.databaseService.runQuery(
      `
      INSERT INTO address (location, user_id, id) VALUES ($1, $2, $3) RETURNING *;
    `,
      [dto.location, userId, randomString()],
    );

    return res.rows[0];
  }

  // async update(data: AddressRepositoryUpdate) {
  //   const res = await this.databaseService.runQuery(
  //     `
  //     UPDATE address SET location = $1 WHERE id = $2 RETURNING *;
  //   `,
  //     [data.address.location, data.address.id.value],
  //   );
  //   return res.rows[0];
  // }

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

  async findOneOrFail(id: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT * FROM address WHERE id = $1;
    `,
      [id],
    );

    const address = res.rows[0];

    if (!address) {
      throw new Error('Address not found');
    }

    return address;
  }
}

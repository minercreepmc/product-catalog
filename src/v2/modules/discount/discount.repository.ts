import { DatabaseService } from '@config/database';
import { PaginationParams } from '@constants';
import { Injectable } from '@nestjs/common';
import { CreateDiscountDto, UpdateDiscountDto } from './dto';

@Injectable()
export class DiscountRepository {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(dto: CreateDiscountDto) {
    const { name, description, percentage } = dto;

    const res = await this.databaseService.runQuery(
      `INSERT into discount 
          (name, description, percentage, active) 
      VALUES 
          ($1, $2, $3, $4)
      RETURNING *`,
      [name, description, percentage, true],
    );

    return res.rows[0];
  }
  async deleteOneById(id: string) {
    const res = await this.databaseService.runQuery(
      `
      DELETE FROM discount WHERE id=$1 RETURNING *;
      `,
      [id],
    );

    return res.rows[0];
  }

  async deleteManyByIds(ids: string[]) {
    const deleteds: any = [];

    for (const id of ids) {
      const deleted = await this.deleteOneById(id);
      if (deleted) {
        deleteds.push(deleted);
      } else {
        break;
      }
    }

    return deleteds ? deleteds : [];
  }
  async findOneById(id: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT *
      FROM discount 
      WHERE id=$1;
      `,
      [id],
    );

    return res.rows[0];
  }
  async updateOneById(id: string, dto: UpdateDiscountDto) {
    const { name, description, percentage, active } = dto;
    const res = await this.databaseService.runQuery(
      `
        UPDATE discount
        SET 
            name = COALESCE($2, name),
            description = COALESCE($3, description),
            percentage = COALESCE($4, percentage),
            active = COALESCE($5, active)
        WHERE
            id = $1
        RETURNING *;
      `,
      [id, name, description, percentage, active],
    );

    return res.rows[0];
  }

  async findOneByName(name: string) {
    const res = await this.databaseService.runQuery(
      `SELECT * from discount WHERE name=$1 AND deleted_at IS NULL`,
      [name],
    );

    return res.rows[0];
  }

  async findAll(filter: PaginationParams) {
    const { limit, offset } = filter;

    const res = await this.databaseService.runQuery(
      `
        SELECT * from discount 
        WHERE deleted_at is null
        OFFSET $1 LIMIT $2
      `,
      [offset, limit],
    );

    return res.rows;
  }
}

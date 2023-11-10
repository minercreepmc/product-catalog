import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@config/database';
import type { PaginationParams } from '@constants';
import type { CreateDiscountDto, UpdateDiscountDto } from './dto';

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
      `DELETE FROM discount WHERE id=$1 RETURNING *;`,
      [id],
    );

    return res.rows[0];
  }

  async findOneById(id: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT d.*, COALESCE(json_agg(json_build_object(
        'id', p.id,
        'name', p.name,
        'description', p.description,
        'price', p.price,
        'image_urls', (
                SELECT COALESCE(json_agg(pi.url), '[]'::json)
                FROM product_image pi
                WHERE pi.product_id = p.id
                )
          )) FILTER (WHERE p.id IS NOT NULL), '[]'::json) AS products
      FROM discount d
      LEFT JOIN product p ON d.id=p.discount_id
      WHERE d.id=$1
      GROUP BY d.id;
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

  async findAllWithProductCount() {
    const res = await this.databaseService.runQuery(
      `
        SELECT d.*, COUNT(p.id) as product_count
        FROM discount d
        LEFT JOIN product p ON d.id=p.discount_id
        GROUP BY d.id
      `,
    );

    return res.rows;
  }
}

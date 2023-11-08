import { Injectable } from '@nestjs/common';
import type { DatabaseService } from '@config/database';
import type { PaginationParams } from '@constants';
import type { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryRepository {
  constructor(private databaseService: DatabaseService) {}
  async create(dto: CreateCategoryDto) {
    const { description, name } = dto;
    const res = await this.databaseService.runQuery(
      `INSERT into category
          (name, description)
      VALUES
          ($1, $2)
      RETURNING *`,
      [name, description],
    );

    return res.rows[0];
  }
  async deleteOneById(id: string) {
    const res = await this.databaseService.runQuery(
      `DELETE FROM category WHERE id=$1 RETURNING *`,
      [id],
    );

    return res.rows[0];
  }

  async findOneById(id: string) {
    const res = await this.databaseService.runQuery(
      `SELECT c.id, c.name, c.description,
        COALESCE(json_agg(json_build_object(
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
       FROM category c
      LEFT JOIN product_category pc ON c.id = pc.category_id
      LEFT JOIN product p ON pc.product_id = p.id
      WHERE c.id=$1
      GROUP BY c.id;`,
      [id],
    );
    return res.rows[0];
  }

  async updateOneById(id: string, dto: UpdateCategoryDto) {
    const { name, description } = dto;
    const res = await this.databaseService.runQuery(
      `
        UPDATE category
        SET 
            name = COALESCE($2, name),
            description = COALESCE($3, description)
        WHERE
            id = $1
        RETURNING *;
      `,
      [id, name, description],
    );
    return res.rows[0];
  }

  async updateProductsFromCategory(categoryId: string, productIds: string[]) {
    const res = await this.databaseService.runQuery(
      ` 
          DELETE 
          FROM product_category
          WHERE category_id = $1
          AND product_id NOT IN (SELECT unnest($2::varchar[]))
          RETURNING product_id as product_ids
       `,
      [categoryId, productIds],
    );
    return res.rows[0];
  }

  async findOneByName(name: string) {
    const res = await this.databaseService.runQuery(
      `SELECT * from category WHERE name=$1`,
      [name],
    );

    return res.rows[0];
  }

  async findAll(filter: PaginationParams) {
    const { limit, offset } = filter;
    const res = await this.databaseService.runQuery(
      `
        SELECT id, name, description FROM category 
        WHERE deleted_at is null
        ORDER BY updated_at asc
        LIMIT $1 OFFSET $2
      `,
      [limit, offset],
    );

    return res.rows;
  }

  async findAllWithProductCount() {
    const res = await this.databaseService.runQuery(
      `
        SELECT c.id, c.name, COALESCE(COUNT(pc.product_id), 0) AS product_count
        FROM category c 
        LEFT JOIN product_category pc ON pc.category_id = c.id
        GROUP BY c.id, c.name;
      `,
    );

    return res.rows;
  }
}

import { DatabaseService } from '@config/database';
import { PaginationParams } from '@constants';
import { Injectable } from '@nestjs/common';
import { randomString } from '@utils/functions';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos';

@Injectable()
export class CategoryRepository {
  constructor(private databaseService: DatabaseService) {}
  async create(dto: CreateCategoryDto) {
    const { description, name } = dto;
    const res = await this.databaseService.runQuery(
      `INSERT into category
          (id, name, description)
      VALUES
          ($1, $2, $3)
      RETURNING *`,
      [randomString(), name, description],
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

  async deleteManyByIds(ids: string[]) {
    const deleteds: string[] = [];

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
      `SELECT * from category WHERE id=$1 AND deleted_at IS NULL`,
      [id],
    );

    return res.rows[0];
  }

  async updateOneById(id: string, dto: UpdateCategoryDto) {
    const { name, description, productIds } = dto;
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

    const category = res.rows[0];

    if (productIds) {
      const productsUpdated = await this.updateProductsFromCategory(
        category.id,
        productIds,
      );
      category.productIds = productsUpdated?.productIds;
    }

    return category;
  }

  private async updateProductsFromCategory(
    categoryId: string,
    productIds: string[],
  ) {
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

    const updated = res.rows[0];
    return updated ? updated : { productIds };
  }

  async findOneByName(name: string) {
    const res = await this.databaseService.runQuery(
      `SELECT * from category WHERE name=$1`,
      [name],
    );

    return res.rows[0];
  }

  async findOneWithProducts(id: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT id, name, description FROM category WHERE id = $1
      `,
      [id],
    );

    const category = res.rows[0];

    const productsRes = await this.databaseService.runQuery(
      `
      SELECT json_agg(
          json_build_object(
              'id', product.id,
              'name', product.name,
              'price', product.price,
              'description', product.description,
              'image_url', product.image_url,
              'discount_id', product.discount_id
          )
      ) AS products
      FROM product_category
      JOIN product ON product.id = product_category.product_id 
      WHERE product_category.category_id = $1 AND product.deleted_at is null
    `,
      [id],
    );

    category.products = productsRes.rows[0].products;
    return category;
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
}

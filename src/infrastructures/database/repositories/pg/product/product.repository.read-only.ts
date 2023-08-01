import { ReadonlyProductRepositoryPort } from '@application/interface/product';
import { ReadonlyRepositoryBase } from '@base/database/repositories/pg';
import { PaginationParams } from '@base/use-cases/query-handler';
import { DatabaseService } from '@config/pg';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProductSchema, ProductWithDetailsSchema } from './product.schema';

@Injectable()
export class ReadOnlyProductRepository
  extends ReadonlyRepositoryBase<ProductSchema>
  implements ReadonlyProductRepositoryPort
{
  constructor(databaseService: DatabaseService) {
    super({
      databaseService,
    });
  }
  async findByIdWithDiscount(id: string): Promise<ProductWithDetailsSchema> {
    const res = await this.databaseService.runQuery(
      `
        SELECT product.id AS id, product.name AS name, product.price AS price, product.description AS description, product.image_url AS image_url, product.discount_id AS discount_id, 
        discount.id AS discount_id, discount.name AS discount_name, discount.description AS discount_description, discount.percentage AS discount_percentage, discount.active AS discount_active 
        FROM product
        JOIN discount ON product.discount_id=discount.id
        WHERE product.id=$1 AND product.deleted_at is null AND discount.deleted_at is null; 
      `,
      [id],
    );

    return res.rows[0];
  }

  async findByDiscountId(id: string): Promise<ProductSchema[]> {
    const res = await this.databaseService.runQuery(
      `
        SELECT id, name, price, description, image_url, discount_id from product WHERE discount_id=$1 and deleted_at is null
      `,
      [id],
    );

    return res.rows;
  }

  async findOneById(id: string): Promise<ProductSchema> {
    const res = await this.databaseService.runQuery(
      `
        SELECT id, name, price, description, image_url from product WHERE id=$1 and deleted_at is null
      `,
      [id],
    );

    return res.rows[0];
  }

  async findByIdWithDetails(id: string): Promise<ProductWithDetailsSchema> {
    const res = await this.databaseService.runQuery(
      `
        SELECT product.id AS id, product.name AS name, product.price AS price, product.description AS description, product.image_url AS image_url, product.discount_id AS discount_id, 
        discount.id AS discount_id, discount.name AS discount_name, discount.description AS discount_description, discount.percentage AS discount_percentage, discount.active AS discount_active 
        FROM product
        JOIN discount ON product.discount_id=discount.id
        WHERE product.id=$1 AND product.deleted_at is null AND discount.deleted_at is null; 
      `,
      [id],
    );

    const model = res.rows[0];

    const product = plainToInstance(ProductWithDetailsSchema, model);

    const categoryIdsRes = await this.databaseService.runQuery(
      `
        SELECT ARRAY(
          SELECT category_id FROM product_category
          WHERE product_id=$1
        ) AS category_ids
    `,
      [product.id],
    );

    product.category_ids = categoryIdsRes.rows[0].category_ids;

    return product;
  }

  async findOneByName(name: string): Promise<ProductSchema> {
    const res = await this.databaseService.runQuery(
      `
        SELECT id, name, price, description, image_url from product WHERE name=$1 and deleted_at is null
      `,
      [name],
    );

    return res.rows[0];
  }

  async findAll(filter: PaginationParams): Promise<ProductSchema[]> {
    const { limit, offset } = filter;

    const res = await this.databaseService.runQuery(
      ` 
        SELECT id, name, price, description, image_url from product 
        WHERE deleted_at is null
        ORDER BY updated_at ASC
        OFFSET $1 LIMIT $2;
      `,
      [offset, limit],
    );

    return res.rows;
  }
}

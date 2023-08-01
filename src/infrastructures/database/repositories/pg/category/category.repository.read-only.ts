import { ReadOnlyCategoryRepositoryPort } from '@application/interface/category';
import { ReadonlyRepositoryBase } from '@base/database/repositories/pg';
import { PaginationParams } from '@base/use-cases/query-handler';
import { DatabaseService } from '@config/pg';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CategorySchema, CategorySchemaWithProducts } from './category.schema';

@Injectable()
export class ReadOnlyCategoryRepository
  extends ReadonlyRepositoryBase<CategorySchema>
  implements ReadOnlyCategoryRepositoryPort
{
  constructor(databaseService: DatabaseService) {
    super({
      databaseService,
    });
  }
  async findOneWithProducts(id: string): Promise<CategorySchemaWithProducts> {
    const res = await this.databaseService.runQuery(
      `
        SELECT id, name, description FROM category WHERE id = $1
      `,
      [id],
    );

    const category = plainToInstance(CategorySchemaWithProducts, res.rows[0]);

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

  async findOneById(id: string): Promise<CategorySchema> {
    const res = await this.databaseService.runQuery(
      `
        SELECT id, name, description FROM category WHERE id = $1 and deleted_at is null
      `,
      [id],
    );

    return res.rows[0];
  }
  async findAll(filter: PaginationParams): Promise<CategorySchema[]> {
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
  async findOneByName(name: string): Promise<CategorySchema> {
    const res = await this.databaseService.runQuery(
      `
        SELECT id, name, description FROM category 
        WHERE name = $1 and deleted_at is null
      `,
      [name],
    );

    return res.rows[0];
  }
}

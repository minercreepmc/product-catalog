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
        SELECT id, name, price, description, image_url, discount_id from product WHERE id=$1 and deleted_at is null
      `,
      [id],
    );

    const model = plainToInstance(ProductSchema, res.rows[0]);

    model.category_ids = await this.getCategoryIds(id);

    return model;
  }

  async findByIdWithDetails(id: string): Promise<ProductWithDetailsSchema> {
    const res = await this.databaseService.runQuery(
      `
        SELECT id, name, price, description, image_url, discount_id from product WHERE id=$1 and deleted_at is null
      `,
      [id],
    );

    const model = plainToInstance(ProductWithDetailsSchema, res.rows[0]);

    if (model?.discount_id) {
      model.discount = await this.getDiscount(model.discount_id);
    }

    model.category_ids = await this.getCategoryIds(id);

    if (model?.category_ids) {
      model.categories = await this.getCategories(id);
    }

    return model;
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

  private async getCategoryIds(productId: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT ARRAY[category_id] as category_ids from product_category WHERE product_id=$1
      `,
      [productId],
    );

    return res.rows[0]?.category_ids;
  }

  private async getDiscount(discountId: string) {
    const res = await this.databaseService.runQuery(
      `
          SELECT id, name, description, percentage, active from discount WHERE id=$1 and deleted_at is null
      `,
      [discountId],
    );

    return res.rows[0];
  }

  private async getCategories(productId: string) {
    const res = await this.databaseService.runQuery(
      `
       SELECT json_agg(
          json_build_object(
              'id', category.id,
              'name', category.name,
              'description', category.description
          )
      ) AS categories
      FROM product_category
      JOIN product ON product.id = product_category.product_id 
      JOIN category ON product_category.category_id = category.id
      WHERE product_category.product_id = $1 AND category.deleted_at IS NULL

        `,
      [productId],
    );

    return res.rows[0].categories;
  }
}

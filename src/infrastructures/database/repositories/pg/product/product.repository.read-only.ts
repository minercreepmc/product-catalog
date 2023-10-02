import { ReadonlyProductRepositoryPort } from '@application/interface/product';
import { ReadonlyRepositoryBase } from '@base/database/repositories/pg';
import { PaginationParams } from '@base/use-cases/query-handler';
import { DatabaseService } from '@config/database';
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

  async findSortByBestDiscount(
    params: PaginationParams,
  ): Promise<ProductSchema[]> {
    const res = await this.databaseService.runQuery(
      `
        SELECT product.id, product.name, product.price, product.description, product.image_url, product.discount_id, product.sold from product 
        JOIN discount ON product.discount_id = discount.id
        WHERE product.deleted_at is null AND discount.active = true
        ORDER BY discount.percentage DESC
        OFFSET $1 LIMIT $2
      `,
      [params.offset, params.limit],
    );

    return res.rows;
  }

  async findSortByBestSelling(
    params: PaginationParams,
  ): Promise<ProductSchema[]> {
    const res = await this.databaseService.runQuery(
      `
        SELECT id, name, price, description, image_url, discount_id, sold from product 
        WHERE deleted_at is null
        ORDER BY sold DESC
        OFFSET $1 LIMIT $2
      `,
      [params.offset, params.limit],
    );

    return res.rows;
  }

  async findByDiscountId(id: string): Promise<ProductSchema[]> {
    const res = await this.databaseService.runQuery(
      `
        SELECT id, name, price, description, image_url, discount_id, sold from product WHERE discount_id=$1 and deleted_at is null
      `,
      [id],
    );

    return res.rows;
  }

  async findByCategoryId(categoryId: string): Promise<ProductSchema[]> {
    const res = await this.databaseService.runQuery(
      `
        SELECT product.id, product.name, product.price, product.description, product.image_url, product.discount_id, product.sold 
        FROM product 
        JOIN product_category 
        ON product_category.product_id = product.id
        WHERE product_category.category_id=$1 and deleted_at is null
      `,
      [categoryId],
    );

    return res.rows;
  }

  async findOneById(id: string): Promise<ProductSchema> {
    const res = await this.databaseService.runQuery(
      `
        SELECT id, name, price, description, image_url, discount_id, sold from product WHERE id=$1 and deleted_at is null
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
        SELECT id, name, price, description, image_url, discount_id, sold from product WHERE id=$1 and deleted_at is null
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
        SELECT id, name, price, description, image_url, sold from product WHERE name=$1 and deleted_at is null
      `,
      [name],
    );

    return res.rows[0];
  }

  async findAll(filter: PaginationParams): Promise<ProductSchema[]> {
    const { limit, offset } = filter;

    const res = await this.databaseService.runQuery(
      ` 
        SELECT product.id, product.name, product.price, product.description,
        product.image_url, product.sold, COALESCE(discount.percentage, 0) as discount from product
        LEFT JOIN discount ON product.discount_id = discount.id
        WHERE product.deleted_at is null
        ORDER BY product.updated_at ASC
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

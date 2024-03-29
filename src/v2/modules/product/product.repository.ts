import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@config/database';
import type { PaginationParams } from '@constants';
import { OrderStatus } from '@v2/order/constants';
import type { ProductModel } from './model';
import type { CreateProductDto, UpdateProductDto } from './dto';
import type { CreateProductRO, ProductRO } from './ro';

export interface UpdateCategoryForProduct {
  id: string;
  categoryIds: string[];
}

export interface UpdateDiscountForProduct {
  id: string;
  discountId: string | null;
}

@Injectable()
export class ProductRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateProductDto) {
    const res = await this.databaseService.runQuery(
      `INSERT into product 
          (name, price, description, discount_id) 
      VALUES 
          ($1, $2, $3, $4)
      RETURNING *`,
      [dto.name, dto.price, dto.description, dto.discountId],
    );

    const product: CreateProductRO = res.rows[0];

    if (dto.categoryIds && dto.categoryIds.length > 0) {
      const res = await this.databaseService.runQuery(
        `
            INSERT INTO product_category (product_id, category_id)
            SELECT $1, unnest($2::varchar[]) AS category_ids
            RETURNING category_id as category_ids
          `,
        [product.id, dto.categoryIds],
      );

      product.category_ids = Array.isArray(res.rows[0]?.category_ids)
        ? res.rows[0]?.category_ids
        : [res.rows[0]?.category_ids];
    }

    if (dto.imageUrls && dto.imageUrls.length > 0) {
      const res = await this.databaseService.runQuery(
        `
            INSERT INTO product_image (product_id, url)
            SELECT $1, unnest($2::varchar[]) AS image_urls
            RETURNING url as image_urls
          `,
        [product.id, dto.imageUrls],
      );

      product.image_urls = Array.isArray(res.rows[0]?.image_urls)
        ? res.rows[0]?.image_urls
        : [res.rows[0]?.image_urls];
    }

    return product;
  }

  async updateCategoryIds(dto: UpdateCategoryForProduct) {
    await this.databaseService.runQuery(
      `
      -- First, remove existing associations except for the ones in the new list
      DELETE FROM product_category
      WHERE product_id = $1
        AND category_id NOT IN (SELECT unnest($2::varchar[]));
    `,
      [dto.id, dto.categoryIds],
    );

    const res = await this.databaseService.runQuery(
      `
      -- Next, insert the new list of category IDs
      INSERT INTO product_category (product_id, category_id)
      SELECT $1, unnest($2::varchar[])
       ON CONFLICT (product_id, category_id) DO NOTHING
      RETURNING category_id;
    `,
      [dto.id, dto.categoryIds],
    );

    return res.rows.map((row) => row.category_id);
  }

  async deleteOneById(id: string) {
    const res = await this.databaseService.runQuery(
      `
      DELETE FROM product WHERE id=$1 RETURNING *
    `,
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
      `
      SELECT * from product WHERE id=$1;
    `,
      [id],
    );

    return res.rows[0];
  }

  async findOneByName(name: string) {
    const res = await this.databaseService.runQuery(
      `SELECT * from product WHERE name=$1`,
      [name],
    );

    return res.rows[0];
  }

  async updateOneById(
    id: string,
    dto: UpdateProductDto,
  ): Promise<ProductModel> {
    const { discountId, name, price, description } = dto;
    const res = await this.databaseService.runQuery(
      `
        UPDATE product
        SET 
            name = COALESCE($2, name),
            price = COALESCE($3, price),
            description = COALESCE($4, description),
            discount_id = COALESCE($5, discount_id),
        WHERE
            id = $1
        RETURNING *;
      `,
      [id, name, price, description, discountId],
    );
    return res.rows[0];
  }

  async updateDiscount(dto: UpdateDiscountForProduct) {
    const { discountId, id } = dto;
    if (discountId) {
      const res = await this.databaseService.runQuery(
        `
        UPDATE product 
        SET discount_id=$1
        WHERE id=$2
        RETURNING discount_id;
      `,
        [discountId, id],
      );
      return res.rows[0].discount_id;
    } else {
      const res = await this.databaseService.runQuery(
        `
          UPDATE product
          SET discount_id=null
          WHERE id=$1
          RETURNING discount_id;
        `,
        [id],
      );
      return res.rows[0].discount_id;
    }
  }

  async findSortByBestDiscount(params: PaginationParams) {
    const res = await this.databaseService.runQuery(
      `
        SELECT product.id, product.name, product.price, product.description, product.discount_id from product 
        JOIN discount ON product.discount_id = discount.id
        WHERE discount.active = true
        ORDER BY discount.percentage DESC
        OFFSET $1 LIMIT $2
      `,
      [params.offset, params.limit],
    );

    return res.rows;
  }

  async findSortByBestSelling(params: PaginationParams) {
    const res = await this.databaseService.runQuery(
      `
        SELECT id, name, price, description, discount_id from product 
        OFFSET $1 LIMIT $2
      `,
      [params.offset, params.limit],
    );

    return res.rows;
  }

  async findByDiscountId(id: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT id, name, price, description, discount_id from product WHERE discount_id=$1 
      `,
      [id],
    );

    return res.rows;
  }

  async findByCategoryId(categoryId: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT product.id, product.name, product.price, product.description, product.discount_id
        FROM product 
        JOIN product_category 
        ON product_category.product_id = product.id
        WHERE product_category.category_id=$1;
      `,
      [categoryId],
    );

    return res.rows;
  }

  async findByIdWithDetails(id: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT product.*, to_json(discount) as discount, 
            COALESCE(json_agg(DISTINCT category) FILTER (WHERE category.id IS NOT NULL), '[]'::json) AS categories,
            COALESCE(json_agg(product_image.url) FILTER (WHERE product_image.id IS NOT NULL), '[]'::json) AS image_urls
        FROM product
        LEFT JOIN discount ON product.discount_id = discount.id
        LEFT JOIN product_category ON product.id = product_category.product_id
        LEFT JOIN category ON category.id = product_category.category_id
        LEFT JOIN product_image ON product.id = product_image.product_id
        WHERE product.id = $1
        GROUP BY product.id, discount.id;
      `,
      [id],
    );

    const model: ProductRO = res.rows[0];

    if (!model) {
      throw new NotFoundException('Cannot find product');
    }

    model.category_ids = model.categories.map((c) => c.id);

    return model;
  }

  async findAllWithDetails(filter: PaginationParams) {
    const { limit = 0, offset = 1 } = filter;

    const res = await this.databaseService.runQuery(
      ` 
        SELECT 
          product.id, 
          product.name, 
          product.price, 
          product.description,
          to_json(discount) as discount,
          COALESCE(json_agg(product_image.url) FILTER (WHERE product_image.id IS NOT NULL), '[]'::json) AS image_urls, 
          COALESCE(json_agg(category) FILTER (WHERE category.id IS NOT NULL), '[]'::json) AS categories,
          product.price - (product.price * discount.percentage / 100) AS new_price 
        FROM product
        LEFT JOIN discount ON product.discount_id = discount.id
        LEFT JOIN product_image ON product_image.product_id = product.id
        LEFT JOIN product_category ON product_category.product_id = product.id
        LEFT JOIN category ON category.id = product_category.category_id
        GROUP BY product.id, discount.id
        ORDER BY product.updated_at ASC
        OFFSET $1 LIMIT $2
      `,
      [offset, limit],
    );

    return res.rows;
  }

  async findAllWithImages(filter: PaginationParams) {
    const { limit = 0, offset = 1 } = filter;

    const res = await this.databaseService.runQuery(
      `
        SELECT p.id, p.name, p.price, p.description, 
          COALESCE(json_agg(p_image.url) FILTER (WHERE p_image.id IS NOT NULL), '[]'::json) AS image_urls
        FROM product p
        LEFT JOIN product_image p_image ON p_image.product_id = p.id
        GROUP BY p.id
        ORDER BY p.updated_at ASC
        OFFSET $1 LIMIT $2
      
      `,
      [offset, limit],
    );

    return res.rows;
  }

  async getSoldProductDaily() {
    const res = await this.databaseService.runQuery(
      `
      SELECT COUNT(*) as sold
      FROM order_details
      WHERE status = $1
        AND date_trunc('day', updated_at) = date_trunc('day', current_date)
    `,
      [OrderStatus.COMPLETED],
    );
    return res.rows[0].sold;
  }

  async getSoldProductMonthly() {
    const res = await this.databaseService.runQuery(
      `
      SELECT COUNT(*) as sold
      FROM order_details
      WHERE status = $1
        AND date_trunc('month', updated_at) = date_trunc('month', current_date)
    `,
      [OrderStatus.COMPLETED],
    );
    return res.rows[0].sold;
  }

  async getSoldProductWeekly() {
    const res = await this.databaseService.runQuery(
      `
      SELECT COUNT(*) as sold
      FROM order_details
      WHERE status = $1
        AND date_trunc('week', updated_at) = date_trunc('week', current_date)
    `,
      [OrderStatus.COMPLETED],
    );
    return res.rows[0].sold;
  }
}

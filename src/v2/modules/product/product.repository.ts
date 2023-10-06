import { DatabaseService } from '@config/database';
import { PaginationParams } from '@constants';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { CreateProductRO, ProductRO, UpdateProductRO } from './ro';

export interface UpdateCategoryForProduct {
  id: string;
  categoryIds: string[];
}

export interface UpdateDiscountForProduct {
  id: string;
  discountId: string;
}

@Injectable()
export class ProductRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreateProductDto) {
    const res = await this.databaseService.runQuery(
      `INSERT into product 
          (name, price, description, discount_id, sold) 
      VALUES 
          ($1, $2, $3, $4, $5)
      RETURNING *`,
      [dto.name, dto.price, dto.description, dto.discountId, 0],
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

  private async updateCategoryIds(dto: UpdateCategoryForProduct) {
    if (!dto.categoryIds || dto.categoryIds.length === 0) {
      const res = await this.databaseService.runQuery(
        `
          DELETE 
          FROM product_category
          WHERE product_id = $1
          AND category_id NOT IN (SELECT unnest($2::varchar[]))
          RETURNING category_id as category_ids
        `,
        [dto.id, dto.categoryIds],
      );
      return res.rows[0]?.category_ids;
    }

    const res = await this.databaseService.runQuery(
      `
          INSERT INTO product_category (product_id, category_id)
          SELECT $1, unnest($2::varchar[]) AS category_ids
          RETURNING category_id as category_ids

      `,
      [dto.id, dto.categoryIds],
    );

    return Array.isArray(res.rows[0]?.category_ids)
      ? res.rows[0]?.category_ids
      : [res.rows[0].category_ids];
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
      `SELECT * from product WHERE name=$1 AND deleted_at IS NULL`,
      [name],
    );

    return res.rows[0];
  }

  async updateOneById(id: string, dto: UpdateProductDto) {
    const { discountId, name, price, sold, description, categoryIds } = dto;
    const res = await this.databaseService.runQuery(
      `
        UPDATE product
        SET 
            name = COALESCE($2, name),
            price = COALESCE($3, price),
            description = COALESCE($4, description),
            discount_id = COALESCE($5, discount_id),
            sold = COALESCE($6, sold)
        WHERE
            id = $1
        RETURNING *;
      `,
      [id, name, price, description, discountId, sold],
    );
    const updated: UpdateProductRO = res.rows[0];

    if (categoryIds && categoryIds.length >= 0) {
      updated.category_ids = await this.updateCategoryIds({
        id,
        categoryIds,
      });
    }

    if (discountId) {
      updated.discount_id = await this.updateDiscount({
        id,
        discountId,
      });
    }

    return updated;
  }

  private async updateDiscount(dto: UpdateDiscountForProduct) {
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
        SELECT product.id, product.name, product.price, product.description, product.discount_id, product.sold from product 
        JOIN discount ON product.discount_id = discount.id
        WHERE product.deleted_at is null AND discount.active = true
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
        SELECT id, name, price, description, discount_id, sold from product 
        WHERE deleted_at is null
        ORDER BY sold DESC
        OFFSET $1 LIMIT $2
      `,
      [params.offset, params.limit],
    );

    return res.rows;
  }

  async findByDiscountId(id: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT id, name, price, description, discount_id, sold from product WHERE discount_id=$1 and deleted_at is null
      `,
      [id],
    );

    return res.rows;
  }

  async findByCategoryId(categoryId: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT product.id, product.name, product.price, product.description, product.discount_id, product.sold 
        FROM product 
        JOIN product_category 
        ON product_category.product_id = product.id
        WHERE product_category.category_id=$1 and deleted_at is null
      `,
      [categoryId],
    );

    return res.rows;
  }

  async findByIdWithDetails(id: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT product.*, discount.id as discount_id, discount.name as discount_name,
      discount.percentage as discount_percentage,
            COALESCE(json_agg(category) FILTER (WHERE category.id IS NOT NULL), '[]'::json) AS categories
        FROM product
        LEFT JOIN discount ON product.discount_id = discount.id
        LEFT JOIN product_category ON product.id = product_category.product_id
        LEFT JOIN category ON category.id = product_category.category_id
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
        SELECT product.id, product.name, product.price, product.description,
          product.sold, discount.id as discount_id, COALESCE(discount.percentage, 0) as discount_percentage,
          COALESCE(json_agg(product_image) FILTER (WHERE product_image.id IS NOT NULL), '[]'::json) AS image_urls, 
          COALESCE(json_agg(category) FILTER (WHERE category.id IS NOT NULL), '[]'::json) AS categories
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
}

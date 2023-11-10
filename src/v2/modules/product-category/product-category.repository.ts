import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@config/database';
import type { PaginationParams } from '@constants';

@Injectable()
export class ProductCategoryRepository {
  constructor(private databaseService: DatabaseService) {}
  async findProductsByCategory(categoryId: string, filter: PaginationParams) {
    const { limit = 0, offset = 1 } = filter;

    const res = await this.databaseService.runQuery(
      `
        SELECT 
          product.id, 
          product.name, 
          product.price, 
          product.description,  
          product.sold, 
          to_json(discount) as discount,
          COALESCE(json_agg(product_image.url) FILTER (WHERE product_image.id IS NOT NULL), '[]'::json) AS image_urls, 
          COALESCE(json_agg(category) FILTER (WHERE category.id IS NOT NULL), '[]'::json) AS categories,
          product.price - (product.price * discount.percentage / 100) AS new_price 
        FROM product
        LEFT JOIN discount ON product.discount_id = discount.id
        LEFT JOIN product_image ON product_image.product_id = product.id
        LEFT JOIN product_category ON product_category.product_id = product.id
        LEFT JOIN category ON category.id = product_category.category_id
        WHERE category.id = $3
        GROUP BY product.id, discount.id
        ORDER BY product.updated_at ASC
        OFFSET $1 LIMIT $2
      `,
      [offset, limit, categoryId],
    );

    return res.rows;
  }
}

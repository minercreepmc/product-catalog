import { DatabaseService } from '@config/database';
import { KyselyDatabase } from '@config/kysely';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import type {
  CreateCartItemDto,
  UpdateCartItemDto,
  UpsertCartItemDto,
} from './dto';
import { CartItemRO } from './ro';

@Injectable()
export class CartItemRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly database: KyselyDatabase,
  ) {}

  async create(userId: string, dto: CreateCartItemDto) {
    const { productId, amount } = dto;
    const res = await this.databaseService.runQuery(
      `
        INSERT INTO cart_item (cart_id, product_id, amount) VALUES ((
          SELECT id FROM cart
          WHERE user_id = $1
        ), $2, $3) RETURNING *;
      `,
      [userId, productId, amount],
    );

    return res.rows[0];
  }

  async update(cartItemId: string, dto: UpdateCartItemDto) {
    const { amount } = dto;

    await this.databaseService.runQuery(
      `
        UPDATE cart_item SET amount=$1 WHERE id=$2;
      `,
      [amount, cartItemId],
    );
  }

  async upsert(userId: string, dto: UpsertCartItemDto) {
    const { productId, amount } = dto;
    const res = await this.databaseService.runQuery(
      `
        INSERT INTO cart_item (product_id, amount, cart_id) 
        VALUES ($1, $2, (SELECT id FROM cart WHERE user_id = $3)) 
          ON CONFLICT (product_id, cart_id) 
        DO UPDATE SET amount = cart_item.amount + $2
        RETURNING product_id;
      `,
      [productId, amount, userId],
    );
    return res.rows[0].product_id;
  }

  async delete(cartItemId: string) {
    const res = await this.databaseService.runQuery(
      `
        DELETE FROM cart_item WHERE id=$1 RETURNING *;
      `,
      [cartItemId],
    );

    return res.rows[0];
  }

  async findByUserId(userId: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT 
          i.id, i.amount,
          p.id as product_id, p.name as product_name, p.price as product_price, 
        d.id as discount_id, d.name as discount_name, d.percentage as discount_percentage,
          COALESCE(json_agg(pi.url) FILTER (WHERE pi.id IS NOT NULL), '[]'::json) AS image_urls,
          p.price - (p.price * d.percentage / 100) AS product_new_price 
        FROM cart_item i 
        INNER JOIN product p ON p.id = i.product_id
        LEFT JOIN product_image pi ON pi.product_id = p.id
        LEFT JOIN discount d ON d.id = p.discount_id
        WHERE cart_id = (
          SELECT id FROM cart WHERE user_id = $1
        )
        GROUP BY i.id, p.id, d.id
      `,
      [userId],
    );

    return res.rows;
  }

  async getDetailByUserIdAndProductId(userId: string, productId: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT 
          i.id, i.amount,
          p.id as product_id, p.name as product_name, p.price as product_price, 
        d.id as discount_id, d.name as discount_name, d.percentage as discount_percentage,
          COALESCE(json_agg(pi.url) FILTER (WHERE pi.id IS NOT NULL), '[]'::json) AS image_urls,
          p.price - (p.price * d.percentage / 100) AS product_new_price 
        FROM cart_item i 
        INNER JOIN product p ON p.id = i.product_id
        LEFT JOIN product_image pi ON pi.product_id = p.id
        LEFT JOIN discount d ON d.id = p.discount_id
        WHERE cart_id = (
          SELECT id FROM cart WHERE user_id = $1
        ) AND i.product_id = $2 
        GROUP BY i.id, p.id, d.id
    `,
      [userId, productId],
    );

    return plainToInstance(CartItemRO, res.rows[0], {
      excludeExtraneousValues: true,
    });
  }

  async getDetailByCartItemId(cartItemId: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT 
          i.id, i.amount,
          p.id as product_id, p.name as product_name, p.price as product_price, 
        d.id as discount_id, d.name as discount_name, d.percentage as discount_percentage,
          COALESCE(json_agg(pi.url) FILTER (WHERE pi.id IS NOT NULL), '[]'::json) AS image_urls,
          p.price - (p.price * d.percentage / 100) AS product_new_price 
        FROM cart_item i 
        INNER JOIN product p ON p.id = i.product_id
        LEFT JOIN product_image pi ON pi.product_id = p.id
        LEFT JOIN discount d ON d.id = p.discount_id
        WHERE i.id = $1
        GROUP BY i.id, p.id, d.id
    `,
      [cartItemId],
    );

    return plainToInstance(CartItemRO, res.rows[0], {
      excludeExtraneousValues: true,
    });
  }

  getByCartId(cartId: string) {
    return this.database
      .selectFrom('cart_item as item')
      .innerJoin('product', 'product.id', 'item.product_id')
      .leftJoin('discount', 'discount.id', 'product.discount_id')
      .leftJoin('discount as discount', 'discount.id', 'product.discount_id')
      .where('item.cart_id', '=', cartId)
      .select(['item.id', 'item.amount'])
      .select(['product.id', 'product.name', 'product.price'])
      .select(['discount.id', 'discount.name', 'discount.percentage'])
      .execute();
  }
}

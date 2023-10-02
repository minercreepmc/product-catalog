import { ReadonlyCartRepositoryPort } from '@application/interface/product';
import { ReadonlyRepositoryBase } from '@base/database/repositories/pg';
import { PaginationParams } from '@base/use-cases/query-handler';
import { DatabaseService } from '@config/database';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CartDetailsSchema, CartSchema } from './cart.schema';

@Injectable()
export class ReadOnlyCartRepository
  extends ReadonlyRepositoryBase<CartSchema>
  implements ReadonlyCartRepositoryPort
{
  constructor(databaseService: DatabaseService) {
    super({
      databaseService,
    });
  }

  findOneById(id: string): Promise<CartSchema | null> {
    throw new Error('Method not implemented.');
  }
  findAll(filter: PaginationParams): Promise<CartSchema[] | null> {
    throw new Error('Method not implemented.');
  }

  async findOneWithItems(userId: string): Promise<CartDetailsSchema> {
    const res = await this.databaseService.runQuery(
      `
        SELECT cart.user_id, cart.id, cart.total_price, cart_item.amount, product.name, product.price, product.id as product_id, product.image_url, discount.percentage AS discount
        FROM cart 
        LEFT OUTER JOIN cart_item ON cart_item.cart_id = cart.id
        LEFT OUTER JOIN product ON product.id = cart_item.product_id
        LEFT OUTER JOIN discount ON product.discount_id = discount.id
        WHERE cart.user_id = $1;
      `,
      [userId],
    );

    const cartDetails: CartDetailsSchema = {
      id: res.rows[0].id,
      user_id: res.rows[0].user_id,
      total_price: res.rows[0].total_price,
    } as CartDetailsSchema;

    res.rows.forEach((row) => {
      const { amount, name, price, product_id, image_url, discount } = row;

      if (!cartDetails.items) {
        cartDetails.items = [];
      }

      if (name && price) {
        cartDetails.items.push({
          amount,
          discount,
          product: {
            id: product_id,
            name,
            price,
            image_url,
          },
        });
      }
    });

    return plainToInstance(CartDetailsSchema, cartDetails);
  }
}

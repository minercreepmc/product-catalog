import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '@config/database';
import type { UpdateCartDto } from './dto';
import { KyselyDatabase } from '@config/kysely';

@Injectable()
export class CartRepository {
  logger = new Logger(CartRepository.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly database: KyselyDatabase,
  ) {}

  create(userId: string) {
    return this.database
      .insertInto('cart')
      .values({ user_id: userId })
      .execute();
  }

  async updateByUserId(userId: string, dto: UpdateCartDto) {
    const { addressId, shippingFeeId, shippingMethodId } = dto;
    let query = this.database
      .updateTable('cart')
      .where('user_id', '=', userId)
      .returningAll();

    if (dto.hasOwnProperty('addressId')) {
      query = query.set({ address_id: addressId });
    }

    if (dto.hasOwnProperty('shippingFeeId')) {
      query = query.set({ shipping_fee_id: shippingFeeId });
    }

    if (dto.hasOwnProperty('shippingMethodId')) {
      query = query.set({ shipping_method_id: shippingMethodId });
    }

    return query.execute();
  }

  getByUserId(userId: string) {
    return this.database
      .selectFrom('cart')
      .selectAll('cart')
      .where('cart.user_id', '=', userId)
      .executeTakeFirst();
  }

  async clearCart(cartId: string) {
    await this.database
      .deleteFrom('cart_item')
      .where('cart_id', '=', cartId)
      .execute();
    await this.database
      .updateTable('cart')
      .set({
        shipping_fee_id: null,
        shipping_method_id: null,
        address_id: null,
      })
      .where('id', '=', cartId)
      .execute();
  }

  async getTotalPrice(cartId: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT SUM(COALESCE(f.fee, 0) + (p.price - (p.price * COALESCE(d.percentage, 0) / 100)) * i.amount)
      FROM cart_item i
      LEFT JOIN cart c ON c.id = i.cart_id
      INNER JOIN product p ON p.id = i.product_id
      LEFT JOIN discount d ON d.id = p.discount_id
      LEFT JOIN shipping_fee f ON f.id = c.shipping_fee_id AND f.deleted_at IS NULL
      WHERE c.id = $1
    `,
      [cartId],
    );
    return res.rows[0].sum ? res.rows[0].sum : 0;
  }

  async getShippingFeeId(cartId: string) {
    const res = await this.database
      .selectFrom('cart')
      .leftJoin('shipping_fee', 'shipping_fee.id', 'cart.shipping_fee_id')
      .select('shipping_fee_id')
      .where('cart.id', '=', cartId)
      .where('shipping_fee.deleted_at', 'is', null)
      .executeTakeFirst();

    return res?.shipping_fee_id || null;
  }

  async getAddressId(cartId: string) {
    const res = await this.database
      .selectFrom('cart')
      .leftJoin('address', 'address.id', 'cart.address_id')
      .select('address_id')
      .where('cart.id', '=', cartId)
      .where('address.deleted_at', 'is', null)
      .executeTakeFirst();

    return res?.address_id || null;
  }

  async getShippingMethodId(cartId: string) {
    const res = await this.database
      .selectFrom('cart')
      .leftJoin(
        'shipping_method',
        'shipping_method.id',
        'cart.shipping_method_id',
      )
      .select('shipping_method_id')
      .where('cart.id', '=', cartId)
      .where('shipping_method.deleted_at', 'is', null)
      .executeTakeFirst();

    return res?.shipping_method_id || null;
  }

  async getIdByUserId(userId: string) {
    const res = await this.database
      .selectFrom('cart')
      .select('id')
      .where('cart.user_id', '=', userId)
      .executeTakeFirst();

    return res?.id;
  }
}

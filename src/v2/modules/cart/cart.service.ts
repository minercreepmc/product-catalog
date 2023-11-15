import { BaseService } from '@base';
import { ResultRO } from '@common/ro';
import { GlobalErrors } from '@constants';
import { Injectable } from '@nestjs/common';
import { CartItemRepository } from '@v2/cart-item';
import { ShippingFeeRepository } from '@v2/shipping-fee';
import { plainToInstance } from 'class-transformer';
import { CartRepository } from './cart.repository';
import type { UpdateCartDto } from './dto';
import { CartGetByUserIdRO, CartUpdateRO } from './ro';

@Injectable()
export class CartService extends BaseService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly cartItemRepository: CartItemRepository,
    private readonly shippingFeeRepository: ShippingFeeRepository,
  ) {
    super();
  }
  async create(userId: string) {
    await this.cartRepository.create(userId);
    return plainToInstance(ResultRO, { result: true });
  }

  async getByUserId(userId: string) {
    const cart = await this.cartRepository.getByUserId(userId);
    if (!cart) {
      this.formatError(
        GlobalErrors.CART.NOT_FOUND.status,
        GlobalErrors.CART.NOT_FOUND.code,
        GlobalErrors.CART.NOT_FOUND.message,
      );
    }

    const addressId = await this.cartRepository.getAddressId(cart!.id);

    const shippingFeeId = await this.cartRepository.getShippingFeeId(cart!.id);

    let shippingFee: any;

    if (shippingFeeId) {
      shippingFee = await this.shippingFeeRepository.findOne(shippingFeeId);
    }

    const items = await this.cartItemRepository.findByUserId(userId);
    const totalPrice = await this.cartRepository.getTotalPrice(cart!.id);
    return plainToInstance(
      CartGetByUserIdRO,
      {
        ...cart,
        address_id: addressId,
        shipping_fee: shippingFee?.fee || 0,
        items,
        total_price: totalPrice,
      },
      { excludeExtraneousValues: true },
    );
  }

  async update(userId: string, dto: UpdateCartDto) {
    const response = this.cartRepository.updateByUserId(userId, dto);
    return plainToInstance(CartUpdateRO, response, {
      excludeExtraneousValues: true,
    });
  }

  clearCart(userId: string) {
    return this.cartRepository.clearCart(userId);
  }
}

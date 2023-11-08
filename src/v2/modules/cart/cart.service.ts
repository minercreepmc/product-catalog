import { BaseService } from '@base-class';
import { GlobalErrors } from '@constants';
import { Injectable } from '@nestjs/common';
import type { CartRepository } from './cart.repository';
import type { UpdateCartDto } from './dto';

@Injectable()
export class CartService extends BaseService {
  constructor(private readonly cartRepository: CartRepository) {
    super();
  }
  create(userId: string) {
    return this.cartRepository.create(userId);
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

    cart.items = await this.cartRepository.getItems(cart.id);
    cart.total_price = await this.cartRepository.getTotalPrice(cart.id);
    return cart;
  }

  update(userId: string, dto: UpdateCartDto) {
    return this.cartRepository.update(userId, dto);
  }

  clearCart(userId: string) {
    return this.cartRepository.clearCart(userId);
  }
}

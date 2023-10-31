import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { UpdateCartDto } from './dto';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}
  create(userId: string) {
    return this.cartRepository.create(userId);

  }

  async getByUserId(userId: string) {
    const cart = await this.cartRepository.getByUserId(userId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
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

import { Injectable } from '@nestjs/common';
import { CartItemRepository } from './cart-item.repository';
import { CreateCartItemDto, UpdateCartItemDto } from './dtos';

@Injectable()
export class CartItemService {
  constructor(private readonly cartItemRepo: CartItemRepository) {}
  create(userId: string, dto: CreateCartItemDto) {
    return this.cartItemRepo.create(userId, dto);
  }

  update(id: string, dto: UpdateCartItemDto) {
    return this.cartItemRepo.update(id, dto);
  }

  delete(id: string) {
    return this.cartItemRepo.delete(id);
  }
}

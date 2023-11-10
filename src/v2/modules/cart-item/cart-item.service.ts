import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CartItemRepository } from './cart-item.repository';
import type {
  CreateCartItemDto,
  UpdateCartItemDto,
  UpsertCartItemDto,
} from './dto';
import { CartItemRO } from './ro';

@Injectable()
export class CartItemService {
  constructor(private readonly cartItemRepo: CartItemRepository) {}

  create(userId: string, dto: CreateCartItemDto) {
    return this.cartItemRepo.create(userId, dto);
  }

  async update(cartItemId: string, dto: UpdateCartItemDto) {
    await this.cartItemRepo.update(cartItemId, dto);
    return this.cartItemRepo.getDetailByCartItemId(cartItemId);
  }

  async upsert(userId: string, dto: UpsertCartItemDto) {
    const productId = await this.cartItemRepo.upsert(userId, dto);
    return this.cartItemRepo.getDetailByUserIdAndProductId(userId, productId);
  }

  delete(id: string) {
    return this.cartItemRepo.delete(id);
  }

  async getByUserId(userId: string) {
    const items = await this.cartItemRepo.findByUserId(userId);

    return plainToInstance(CartItemRO, items, {
      excludeExtraneousValues: true,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CartItemRepository } from './cart-item.repository';
import {
  CreateCartItemDto,
  UpdateCartItemDto,
  UpsertCartItemDto,
} from './dtos';
import { CartItemRO } from './ro';

@Injectable()
export class CartItemService {
  constructor(private readonly cartItemRepo: CartItemRepository) {}
  create(userId: string, dto: CreateCartItemDto) {
    return this.cartItemRepo.create(userId, dto);
  }

  update(id: string, dto: UpdateCartItemDto) {
    return this.cartItemRepo.update(id, dto);
  }

  upsert(userId: string, dto: UpsertCartItemDto) {
    return this.cartItemRepo.upsert(userId, dto);
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

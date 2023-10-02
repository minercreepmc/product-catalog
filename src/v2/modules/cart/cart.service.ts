import { Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}
  create(userId: string) {
    return this.cartRepository.create(userId);
  }

  getByUserId(userId: string) {
    return this.cartRepository.getByUserId(userId);
  }
}

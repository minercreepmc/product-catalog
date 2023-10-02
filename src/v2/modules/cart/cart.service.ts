import { Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { UpdateCartDto } from './dto';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}
  create(userId: string) {
    return this.cartRepository.create(userId);
  }

  getByUserId(userId: string) {
    return this.cartRepository.getByUserId(userId);
  }

  update(id: string, dto: UpdateCartDto) {
    return this.cartRepository.update(id, dto);
  }
}

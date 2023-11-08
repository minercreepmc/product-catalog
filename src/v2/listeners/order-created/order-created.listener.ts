import { GlobalEvents } from '@constants';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CartService } from '@v2/cart';
import type { OrderCreatedEvent } from '@v2/order/event';

@Injectable()
export class OrderCreatedListener {
  constructor(private readonly cartService: CartService) {}

  @OnEvent(GlobalEvents.ORDER.CREATED)
  async clearCart(event: OrderCreatedEvent) {
    await this.cartService.clearCart(event.cartId);
  }
}

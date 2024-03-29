import { GlobalEvents } from '@constants';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CartService } from '@v2/cart';
import type { UserCreatedEvent } from '@v2/users/events';

@Injectable()
export class UserCreatedListener {
  constructor(private readonly cartService: CartService) {}
  @OnEvent(GlobalEvents.USER.CREATED)
  async execute(event: UserCreatedEvent) {
    await this.cartService.create(event.userId);
  }
}

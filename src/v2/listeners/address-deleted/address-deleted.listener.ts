import { GlobalEvents } from '@constants';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AddressDeletedEvent } from '@v2/address/event';
import { CartRepository } from '@v2/cart';

@Injectable()
export class AddressDeletedListener {
  constructor(private readonly cartRepository: CartRepository) {}

  @OnEvent(GlobalEvents.ADDRESS.DELETED)
  async setCartAddressNull(event: AddressDeletedEvent) {
    await this.cartRepository.updateByUserId(event.userId, {
      addressId: null,
    });
  }
}

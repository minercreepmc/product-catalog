import { GlobalEvents } from '@constants';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CartRepository } from '@v2/cart';
import { ShippingFeeDeletedEvent } from '@v2/shipping-fee/event';

@Injectable()
export class ShippingFeeDeletedListener {
  constructor(private readonly cartRepository: CartRepository) {}

  @OnEvent(GlobalEvents.SHIPPING_FEE.DELETED)
  async setCartAddressNull(event: ShippingFeeDeletedEvent) {
    await this.cartRepository.updateByUserId(event.userId, {
      shippingFeeId: null,
    });
  }
}

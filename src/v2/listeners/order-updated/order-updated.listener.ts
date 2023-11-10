import { GlobalEvents } from '@constants';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderStatus } from '@v2/order/constants';
import type { OrderUpdatedEvent } from '@v2/order/event';
import { ShippingService } from '@v2/shipping';

@Injectable()
export class OrderUpdatedListener {
  constructor(private shippingService: ShippingService) {}

  @OnEvent(GlobalEvents.ORDER.UPDATED)
  async deleteShipping(event: OrderUpdatedEvent) {
    if (event.status === OrderStatus.CANCELED) {
      await this.shippingService.deleteByOrderId(event.orderId);
    }
  }
}

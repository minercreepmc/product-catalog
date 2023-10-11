import { GlobalEvents } from '@constants';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderService } from '@v2/order';
import { OrderStatus } from '@v2/order/constants';
import { ShippingCreatedEvent } from '@v2/shipping/event';

@Injectable()
export class ShippingCreatedListener {
  constructor(private orderService: OrderService) {}

  @OnEvent(GlobalEvents.SHIPPING.CREATED)
  async assigningShipperState(event: ShippingCreatedEvent) {
    await this.orderService.update(event.orderId, {
      status: OrderStatus.ASSIGNED,
    });
  }
}

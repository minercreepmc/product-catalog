import { GlobalEvents } from '@constants';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderService } from '@v2/order';
import { OrderStatus } from '@v2/order/constants';
import { ShippingDeletedEvent } from '@v2/shipping/event';

@Injectable()
export class ShippingDeletedListener {
  constructor(private orderService: OrderService) {}

  @OnEvent(GlobalEvents.SHIPPING.DELETED)
  async changeOrderStatus(event: ShippingDeletedEvent) {
    console.log(event.status);
    if (event.status !== OrderStatus.CANCELED) {
      await this.orderService.update(event.orderId, {
        status: OrderStatus.PROCESSING,
      });
    }
  }
}

import { UseInterceptors } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { TransformDataInterceptor } from '@interceptors';
import { ApiApplication } from '@constants';
import { OrderItemService } from './order-item.service';
import type { OrderItemGetByOrderIdDto } from './dto/order-item.dto';
import { OrderItemRO } from './ro';

@Controller(ApiApplication.ORDER_ITEM.CONTROLLER)
export class OrderItemController {
  constructor(private orderItemService: OrderItemService) {}

  @Post(ApiApplication.ORDER_ITEM.GET_BY_ORDER_ID)
  @UseInterceptors(new TransformDataInterceptor(OrderItemRO))
  getByOrderId(@Body() dto: OrderItemGetByOrderIdDto) {
    return this.orderItemService.getByOrderId(dto.orderId);
  }
}

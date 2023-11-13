import { ApiApplication } from '@constants';
import { Controller, Get } from '@nestjs/common';
import { ShippingMethodService } from './shipping-method.service';

@Controller(ApiApplication.SHIPPING_METHOD.CONTROLLER)
export class ShippingMethodController {
  constructor(private readonly shippingMethodService: ShippingMethodService) {}

  @Get(ApiApplication.SHIPPING_METHOD.GET_ALL)
  async getAll() {
    return this.shippingMethodService.getAll();
  }
}

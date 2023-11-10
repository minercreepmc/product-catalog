import { ApiApplication } from '@constants';
import { Res } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { Response } from 'express';
import { ShippingMethodService } from './shipping-method.service';

@Controller(ApiApplication.SHIPPING_METHOD.CONTROLLER)
export class ShippingMethodController {
  constructor(private readonly shippingMethodService: ShippingMethodService) {}

  @Get(ApiApplication.SHIPPING_METHOD.GET_ALL)
  async getAll(@Res() res: Response) {
    const result = await this.shippingMethodService.getAll();
    return res.status(result.status).json(result.body);
  }
}
